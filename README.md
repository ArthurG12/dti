# DTI Shop — Sistema de Pedidos Online

Sistema de pedidos online desenvolvido como desafio técnico para o processo seletivo da dti digital.

## Tecnologias

- **Backend:** Node.js + Express + sql.js (SQLite)
- **Frontend:** React + Context API

## Como rodar

### Pré-requisitos
- Node.js v18+

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm start
```
App disponível em `http://localhost:3000`

## Funcionalidades

- Listagem de produtos com busca e paginação
- Carrinho com adição, remoção e alteração de quantidade (mín. 1, máx. 10)
- Checkout simulado com tela de sucesso
- Persistência do carrinho no localStorage
- Toasts de feedback

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/products` | Listar produtos (`?search=&page=&limit=`) |
| GET | `/api/products/:id` | Buscar produto |
| POST | `/api/cart/items` | Criar carrinho e adicionar item |
| GET | `/api/cart/:cartId` | Ver carrinho |
| POST | `/api/cart/:cartId/items` | Adicionar item |
| PUT | `/api/cart/:cartId/items/:productId` | Atualizar quantidade |
| DELETE | `/api/cart/:cartId/items/:productId` | Remover item |
| POST | `/api/cart/:cartId/checkout` | Finalizar pedido |
