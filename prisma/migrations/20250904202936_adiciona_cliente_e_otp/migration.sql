/*
  Warnings:

  - You are about to drop the column `nomeCliente` on the `Agendamento` table. All the data in the column will be lost.
  - You are about to drop the column `telefoneCliente` on the `Agendamento` table. All the data in the column will be lost.
  - Added the required column `clienteId` to the `Agendamento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "public"."Role" ADD VALUE 'CLIENTE';

-- AlterTable
ALTER TABLE "public"."Agendamento" DROP COLUMN "nomeCliente",
DROP COLUMN "telefoneCliente",
ADD COLUMN     "clienteId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Usuario" ALTER COLUMN "senha" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."Cliente" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."one_time_passwords" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "one_time_passwords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_usuarioId_key" ON "public"."Cliente"("usuarioId");

-- AddForeignKey
ALTER TABLE "public"."Cliente" ADD CONSTRAINT "Cliente_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Agendamento" ADD CONSTRAINT "Agendamento_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
