/*
  Warnings:

  - You are about to drop the column `resetPasswordExpiresAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetPasswordToken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "resetPasswordExpiresAt",
DROP COLUMN "resetPasswordToken",
ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpire" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "OnboardingProfile" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "heightCm" DOUBLE PRECISION,
    "weightKg" DOUBLE PRECISION,
    "location" TEXT,
    "diabetesStatus" TEXT,
    "diabetesType" TEXT,
    "diagnosisYear" INTEGER,
    "hba1c" DOUBLE PRECISION,
    "fastingGlucose" DOUBLE PRECISION,
    "bloodPressureHistory" TEXT,
    "cholesterol" TEXT,
    "kidneyHistory" TEXT,
    "heartHistory" TEXT,
    "otherConditions" TEXT,
    "smoking" TEXT,
    "alcohol" TEXT,
    "typicalSleep" DOUBLE PRECISION,
    "typicalActivity" TEXT,
    "foodPreference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnboardingProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingProfile_userId_key" ON "OnboardingProfile"("userId");

-- AddForeignKey
ALTER TABLE "OnboardingProfile" ADD CONSTRAINT "OnboardingProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
