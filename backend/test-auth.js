async function testSignup() {
  const res = await fetch("http://localhost:4000/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "test@meditiwin.com",
      password: "Test1234",
    }),
  });

  const data = await res.json();
  console.log("Signup response:", data);

  // Now test login
  const loginRes = await fetch("http://localhost:4000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "test@meditiwin.com",
      password: "Test1234",
    }),
  });

  const loginData = await loginRes.json();
  console.log("Login response:", loginData);

  if (loginData.token) {
    // Test profile GET
    const profileRes = await fetch("http://localhost:4000/api/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${loginData.token}`,
      },
    });

    const profileData = await profileRes.json();
    console.log("Profile GET response:", profileData);

    // Test profile POST (create)
    const createProfileRes = await fetch("http://localhost:4000/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loginData.token}`,
      },
      body: JSON.stringify({
        age: 25,
        sex: "M",
        heightCm: 175,
        weightKg: 70,
        conditions: "diabetes",
        medications: "metformin",
        familyHistory: "father had diabetes",
      }),
    });

    const createProfileData = await createProfileRes.json();
    console.log("Profile POST response:", createProfileData);
  }
}

testSignup().catch(console.error);
