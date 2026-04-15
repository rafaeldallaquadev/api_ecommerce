# 🛒 Ecommerce API — Node.js + MySQL

API REST de e-commerce construída com Node.js e Express, focada em **arquitetura em camadas, segurança, consistência de dados e boas práticas de backend**.

O projeto simula um sistema real de e-commerce com autenticação, controle de estoque, carrinho de compras e lista de desejos.

---

## 🚀 Visão geral

Este projeto implementa uma API completa de e-commerce com:

* Autenticação JWT
* Gestão de usuários
* CRUD de produtos com controle de proprietário
* Carrinho de compras com consistência transacional
* Wishlist por usuário
* Filtros avançados, paginação e ordenação
* Validação robusta de dados em todas as camadas

---

## 🧱 Arquitetura

O projeto segue uma arquitetura em camadas bem definida:

```
Routes → Middlewares → Controllers → Services → Database
```

### 📌 Separação de responsabilidades

* **Routes** → definição dos endpoints
* **Middlewares** → validação, autenticação e regras de entrada
* **Controllers** → controle de fluxo HTTP
* **Services** → regras de negócio e acesso ao banco
* **DB Layer** → pool MySQL (mysql2/promise)

---

## 🔐 Segurança e autenticação

* Autenticação via **JWT (Bearer Token)**
* Senhas criptografadas com **bcrypt**
* Middleware de proteção de rotas (`verifyAuth`)
* Validação de entrada em múltiplas camadas
* Controle de acesso a recursos por usuário (ownership de produtos)

---

## 🛍️ Funcionalidades

### 👤 Usuários

* Registro com validação de nome, email e senha forte
* Login com geração de token JWT

### 📦 Produtos

* CRUD completo
* Produtos vinculados ao usuário criador
* Filtros avançados:

  * nome (LIKE)
  * faixa de preço
  * estoque disponível
  * ordenação dinâmica
  * paginação

### 🛒 Carrinho de compras

* Adição e remoção de produtos
* Atualização de quantidade
* Criação automática de carrinho ativo
* Checkout com:

  * transação SQL
  * bloqueio de leitura (FOR UPDATE)
  * validação de estoque
  * atualização de estoque em lote

### ⭐ Wishlist

* Adicionar/remover produtos
* Listagem com filtros e paginação
* Prevenção de duplicação

---

## 🧠 Decisões técnicas importantes

* Uso de **services layer** para isolar regras de negócio
* Validações duplicadas evitadas (middleware + service quando necessário)
* Uso de **transações SQL no checkout** para garantir consistência
* Atualização de estoque em batch com `CASE WHEN`
* Controle de concorrência no carrinho (`FOR UPDATE`)
* Tratamento de erros com status HTTP customizados

---

## 🛠️ Tecnologias

* Node.js
* Express
* MySQL (mysql2/promise)
* JWT (jsonwebtoken)
* bcrypt
* dotenv

---

## 📁 Estrutura do projeto

```
ecommerce-api/
├── app.js
├── db.js
├── controllers/
├── services/
├── routes/
├── middlewares/
└── utils/
```

---

## ⚙️ Instalação

```bash
git clone https://github.com/rafaeldallaquadev/ecommerce-api.git
cd ecommerce-api
npm install
```

---

## 🔧 Configuração (.env)

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=sua_senha
DB_NAME=nome_do_banco
JWT_SECRET=sua_chave_secreta
```

---

## ▶️ Execução

```bash
npm start
```

Servidor:

```
http://localhost:3000
```

---

## Uso via API

### Base URL:
https://api-ecommerce-ntcw.onrender.com

## 📌 Endpoints principais

### 👤 Auth

* `POST /user/register`
* `POST /user/login`

### 📦 Products

* `GET /products`
* `GET /products/:id`
* `POST /products`
* `PATCH /products/:id`
* `DELETE /products/:id`

### 🛒 Cart

* `GET /cart`
* `POST /cart/:product_id`
* `PUT /cart/:product_id`
* `DELETE /cart/:product_id`
* `POST /cart/checkout`

### ⭐ Wishlist

* `GET /wishlist`
* `POST /wishlist/:productId`
* `DELETE /wishlist/:productId`

---

## 📮 Postman Collection

Este projeto inclui uma collection completa para testes da API.

### 📌 O que contém:
- Autenticação (register, login, refresh token)
- CRUD de produtos
- Carrinho de compras
- Wishlist
- Fluxo completo com JWT automático

### ⚙️ Como usar:
1. Importe o arquivo `postman_collection.json`
2. Configure o environment com:
   - base_url
   - token
3. Execute o login para gerar o token automaticamente



## 📈 Pontos fortes do projeto

✔ Arquitetura escalável em camadas
✔ Uso correto de transações no checkout
✔ Controle de concorrência no banco
✔ Validação defensiva em múltiplos níveis
✔ Separação clara entre regra de negócio e HTTP layer
✔ Queries otimizadas com paginação e filtros dinâmicos

---

## 🔮 Melhorias futuras

* Documentação com Swagger/OpenAPI
* Testes automatizados (Jest + Supertest)
* Dockerização do ambiente
* Cache com Redis
* Logs estruturados (Pino/Winston)
* Rate limiting e proteção anti-abuso

---

## 👨‍💻 Autor

Desenvolvido por **Rafael Grisante Dallaqua**
Projeto focado em evolução prática de backend com Node.js + MySQL
