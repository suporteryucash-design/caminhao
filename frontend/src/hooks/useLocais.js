import { useState, useEffect, useCallback } from 'react';

const API_URL = '/api';

export function useLocais() {
  const [locais, setLocais] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pesquisa, setPesquisa] = useState('');

  const fetchLocais = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = pesquisa
        ? `${API_URL}/locais?q=${encodeURIComponent(pesquisa)}`
        : `${API_URL}/locais`;
      const response = await fetch(url);
      const result = await response.json();
      if (result.success) {
        setLocais(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  }, [pesquisa]);

  useEffect(() => {
    fetchLocais();
  }, [fetchLocais]);

  const criarLocal = async (dados, usuario) => {
    try {
      const response = await fetch(`${API_URL}/locais`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...dados, criado_por: usuario })
      });
      const result = await response.json();
      if (result.success) {
        setLocais(prev => [result.data, ...prev]);
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const atualizarLocal = async (id, dados) => {
    try {
      const response = await fetch(`${API_URL}/locais/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
      const result = await response.json();
      if (result.success) {
        setLocais(prev => prev.map(l => l.id === id ? result.data : l));
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const excluirLocal = async (id) => {
    try {
      const response = await fetch(`${API_URL}/locais/${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (result.success) {
        setLocais(prev => prev.filter(l => l.id !== id));
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    locais,
    loading,
    error,
    pesquisa,
    setPesquisa,
    criarLocal,
    atualizarLocal,
    excluirLocal,
    recarregar: fetchLocais
  };
}