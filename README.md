# ChefPro 🍽️

Sistema web de cadastro e consulta de receitas culinárias, desenvolvido como atividade avaliativa final da disciplina de Front-End.

---

## Sobre o projeto

O **ChefPro** permite que usuários se cadastrem, façam login e explorem receitas culinárias. As receitas são carregadas automaticamente via **Fetch API** a partir da [TheMealDB](https://www.themealdb.com/), uma API pública de refeições, e armazenadas localmente via **LocalStorage**. Usuários com perfil de administrador podem criar, editar e excluir receitas pelo painel admin.

---

## Funcionalidades

- Cadastro e login de usuários com validação de formulários
- Autenticação persistida via LocalStorage
- Consulta e busca de receitas por nome ou ingrediente
- Carregamento de receitas via Fetch API (TheMealDB)
- Painel administrativo para gerenciar receitas (CRUD)
- Rotas protegidas por nível de acesso (admin / usuário)
- Layout responsivo para desktop, tablet e mobile

---

## Tecnologias utilizadas

| Tecnologia | Uso |
|---|---|
| React 18 | Estrutura de componentes, estado e ciclo de vida |
| React Router DOM | Navegação entre páginas (SPA) |
| Styled Components | Estilização por componente (CSS-in-JS) |
| Fetch API | Requisições externas à TheMealDB |
| LocalStorage | Persistência de usuários e receitas |
| Vite | Bundler e servidor de desenvolvimento |

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) versão 18 ou superior
- npm (vem junto com o Node.js)

---

## Instalação e execução

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/chefpro.git
cd chefpro

# 2. Instale as dependências
npm install

# 3. Instale o Styled Components (se ainda não estiver no package.json)
npm install styled-components

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse no navegador: `http://localhost:5173`

---

## Credenciais padrão

Um usuário administrador é criado automaticamente na primeira execução:

| Campo | Valor |
|---|---|
| Email | `admin@email.com` |
| Senha | `Admin123#` |

---

## Estrutura do projeto

```
src/
├── App.jsx         # Componentes, rotas, lógica e estilos (Styled Components)
├── App.css         # Arquivo mantido para compatibilidade (estilos no App.jsx)
├── index.css       # Reset global mínimo
└── main.jsx        # Entry point da aplicação
```

---

## Regras de validação

**Email:** formato válido (regex `\S+@\S+\.\S+`)

**Senha:** mínimo 8 caracteres, deve conter letra maiúscula, minúscula, número e caractere especial (`!@#$%^&*`)

**Nome de usuário:** mínimo 3 caracteres, sem números, sem caracteres especiais, sem nomes reservados (`admin`, `root`, `superuser`)

---

## Rotas da aplicação

| Rota | Descrição | Acesso |
|---|---|---|
| `/` | Landing page com receitas em destaque | Público |
| `/register` | Cadastro de novo usuário | Público |
| `/login` | Login | Público |
| `/inicial` | Dashboard do usuário logado | Autenticado |
| `/receitas` | Lista e busca de receitas | Público |
| `/receitas/:id` | Detalhes de uma receita | Público |
| `/admin` | Painel admin (redireciona para lista) | Admin |
| `/admin/lista` | Lista de receitas para gerenciar | Admin |
| `/admin/nova` | Criar nova receita | Admin |
| `/admin/editar/:id` | Editar receita existente | Admin |

---

## Build para produção

```bash
npm run build
```

Os arquivos gerados ficam na pasta `dist/`.
