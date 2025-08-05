/*
  Warnings:

  - The `status` column on the `Agendamento` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."StatusAgendamento" AS ENUM ('Confirmado', 'Cancelado', 'Realizado');

-- AlterTable
ALTER TABLE "public"."Agendamento" DROP COLUMN "status",
ADD COLUMN     "status" "public"."StatusAgendamento" NOT NULL DEFAULT 'Confirmado';
