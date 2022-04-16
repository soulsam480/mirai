/*
  Warnings:

  - You are about to drop the `StudentCeritification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudentCeritification" DROP CONSTRAINT "StudentCeritification_studentId_fkey";

-- DropTable
DROP TABLE "StudentCeritification";

-- CreateTable
CREATE TABLE "StudentCertification" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT,
    "institute" TEXT NOT NULL,
    "documentName" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "identificationNumber" TEXT,
    "expiresAt" TIMESTAMP(3),
    "score" TEXT,
    "scoreType" "StudentScoreType",
    "description" TEXT,

    CONSTRAINT "StudentCertification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudentCertification" ADD CONSTRAINT "StudentCertification_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
