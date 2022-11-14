/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Pools` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Pools_code_key" ON "Pools"("code");
