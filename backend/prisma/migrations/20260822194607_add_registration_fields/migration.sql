-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'patient';
