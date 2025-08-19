# Sistema de Agendamentos

Uma plataforma de agendamento online para prestadores de serviço (barbeiros, médicos, consultores, personal trainers etc.), onde o profissional configura horários disponíveis e o cliente marca seu atendimento de forma simples e intuitiva.

---

## 📋 Sumário

- [Funcionalidades](#funcionalidades)  
- [Entidades / Modelagem](#entidades--modelagem)  
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

## 🗂️ Entidades / Modelagem

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
