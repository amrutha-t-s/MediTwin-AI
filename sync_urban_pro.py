"""
MediTwin AI - Urban Pro 2 Smartwatch Hardware Bridge
Connects to Inbase Urban Pro 2 via Bluetooth Low Energy (BLE),
reads real-time physiological vitals (Heart Rate, Battery),
and synchronizes with the MediTwin Digital Twin backend.
"""

import sys
import os
import json
import asyncio
import datetime
from typing import Optional, Dict, Any

try:
    import requests
except ImportError:
    print("[ERROR] 'requests' is not installed. Run: pip install requests")
    sys.exit(1)

try:
    from bleak import BleakScanner, BleakClient
    from bleak.backends.device import BLEDevice
    from bleak.backends.scanner import AdvertisementData
except ImportError:
    print("[ERROR] 'bleak' is not installed. Run: pip install bleak")
    sys.exit(1)

# Bluetooth SIG Standard UUIDs
HR_SERVICE_UUID = "0000180d-0000-1000-8000-00805f9b34fb"
HR_MEASUREMENT_UUID = "00002a37-0000-1000-8000-00805f9b34fb"
BATTERY_SERVICE_UUID = "0000180f-0000-1000-8000-00805f9b34fb"
BATTERY_LEVEL_UUID = "00002a19-0000-1000-8000-00805f9b34fb"

# MediTwin API Config
DEFAULT_API_URL = "http://localhost:5000"
SESSION_CACHE_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".watch_session.json")


def load_cached_session() -> Dict[str, str]:
    if os.path.exists(SESSION_CACHE_FILE):
        try:
            with open(SESSION_CACHE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}


def save_cached_session(data: Dict[str, str]) -> None:
    try:
        with open(SESSION_CACHE_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        print(f"[Warning] Failed to save session cache: {e}")


def login_to_meditwin(api_url: str) -> Optional[str]:
    """Logs into MediTwin backend and returns JWT access token."""
    cache = load_cached_session()
    cached_token = cache.get("token")
    if cached_token:
        # Validate cached token
        try:
            test_res = requests.get(
                f"{api_url}/api/auth/profile",
                headers={"Authorization": f"Bearer {cached_token}"},
                timeout=3
            )
            if test_res.status_code == 200:
                print(" -> Authenticated using cached login session.")
                return cached_token
        except Exception:
            pass

    print("\n--- MediTwin User Authentication ---")
    email = input("Enter your MediTwin account Email: ").strip()
    import getpass
    password = getpass.getpass("Enter your MediTwin Password: ").strip()

    try:
        res = requests.post(
            f"{api_url}/api/auth/login",
            json={"email": email, "password": password},
            timeout=5
        )
        if res.status_code == 200:
            token = res.json().get("token")
            cache["token"] = token
            cache["email"] = email
            save_cached_session(cache)
            print(" -> Login successful! Session token saved.")
            return token
        else:
            err = res.json().get("error") or res.json().get("message") or "Invalid credentials"
            print(f"[Auth Error] {err}")
            return None
    except requests.exceptions.ConnectionError:
        print(f"[Error] Could not reach MediTwin backend at {api_url}.")
        print("Please ensure your Node.js backend is running ('npm run dev' or 'node server.js').")
        return None
    except Exception as e:
        print(f"[Auth Error] {e}")
        return None


def post_vitals_to_meditwin(api_url: str, token: str, vitals: Dict[str, Any]) -> bool:
    """Posts physiological vitals from watch into MediTwin Daily Health Logs."""
    payload = {
        "date": datetime.datetime.utcnow().isoformat() + "Z",
        **vitals
    }
    try:
        res = requests.post(
            f"{api_url}/api/health-logs",
            json=payload,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {token}"
            },
            timeout=5
        )
        if res.status_code in [200, 201]:
            print(f"[MediTwin Ingestion] OK: Successfully logged vitals to Digital Twin!")
            return True
        else:
            print(f"[MediTwin Ingestion] Server returned status {res.status_code}: {res.text}")
            return False
    except Exception as e:
        print(f"[MediTwin Ingestion Error] {e}")
        return False


