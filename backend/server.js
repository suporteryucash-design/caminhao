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

// Cria as tabelas necessárias no banco de dados com tratamento de erro
pool.query(`
  CREATE TABLE IF NOT EXISTS locais (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    endereco TEXT NOT NULL,
    descarga TEXT NOT NULL,
    observacoes TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`).catch(err => console.error("Erro ao criar tabela 'locais':", err));

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// ROTA: LOGIN (Protegida por Variáveis de Ambiente)
// ==========================================
app.post('/api/login', async (req, res) => {
  try {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
      return res.status(400).json({ success: false, error: 'Usuário e senha são obrigatórios' });
    }

    // Buscando o usuário e a senha configurados no ambiente (ou usando o padrão se não existirem)
    const usuarioCorreto = process.env.ADMIN_USER || 'admin';
    const senhaCorreta = process.env.ADMIN_PASSWORD || 'admin123';

    // O .trim() remove espaços em branco acidentais no início ou fim do texto
    if (usuario.trim() === usuarioCorreto && senha.trim() === senhaCorreta) {
      return res.json({ 
        success: true, 
        message: 'Login realizado com sucesso!',
        user: { usuario: usuarioCorreto } 
      });
    }

    // Se o usuário ou a senha estiverem errados:
    return res.status(401).json({ success: false, error: 'Usuário ou senha incorretos' });
    
  } catch (error) {
    console.error('Erro no processo de login:', error);
    return res.status(500).json({ success: false, error: 'Erro interno do servidor ao tentar logar.' });
  }
});


// ==========================================
// ROTAS DE LOCAIS (Com proteção Try/Catch)
// ==========================================
app.get('/api/locais', async (req, res) => {
  try {
    const { q } = req.query;
    const result = q
      ? await pool.query(`SELECT * FROM locais WHERE nome ILIKE $1 OR endereco ILIKE $1 OR descarga ILIKE $1 ORDER BY id DESC`, [`%${q}%`])
      : await pool.query(`SELECT * FROM locais ORDER BY id DESC`);
    res.json({ success: true, data: result.rows, total: result.rows.length });
  } catch (error) {
    console.error('Erro ao buscar locais:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor ao buscar locais.' });
  }
});

app.post('/api/locais', async (req, res) => {
  try {
    const { nome, endereco, descarga, observacoes } = req.body;
    if (!nome || !endereco || !descarga) {
      return res.status(400).json({ success: false, error: 'Nome, endereco e descarga sao obrigatorios' });
    }
    const result = await pool.query(
      `INSERT INTO locais (nome, endereco, descarga, observacoes) VALUES ($1, $2, $3, $4) RETURNING *`,
      [nome, endereco, descarga, observacoes || '']
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Erro ao criar local:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor ao criar local.' });
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
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Erro ao atualizar local:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor ao atualizar local.' });
  }
});

app.delete('/api/locais/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM locais WHERE id=$1`, [id]);
    res.json({ success: true, message: 'Local excluido com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir local:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor ao excluir local.' });
  }
});

export default app;