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

// Inicialização automática da tabela de locais no banco de dados
pool.query(`
  CREATE TABLE IF NOT EXISTS locais (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    endereco TEXT NOT NULL,
    descarga TEXT NOT NULL,
    observacoes TEXT,
    criado_por TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`).catch(err => console.error('Erro ao inicializar o banco de dados:', err));

const app = express();
app.use(cors());
app.use(express.json());

// Base de dados simulada de utilizadores (Exatamente igual ao seu ficheiro auth.js)
const USUARIOS = [
  { id: 1, usuario: 'teruo', senha: 'senha123' },
  { id: 2, usuario: 'davi', senha: 'senha456' }
];

// ==========================================
// ROTA: LOGIN (Alinhada perfeitamente com o useAuth.js)
// ==========================================
app.post('/api/login', (req, res) => {
  try {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
      return res.status(400).json({ success: false, error: 'Usuário e senha são obrigatórios' });
    }

    // Procura o utilizador na lista, removendo espaços em branco acidentais (.trim())
    const user = USUARIOS.find(u => u.usuario === usuario.trim() && u.senha === senha.trim());

    if (!user) {
      return res.status(401).json({ success: false, error: 'Usuário ou senha incorretos' });
    }

    // Retorna a estrutura exata que o seu useAuth.js espera receber (result.user.usuario)
    return res.json({ 
      success: true, 
      message: 'Login realizado com sucesso!',
      user: { 
        usuario: user.usuario 
      } 
    });

  } catch (error) {
    console.error('Erro no processo de login:', error);
    return res.status(500).json({ success: false, error: 'Erro interno do servidor ao tentar logar.' });
  }
});


// ==========================================
// ROTAS: LOCAIS (Protegidas com Try/Catch)
// ==========================================
app.get('/api/locais', async (req, res) => {
  try {
    const { q } = req.query;
    let result;
    if (q) {
      result = await pool.query(
        `SELECT * FROM locais WHERE nome ILIKE $1 OR endereco ILIKE $1 OR descarga ILIKE $1 ORDER BY id DESC`,
        [`%${q}%`]
      );
    } else {
      result = await pool.query(`SELECT * FROM locais ORDER BY id DESC`);
    }
    return res.json({ success: true, data: result.rows, total: result.rows.length });
  } catch (error) {
    console.error('Erro ao buscar locais:', error);
    return res.status(500).json({ success: false, error: 'Erro interno do servidor ao buscar locais.' });
  }
});

app.post('/api/locais', async (req, res) => {
  try {
    const { nome, endereco, descarga, observacoes, criado_por } = req.body;
    if (!nome || !endereco || !descarga) {
      return res.status(400).json({ success: false, error: 'Nome, endereco e descarga sao obrigatorios' });
    }
    const result = await pool.query(
      `INSERT INTO locais (nome, endereco, descarga, observacoes, criado_por) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nome, endereco, descarga, observacoes || '', criado_por || '']
    );
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Erro ao criar local:', error);
    return res.status(500).json({ success: false, error: 'Erro interno do servidor ao criar local.' });
  }
});

app.put('/api/locais/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, endereco, descarga, observacoes } = req.body;
    const result = await pool.query(
      `UPDATE locais SET nome=$1, endereco=$2, descarga=$3, observacoes=$4 WHERE id=$5 RETURNING *`,
      [nome, endereco, descarga, observacoes || '', id]
    );
    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Erro ao atualizar local:', error);
    return res.status(500).json({ success: false, error: 'Erro interno do servidor ao atualizar local.' });
  }
});

app.delete('/api/locais/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM locais WHERE id=$1`, [id]);
    return res.json({ success: true, message: 'Local excluido com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir local:', error);
    return res.status(500).json({ success: false, error: 'Erro interno do servidor ao excluir local.' });
  }
});

export default app;