import React from 'react';
import { MapPin, Package, Calendar, Eye, Pencil, Trash2, AlertCircle, User } from 'lucide-react';

export default function ListaLocais({ locais, loading, onVerDetalhes, onEditar, onExcluir }) {
  if (loading) {
    return (
      <div className="card p-12 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-slate-400">Carregando locais...</p>
      </div>
    );
  }

  if (locais.length === 0) {
    return (
      <div className="card p-12 text-center">
        <AlertCircle size={48} className="text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-300 mb-2">Nenhum local encontrado</h3>
        <p className="text-slate-500">Cadastre seu primeiro local usando o formulario ao lado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {locais.map((local, index) => (
        <div key={local.id}
          className={`card p-5 hover:bg-slate-800/50 transition-all duration-200 border-l-4 ${
            index % 2 === 0 ? 'border-l-rose-500' : 'border-l-sky-500'
          }`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white mb-2 truncate">{local.nome}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2 text-slate-300">
                  <MapPin size={16} className="text-slate-500 mt-0.5 shrink-0" />
                  <span className="truncate">{local.endereco}</span>
                </div>
                <div className="flex items-start gap-2 text-slate-300">
                  <Package size={16} className="text-slate-500 mt-0.5 shrink-0" />
                  <span className="truncate">{local.descarga}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    <span>{new Date(local.data_cadastro).toLocaleDateString('pt-BR')}</span>
                  </div>
                  {local.criado_por && (
                    <div className="flex items-center gap-1.5">
                      <User size={13} />
                      <span>por <span className="text-slate-400 font-medium">{local.criado_por}</span></span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button onClick={() => onVerDetalhes(local)} className="btn-info p-2" title="Ver detalhes">
                <Eye size={16} />
              </button>
              <button onClick={() => onEditar(local)} className="btn-warning p-2" title="Editar">
                <Pencil size={16} />
              </button>
              <button onClick={() => { if (confirm(`Tem certeza que deseja excluir "${local.nome}"?`)) { onExcluir(local.id); } }}
                className="btn-danger p-2" title="Excluir">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}