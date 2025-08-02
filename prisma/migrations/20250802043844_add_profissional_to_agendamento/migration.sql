/*
  Warnings:

  - Added the required column `profissionalId` to the `Agendamento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Agendamento" ADD COLUMN     "profissionalId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Agendamento" ADD CONSTRAINT "Agendamento_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "public"."Profissional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
