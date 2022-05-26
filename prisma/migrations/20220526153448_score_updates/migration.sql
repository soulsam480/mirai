/*
  Warnings:

  - You are about to drop the column `aggregatePercentage` on the `StudentScore` table. All the data in the column will be lost.
  - You are about to drop the column `hasBacklog` on the `StudentScore` table. All the data in the column will be lost.
  - You are about to drop the column `totalBacklogs` on the `StudentScore` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StudentScore" DROP COLUMN "aggregatePercentage",
DROP COLUMN "hasBacklog",
DROP COLUMN "totalBacklogs";