def parse_heart_rate_data(data: bytearray) -> int:
    """Parses standard Bluetooth SIG Heart Rate Measurement (0x2A37)."""
    flags = data[0]
    hr_format_16bit = flags & 0x01
    if hr_format_16bit:
        bpm = int.from_bytes(data[1:3], byteorder="little")
    else:
        bpm = data[1]
    return int(bpm)


async def scan_for_devices(timeout: float = 6.0):
    """Scans for nearby BLE devices and returns discovered list."""
    print(f"\n[Bluetooth Scanner] Scanning for BLE devices ({timeout:.0f}s)...")
    print("TIP: If your Urban Pro 2 is connected to the Da Fit app on your phone,")
    print("     temporarily turn OFF your phone's Bluetooth so the watch becomes discoverable.\n")

    discovered = await BleakScanner.discover(timeout=timeout, return_adv=True)
    device_list = []

    for device, adv in discovered.values():
        name = device.name or adv.local_name or "Unknown"
        device_list.append({
            "name": name,
            "address": device.address,
            "rssi": adv.rssi,
            "device": device,
            "services": adv.service_uuids or []
        })

    # Sort by signal strength
    device_list.sort(key=lambda x: x["rssi"], reverse=True)
    return device_list


async def connect_and_stream(device_address: str, api_url: str, token: str, duration_sec: int = 30):
    """Connects to the watch, reads vitals, and sends them to MediTwin."""
    print(f"\nConnecting to watch at {device_address}...")

    latest_hr = None
    readings_count = 0

    def hr_notification_handler(sender, data):
        nonlocal latest_hr, readings_count
        try:
            bpm = parse_heart_rate_data(data)
            latest_hr = bpm
            readings_count += 1
            timestamp = datetime.datetime.now().strftime("%H:%M:%S")
            print(f"[{timestamp}] -> Live Heart Rate from Urban Pro 2: {bpm} BPM (reading #{readings_count})")
        except Exception as e:
            print(f"Failed to parse HR notification: {e}")

    try:
        async with BleakClient(device_address, timeout=15.0) as client:
            if not client.is_connected:
                print("[Error] Failed to connect to watch.")
                return

            print(f"[Connected] Successfully bonded with {device_address}!")

            # Check services
            services = client.services
            has_hr = False
            for service in services:
                if HR_SERVICE_UUID.lower() in service.uuid.lower():
                    has_hr = True
                    break

            # Read Battery if available
            try:
                battery_bytes = await client.read_gatt_char(BATTERY_LEVEL_UUID)
                battery_level = int(battery_bytes[0])
                print(f"[Watch Info] Battery Level: {battery_level}%")
            except Exception:
                pass

            if has_hr:
                print(f"[Sensors] Heart Rate sensor found! Subscribing to live telemetry for {duration_sec}s...")
                await client.start_notify(HR_MEASUREMENT_UUID, hr_notification_handler)
                await asyncio.sleep(duration_sec)
                await client.stop_notify(HR_MEASUREMENT_UUID)
            else:
                print("[Notice] Standard Heart Rate GATT not directly exposed via unbonded BLE.")
                print("Reading available device telemetry...")
                await asyncio.sleep(3.0)

            # Ingest final reading to MediTwin
            if latest_hr:
                print(f"\n[Sync] Pushing latest reading ({latest_hr} BPM) to MediTwin...")
                post_vitals_to_meditwin(api_url, token, {"heartRate": latest_hr})
            else:
                print("[Sync] No live heart rate packets received during sampling window.")

    except Exception as e:
        print(f"\n[Bluetooth Error] {e}")


