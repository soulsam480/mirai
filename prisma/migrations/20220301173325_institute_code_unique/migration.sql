/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Institute` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Institute_code_key" ON "Institute"("code");
