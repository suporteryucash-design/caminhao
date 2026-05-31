import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Cria as tabelas necessárias no banco de dados
pool.query(`
  CREATE TABLE IF NOT EXISTS locais (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    endereco TEXT NOT NULL,
    descarga TEXT NOT NULL,
    observacoes TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// NOVA ROTA: LOGIN
// ==========================================
app.post('/api/login', async (req, res) => {
  const { usuario, senha } = req.body;

  if (!usuario || !senha) {
    return res.status(400).json({ success: false, error: 'Usuário e senha são obrigatórios' });
  }

  // Exemplo simples com credenciais fixas para o seu deploy funcionar.
  // IMPORTANTE: Altere 'admin' e 'admin123' para o usuário e senha que você deseja usar!
  if (usuario === 'admin' && senha === 'admin123') {
    return res.json({ 
      success: true, 
      message: 'Login realizado com sucesso!',
      user: { usuario: 'admin' } 
    });
  }

  // Se o usuário ou a senha estiverem errados:
  return res.status(401).json({ success: false, error: 'Usuário ou senha incorretos' });
});


// ==========================================
// ROTAS DE LOCAIS (Mantidas idênticas às suas)
// ==========================================
app.get('/api/locais', async (req, res) => {
  const { q } = req.query;
  const result = q
    ? await pool.query(`SELECT * FROM locais WHERE nome ILIKE $1 OR endereco ILIKE $1 OR descarga ILIKE $1 ORDER BY id DESC`, [`%${q}%`])
    : await pool.query(`SELECT * FROM locais ORDER BY id DESC`);
  res.json({ success: true, data: result.rows, total: result.rows.length });
});

app.post('/api/locais', async (req, res) => {
  const { nome, endereco, descarga, observacoes } = req.body;
  if (!nome || !endereco || !descarga)
    return res.status(400).json({ success: false, error: 'Nome, endereco e descarga sao obrigatorios' });
  const result = await pool.query(
    `INSERT INTO locais (nome, endereco, descarga, observacoes) VALUES ($1, $2, $3, $4) RETURNING *`,
    [nome, endereco, descarga, observacoes || '']
  );
  res.status(201).json({ success: true, data: result.rows[0] });
});

app.put('/api/locais/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, endereco, descarga, observacoes } = req.body;
  const result = await pool.query(
    `UPDATE locais SET nome=$1, endereco=$2, descarga=$3, observacoes=$4 WHERE id=$5 RETURNING *`,
    [nome, endereco, descarga, observacoes || '', id]
  );
  res.json({ success: true, data: result.rows[0] });
});

app.delete('/api/locais/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query(`DELETE FROM locais WHERE id=$1`, [id]);
  res.json({ success: true, message: 'Local excluido com sucesso' });
});

export default app;