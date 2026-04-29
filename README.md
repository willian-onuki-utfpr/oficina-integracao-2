# 📚 Sistema de Controle de Oficinas

## 📌 Descrição

Este projeto tem como objetivo desenvolver um sistema web para **gerenciamento de oficinas**, permitindo o controle de professores, tutores, alunos, temas e emissão de certificados.

O sistema será desenvolvido como parte da disciplina **Oficina de Integração 2**, com foco na integração de conhecimentos em desenvolvimento web, banco de dados, arquitetura de software e testes automatizados.

---

## 🎯 Funcionalidades

### 👤 Usuários

* Cadastro de professores, tutores e alunos
* Autenticação (login)
* Edição e remoção de usuários

### 🏫 Oficinas

* Cadastro de oficinas
* Associação de professores e tutores
* Inscrição de alunos
* Listagem de oficinas

### 📚 Temas

* Cadastro de temas
* Associação de temas às oficinas

### 📜 Certificados

* Geração de certificados para alunos
* Download de certificados

---

## 🏗️ Arquitetura do Sistema

O sistema segue o modelo **Cliente-Servidor**, dividido em três camadas:

* **Frontend:** Interface do usuário
* **Backend:** API REST e regras de negócio
* **Banco de Dados:** Persistência das informações

### 🔄 Fluxo

Usuário → Frontend → Backend → Banco de Dados

### 🧱 Padrão arquitetural

* MVC (Model-View-Controller)
* Separação em camadas (Controller, Service, Repository)

---

## ⚙️ Tecnologias Utilizadas

### Frontend

* ReactJS
* TypeScript
* Axios
* React Router

### Backend

* Node.js
* TypeScript
* Express.js
* Sequelize

### Banco de Dados

* PostgreSQL (ou MySQL)

### Ferramentas

* GitHub
* Postman

---

## 🧪 Testes Automatizados

Serão utilizados diferentes tipos de testes:

* **Testes Unitários:** funções isoladas
* **Testes de Integração:** comunicação com banco e API
* **Testes End-to-End:** fluxo completo de cada módulo

### Ferramentas

* Jest
* React Testing Library

---

## 📅 Cronograma

| Semana | Atividade      |
| ------ | -------------- |
| 1      | Planejamento   |
| 2-3    | Sprint 1       |
| 4-5    | Sprint 2       |
| 6      | Ajustes finais |

### 🟦 Sprint 1

* Cadastro de usuários
* Login/autenticação
* CRUD de oficinas
* Cadastro de temas

### 🟩 Sprint 2

* Inscrição de alunos
* Geração de certificados
* Relatórios
* Testes automatizados

---



## 🚀 Como executar o projeto

### 🔧 Pré-requisitos

* Node.js instalado
* Banco de dados MySQL
* Git

---

### ▶️ Backend

```bash
cd backend
npm install
npm run dev
```

---

### ▶️ Frontend

```bash
cd frontend
npm install
npm start
```

---

## 🧪 Executar testes

### Backend

```bash
npm run test
```

### Frontend

```bash
npm test
```

---

## 🔐 Controle de Acesso

O sistema contará com diferentes níveis de acesso:

* **Professor:** gerencia oficinas e usuários
* **Tutor:** auxilia nas oficinas
* **Aluno:** participa das oficinas

---

## 📄 Licença

Este projeto é acadêmico e desenvolvido para fins educacionais.

---

## 👨‍💻 Autores

* Willian Kioyoshi Onuki
  
---

## 📌 Observações

Este projeto segue a metodologia ágil **Scrum**, com desenvolvimento dividido em sprints e uso de Kanban para organização das tarefas.

---
