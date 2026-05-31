import React from 'react';
import { Search, RefreshCw } from 'lucide-react';

export default function BarraPesquisa({ valor, onChange, onAtualizar }) {
  return (
    <div className="card p-3 flex items-center gap-3 lg:sticky lg:top-4">
      <div className="relative flex-1">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Pesquisar por nome, endereco..."
          className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all text-base"
          enterKeyHint="search"
        />
        {valor && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-lg leading-none"
          >
            ×
          </button>
        )}
      </div>
      <button
        onClick={onAtualizar}
        className="bg-rose-600 hover:bg-rose-500 text-white p-3 rounded-lg transition-all duration-200 shrink-0"
        title="Atualizar lista"
      >
        <RefreshCw size={18} />
      </button>
    </div>
  );
}