-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DailyEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "glucose" REAL,
    "bpSystolic" INTEGER,
    "bpDiastolic" INTEGER,
    "foodSummary" TEXT,
    "sleepHours" REAL,
    "steps" INTEGER,
    "medsTaken" BOOLEAN,
    "alcoholUnits" REAL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DailyEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DailyEntry" ("alcoholUnits", "bpDiastolic", "bpSystolic", "createdAt", "date", "foodSummary", "glucose", "id", "medsTaken", "notes", "sleepHours", "steps", "userId") SELECT "alcoholUnits", "bpDiastolic", "bpSystolic", "createdAt", "date", "foodSummary", "glucose", "id", "medsTaken", "notes", "sleepHours", "steps", "userId" FROM "DailyEntry";
DROP TABLE "DailyEntry";
ALTER TABLE "new_DailyEntry" RENAME TO "DailyEntry";
CREATE TABLE "new_Profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "age" INTEGER,
    "sex" TEXT,
    "heightCm" REAL,
    "weightKg" REAL,
    "conditions" TEXT,
    "medications" TEXT,
    "familyHistory" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Profile" ("age", "conditions", "createdAt", "familyHistory", "heightCm", "id", "medications", "sex", "updatedAt", "userId", "weightKg") SELECT "age", "conditions", "createdAt", "familyHistory", "heightCm", "id", "medications", "sex", "updatedAt", "userId", "weightKg" FROM "Profile";
DROP TABLE "Profile";
ALTER TABLE "new_Profile" RENAME TO "Profile";
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");
CREATE TABLE "new_Scenario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "changes" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Scenario_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Scenario" ("changes", "createdAt", "description", "id", "name", "userId") SELECT "changes", "createdAt", "description", "id", "name", "userId" FROM "Scenario";
DROP TABLE "Scenario";
ALTER TABLE "new_Scenario" RENAME TO "Scenario";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
