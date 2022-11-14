/*
  Warnings:

  - A unique constraint covering the columns `[gameId]` on the table `Guess` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[participantId]` on the table `Guess` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Guess_gameId_key" ON "Guess"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "Guess_participantId_key" ON "Guess"("participantId");
