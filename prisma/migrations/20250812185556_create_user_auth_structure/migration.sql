/*
  Warnings:

  - You are about to drop the column `email` on the `Profissional` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[usuarioId]` on the table `Profissional` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `usuarioId` to the `Profissional` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'PROFISSIONAL');

-- DropIndex
DROP INDEX "public"."Profissional_email_key";

-- AlterTable
ALTER TABLE "public"."Profissional" DROP COLUMN "email",
ADD COLUMN     "usuarioId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."Usuario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'PROFISSIONAL',

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "public"."Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profissional_usuarioId_key" ON "public"."Profissional"("usuarioId");

-- AddForeignKey
ALTER TABLE "public"."Profissional" ADD CONSTRAINT "Profissional_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
