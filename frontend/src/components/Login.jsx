import { useState } from 'react';
import { Truck, LogIn } from 'lucide-react';

export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    const result = await onLogin(usuario, senha);
    if (!result.success) {
      setErro(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Truck className="text-rose-500 mb-3" size={48} />
          <h1 className="text-2xl font-bold text-white">Rota do Caminhoneiro</h1>
          <p className="text-slate-400 text-sm mt-1">Faça login para continuar</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="mb-4">
            <label className="block text-slate-300 text-sm mb-1">Usuário</label>
            <input
              type="text"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              className="input-dark w-full"
              placeholder="Digite seu usuário"
              autoComplete="username"
            />
          </div>

          <div className="mb-6">
            <label className="block text-slate-300 text-sm mb-1">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              className="input-dark w-full"
              placeholder="Digite sua senha"
              autoComplete="current-password"
              onKeyDown={e => e.key === 'Enter' && handleSubmit(e)}
            />
          </div>

          {erro && (
            <p className="text-rose-400 text-sm mb-4 text-center">{erro}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !usuario || !senha}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <LogIn size={18} />
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </div>
    </div>
  );
}