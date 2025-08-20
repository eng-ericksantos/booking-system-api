# Sistema de Agendamentos

Uma plataforma de agendamento online para prestadores de serviço (barbeiros, médicos, consultores, personal trainers etc.), onde o profissional configura horários disponíveis e o cliente marca seu atendimento de forma simples e intuitiva.

---

## 📋 Sumário

- [Funcionalidades](#funcionalidades)  
- [Estrutura do Banco de Dados](#estrutura--banco--dados)  
- [Tecnologias](#tecnologias)  
- [Pré-requisitos](#pré-requisitos)  

---

## 🚀 Funcionalidades

- **Painel do Profissional**  
  - CRUD de serviços (nome, descrição, duração, preço)  
  - CRUD de horários disponíveis  
  - Visualização de agendamentos por status  

- **Interface Pública do Cliente**  
  - Seleção de serviço  
  - Calendário com horários livres  
  - Marcação de agendamento  
  - Cancelamento de compromisso  

- **Gerenciamento de Agendamentos**  
  - Visualizar, confirmar e cancelar  
  - Filtros por data, serviço e status  

---

## 📑 Estrutura do Banco de Dados

| **Entidade / Enum**      | **Campo / Valor**   | **Tipo**       | **Restrições / Observações** |
|---------------------------|---------------------|----------------|------------------------------|
| **Usuario**              | id                  | String (uuid)  | **PK**, default: `uuid()` |
|                           | email               | String         | **Único** |
|                           | senha               | String         | — |
|                           | role                | Role           | Default: `PROFISSIONAL` |
|                           | profissional        | Profissional?  | Relação opcional |
| **Profissional**         | id                  | String (uuid)  | **PK**, default: `uuid()` |
|                           | nome                | String         | — |
|                           | usuarioId           | String (uuid)  | **Único**, **FK → Usuario.id** |
|                           | usuario             | Usuario        | Relação obrigatória |
|                           | horariosDisponiveis | HorarioDisponivel[] | 1:N |
|                           | agendamentos        | Agendamento[]  | 1:N |
| **Servico**              | id                  | String (uuid)  | **PK**, default: `uuid()` |
|                           | nome                | String         | — |
|                           | descricao           | String         | — |
|                           | duracao             | Int            | Duração em minutos |
|                           | preco               | Float          | — |
|                           | agendamentos        | Agendamento[]  | 1:N |
| **HorarioDisponivel**    | id                  | String (uuid)  | **PK**, default: `uuid()` |
|                           | diaDaSemana         | Int            | 0=Dom, 6=Sáb |
|                           | horaInicio          | String         | Formato `HH:mm` |
|                           | horaFim             | String         | Formato `HH:mm` |
|                           | profissionalId      | String (uuid)  | **FK → Profissional.id** |
|                           | profissional        | Profissional   | Relação obrigatória |
| **Agendamento**          | id                  | String (uuid)  | **PK**, default: `uuid()` |
|                           | data                | DateTime       | — |
|                           | status              | StatusAgendamento | Default: `Confirmado` |
|                           | nomeCliente         | String         | — |
|                           | telefoneCliente     | String         | — |
|                           | servicoId           | String (uuid)  | **FK → Servico.id** |
|                           | profissionalId      | String (uuid)  | **FK → Profissional.id** |
|                           | createdAt           | DateTime       | Default: `now()` |
|                           | updateAt            | DateTime       | Auto `@updatedAt` |
| **Enum Role**            | ADMIN               | —              | Perfil administrador |
|                           | PROFISSIONAL        | —              | Perfil profissional |
| **Enum StatusAgendamento** | Confirmado         | —              | Default |
|                           | Cancelado           | —              | — |
|                           | Realizado           | —              | — |


---

## 🛠️ Tecnologias

- **Back-end**: Node.js, Express e Prisma 
- **Front-end**: Angular 
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT  
- **Containerização**: Docker & Docker Compose  

> _modelo de stack atualizada com os principais frameworks do mercado._

---

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) v14+  
- [Yarn](https://yarnpkg.com/) ou npm  
- Banco de dados (PostgreSQL, MySQL ou MongoDB)  
- (Opcional) Docker & Docker Compose  

---

## 🗂️ Comandos do Dia a Dia

---

Iniciar o servidor em modo de desenvolvimento:

```npm run dev```

(Já conhecemos: inicia o servidor com recarregamento automático a cada alteração).

Criar uma nova migração (com nome dinâmico):

```npm run db:migrate -- nome-da-sua-migration```

Como funciona: O -- é um caractere especial que diz ao NPM: "tudo o que vier depois disso não é um argumento para o NPM, mas sim para o script que está sendo executado". Assim, nome-da-sua-migration é passado diretamente para o final do comando npx prisma migrate dev --name.
Exemplo prático: npm run db:migrate -- adiciona-campo-telefone-no-cliente

Abrir o Prisma Studio (Visualizador de Banco de Dados):

```npm run db:studio```

(Extremamente útil! Abre uma interface gráfica no seu navegador para ver, editar e deletar dados diretamente no banco, como um painel de admin).

Comandos de Manutenção e Reset
Executar o script de seed:

```npm run db:seed```

(Executa o arquivo prisma/seed.ts para popular o banco com dados iniciais, com o nosso usuário Admin).

Resetar o banco de dados de desenvolvimento:

```npm run db:reset```

(Comando perigoso, mas útil. Apaga todos os dados, aplica todas as migrações e executa o script de seed. Perfeito para "começar do zero" em desenvolvimento).

Gerar o Prisma Client manualmente:

```npm run prisma:generate```

(Normalmente não é necessário, pois prisma migrate já faz isso. Mas é útil se você alterar o schema.prisma e não quiser criar uma nova migração ainda).

Comandos para Produção
Compilar o projeto TypeScript para JavaScript:

```npm run build```

(Gera a pasta dist/ com o código JavaScript otimizado para produção).

Iniciar o servidor em modo de produção:

```npm run start```

(Executa o código a partir da pasta dist/. Requer que npm run build tenha sido executado antes).

Aplicar migrações em produção:

```npm run db:deploy```

(Aplica as migrações pendentes em um ambiente de produção. É mais seguro que migrate dev pois não tenta gerar novas migrações ou resetar o banco).

---