def interactive_sync():
    print("=" * 65)
    print("     MEDITWIN AI - URBAN PRO 2 SMARTWATCH SYNC BRIDGE")
    print("=" * 65)

    api_url = DEFAULT_API_URL

    # Step 1: Authentication
    token = login_to_meditwin(api_url)
    if not token:
        print("\nAuthentication failed. Exiting.")
        return

    while True:
        print("\nMain Menu:")
        print(" [1] Scan for Urban Pro 2 & Nearby BLE Devices")
        print(" [2] Direct Connect & Stream Vitals (Auto-find Urban Pro 2)")
        print(" [3] Fast Manual Log (Copy readings from watch screen to MediTwin)")
        print(" [4] Exit")
        choice = input("\nSelect an option [1-4]: ").strip()

        if choice == "1":
            devices = asyncio.run(scan_for_devices(timeout=6.0))
            if not devices:
                print("No BLE devices found nearby. Ensure Bluetooth is ON on your PC and Watch.")
                continue

            print(f"\nFound {len(devices)} Bluetooth devices:")
            print(f"{'#':<3} {'Device Name':<28} {'Address / MAC':<20} {'RSSI (Signal)'}")
            print("-" * 65)
            for idx, d in enumerate(devices, 1):
                highlight = " ** [MATCH] **" if any(w in d["name"].lower() for w in ["urban", "pro", "inbase", "watch", "dafit"]) else ""
                print(f"{idx:<3} {d['name']:<28} {d['address']:<20} {d['rssi']} dBm{highlight}")

            pick = input("\nEnter number to connect (or press Enter to cancel): ").strip()
            if pick.isdigit() and 1 <= int(pick) <= len(devices):
                selected = devices[int(pick) - 1]
                cache = load_cached_session()
                cache["last_device_address"] = selected["address"]
                save_cached_session(cache)
                asyncio.run(connect_and_stream(selected["address"], api_url, token, duration_sec=20))

        elif choice == "2":
            cache = load_cached_session()
            last_addr = cache.get("last_device_address")
            if last_addr:
                print(f"Connecting to saved device address: {last_addr}")
                asyncio.run(connect_and_stream(last_addr, api_url, token, duration_sec=25))
            else:
                print("Searching automatically for Urban Pro 2...")
                devices = asyncio.run(scan_for_devices(timeout=5.0))
                target = None
                for d in devices:
                    if any(w in d["name"].lower() for w in ["urban", "pro", "inbase"]):
                        target = d
                        break

                if target:
                    print(f"Found {target['name']} ({target['address']})!")
                    asyncio.run(connect_and_stream(target["address"], api_url, token, duration_sec=25))
                else:
                    print("Could not find a device with 'Urban' or 'Pro' in its name.")
                    print("Please use Option [1] to view all discovered devices.")

        elif choice == "3":
            print("\n--- Fast Manual Entry (Read directly from your Urban Pro 2 screen) ---")
            hr_str = input("Current Heart Rate on watch (BPM) [e.g. 74]: ").strip()
            steps_str = input("Steps today on watch [e.g. 5200]: ").strip()
            bp_sys_str = input("Systolic BP (optional) [e.g. 120]: ").strip()
            bp_dia_str = input("Diastolic BP (optional) [e.g. 80]: ").strip()
            sleep_str = input("Sleep Hours last night (optional) [e.g. 7.5]: ").strip()

            vitals = {}
            if hr_str.isdigit():
                vitals["heartRate"] = int(hr_str)
            if steps_str.isdigit():
                vitals["steps"] = int(steps_str)
            if bp_sys_str.isdigit():
                vitals["bpSystolic"] = int(bp_sys_str)
            if bp_dia_str.isdigit():
                vitals["bpDiastolic"] = int(bp_dia_str)
            if sleep_str:
                try:
                    vitals["sleepHours"] = float(sleep_str)
                except ValueError:
                    pass

            if vitals:
                post_vitals_to_meditwin(api_url, token, vitals)
            else:
                print("No values entered.")

        elif choice == "4":
            print("Goodbye!")
            break


if __name__ == "__main__":
    interactive_sync()
