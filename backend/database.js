import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function initDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS locais (
      id SERIAL PRIMARY KEY,
      nome TEXT NOT NULL,
      endereco TEXT NOT NULL,
      descarga TEXT NOT NULL,
      observacoes TEXT,
      criado_por TEXT,
      data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('Banco de dados inicializado');
}

export default pool;