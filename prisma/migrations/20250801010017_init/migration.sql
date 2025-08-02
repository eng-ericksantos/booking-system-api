-- CreateTable
CREATE TABLE "public"."Servico" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "duracao" INTEGER NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Servico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Profissional" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Profissional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HorarioDisponivel" (
    "id" TEXT NOT NULL,
    "diaDaSemana" INTEGER NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFim" TEXT NOT NULL,
    "profissionalId" TEXT NOT NULL,

    CONSTRAINT "HorarioDisponivel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Agendamento" (
    "id" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Confirmado',
    "nomeCliente" TEXT NOT NULL,
    "telefoneCliente" TEXT NOT NULL,
    "servicoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agendamento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profissional_email_key" ON "public"."Profissional"("email");

-- AddForeignKey
ALTER TABLE "public"."HorarioDisponivel" ADD CONSTRAINT "HorarioDisponivel_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "public"."Profissional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Agendamento" ADD CONSTRAINT "Agendamento_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "public"."Servico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
