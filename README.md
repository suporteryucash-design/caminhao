# Rota do Caminhoneiro

Aplicacao web para gerenciar destinos de entrega de caminhoneiros.

## Estrutura
- `backend/` - API Node.js + Express + SQLite
- `frontend/` - React + Tailwind CSS + Vite

## Como rodar

### 1. Instalar dependencias do backend
```
cd backend
npm install
```

### 2. Instalar dependencias do frontend
```
cd frontend
npm install
```

### 3. Iniciar o backend (Terminal 1)
```
cd backend
node server.js
```

### 4. Iniciar o frontend (Terminal 2)
```
cd frontend
npm run dev
```

### 5. Acessar
Abra http://localhost:5173 no navegador.

## Funcionalidades
- Cadastro de locais (Nome, Endereco, Descarga, Observacoes)
- Pesquisa em tempo real
- Edicao e exclusao
- Detalhes completos em modal
- Interface dark mode moderna
- Dados persistentes em SQLite