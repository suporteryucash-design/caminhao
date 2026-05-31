import React from 'react';
import { X, MapPin, Package, Calendar, FileText, Building2, User } from 'lucide-react';

export default function ModalDetalhes({ local, onFechar }) {
  if (!local) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-rose-400 flex items-center gap-2">
            <Building2 size={20} />
            {local.nome}
          </h2>
          <button onClick={onFechar} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div className="bg-slate-800/50 rounded-xl p-4 space-y-4">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-sky-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Endereco</p>
                <p className="text-white mt-1">{local.endereco}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Package size={20} className="text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Local de Descarga</p>
                <p className="text-white mt-1">{local.descarga}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar size={20} className="text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Cadastrado em</p>
                <p className="text-white mt-1">{new Date(local.data_cadastro).toLocaleString('pt-BR')}</p>
              </div>
            </div>
            {local.criado_por && (
              <div className="flex items-start gap-3">
                <User size={20} className="text-rose-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Cadastrado por</p>
                  <p className="text-white mt-1">{local.criado_por}</p>
                </div>
              </div>
            )}
            {local.observacoes && (
              <div className="flex items-start gap-3">
                <FileText size={20} className="text-purple-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Observacoes</p>
                  <p className="text-white mt-1">{local.observacoes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="p-6 border-t border-slate-800">
          <button onClick={onFechar}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-all">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}