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

| Entidade             | Atributos principais                                                  |
|----------------------|-----------------------------------------------------------------------|
| **Serviço**          | `id`, `nome`, `descrição`, `duracaoMinutos`, `preco`                  |
| **HorárioDisponível**| `id`, `profissionalId`, `diaSemana`, `horaInicio`, `horaFim`          |
| **Agendamento**      | `id`, `clienteNome`, `clienteContato`, `servicoId`, `dataHora`, `status`<br/>(`Confirmado`, `Cancelado`, `Realizado`) |

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
