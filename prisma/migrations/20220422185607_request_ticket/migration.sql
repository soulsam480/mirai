/*
  Warnings:

  - Added the required column `updatedAt` to the `StudentBasics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `StudentCertification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `StudentEducation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `StudentProject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `StudentScore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `StudentWorkExperience` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'INPROGRESS', 'CLOSED', 'RESOLVED');

-- AlterTable
ALTER TABLE "StudentBasics" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "StudentCertification" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "StudentEducation" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "StudentProject" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "StudentScore" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "StudentWorkExperience" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "instituteId" INTEGER NOT NULL,
    "meta" JSONB NOT NULL DEFAULT '{}',
    "status" "TicketStatus" NOT NULL DEFAULT E'OPEN',
    "closedAt" TIMESTAMP(3),
    "closedBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;
