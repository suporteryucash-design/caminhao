import { Router } from 'express';
import pool from '../database.js';

const router = Router();

router.get('/', async (req, res) => {
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
    res.json({ success: true, data: result.rows, total: result.rows.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nome, endereco, descarga, observacoes, criado_por } = req.body;
    if (!nome || !endereco || !descarga) {
      return res.status(400).json({ success: false, error: 'Nome, endereco e descarga sao obrigatorios' });
    }
    const result = await pool.query(
      `INSERT INTO locais (nome, endereco, descarga, observacoes, criado_por) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nome, endereco, descarga, observacoes || '', criado_por || '']
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, endereco, descarga, observacoes } = req.body;
    const result = await pool.query(
      `UPDATE locais SET nome=$1, endereco=$2, descarga=$3, observacoes=$4 WHERE id=$5 RETURNING *`,
      [nome, endereco, descarga, observacoes || '', id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM locais WHERE id=$1`, [id]);
    res.json({ success: true, message: 'Local excluido com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;