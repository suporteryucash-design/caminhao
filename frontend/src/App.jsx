import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Formulario from './components/Formulario';
import BarraPesquisa from './components/BarraPesquisa';
import ListaLocais from './components/ListaLocais';
import ModalDetalhes from './components/ModalDetalhes';
import ModalEditar from './components/ModalEditar';
import Login from './components/Login';
import { useLocais } from './hooks/useLocais';
import { useAuth } from './hooks/useAuth';
import { ChevronUp } from 'lucide-react';

export default function App() {
  const { usuario, login, logout } = useAuth();

  const {
    locais,
    loading,
    error,
    pesquisa,
    setPesquisa,
    criarLocal,
    atualizarLocal,
    excluirLocal,
    recarregar
  } = useLocais();

  const [localSelecionado, setLocalSelecionado] = useState(null);
  const [modalDetalhes, setModalDetalhes] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [mostrarSeta, setMostrarSeta] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setMostrarSeta(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const voltarAoTopo = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!usuario) {
    return <Login onLogin={login} />;
  }

  const handleVerDetalhes = (local) => {
    setLocalSelecionado(local);
    setModalDetalhes(true);
  };

  const handleEditar = (local) => {
    setLocalSelecionado(local);
    setModalEditar(true);
  };

  const handleSalvarEdicao = async (dados) => {
    await atualizarLocal(localSelecionado.id, dados);
    setModalEditar(false);
    setLocalSelecionado(null);
  };

  const salvarLocal = (dados) => criarLocal(dados, usuario);

  return (
    <div className="min-h-screen bg-slate-950">
      <Header usuario={usuario} onLogout={logout} />

      {/* Barra de pesquisa fixa no mobile */}
      <div className="lg:hidden sticky top-0 z-40 bg-slate-950 px-4 py-3 border-b border-slate-800 shadow-lg">
        <BarraPesquisa
          valor={pesquisa}
          onChange={setPesquisa}
          onAtualizar={recarregar}
        />
      </div>

      <main className="max-w-7xl mx-auto px-4 py-4 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="hidden lg:block lg:col-span-1">
            <Formulario onSalvar={salvarLocal} />
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="hidden lg:block">
              <BarraPesquisa
                valor={pesquisa}
                onChange={setPesquisa}
                onAtualizar={recarregar}
              />
            </div>

            <div className="lg:hidden">
              <Formulario onSalvar={salvarLocal} modoCompacto />
            </div>

            <ListaLocais
              locais={locais}
              loading={loading}
              onVerDetalhes={handleVerDetalhes}
              onEditar={handleEditar}
              onExcluir={excluirLocal}
            />
          </div>

        </div>
      </main>

      {/* Botão voltar ao topo */}
      <button
        onClick={voltarAoTopo}
        className={`fixed bottom-6 right-6 z-50 bg-rose-600 hover:bg-rose-500 text-white p-3 rounded-full shadow-lg shadow-rose-900/40 transition-all duration-300 ${
          mostrarSeta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        title="Voltar ao topo"
      >
        <ChevronUp size={22} />
      </button>

      {modalDetalhes && (
        <ModalDetalhes
          local={localSelecionado}
          onFechar={() => { setModalDetalhes(false); setLocalSelecionado(null); }}
        />
      )}
      {modalEditar && (
        <ModalEditar
          local={localSelecionado}
          onSalvar={handleSalvarEdicao}
          onFechar={() => { setModalEditar(false); setLocalSelecionado(null); }}
        />
      )}
    </div>
  );
}