import { useState } from 'react';

export function useAuth() {
  const [usuario, setUsuario] = useState(() => sessionStorage.getItem('usuario'));

  const login = async (usuarioInput, senhaInput) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: usuarioInput, senha: senhaInput })
      });
      const result = await response.json();
      if (result.success) {
        sessionStorage.setItem('usuario', result.usuario);
        setUsuario(result.usuario);
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (err) {
      return { success: false, error: 'Erro ao conectar com o servidor.' };
    }
  };

  const logout = () => {
    sessionStorage.removeItem('usuario');
    setUsuario(null);
  };

  return { usuario, login, logout };
}