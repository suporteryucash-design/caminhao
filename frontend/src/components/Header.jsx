import React from 'react';
import { Truck, LogOut, User } from 'lucide-react';

export default function Header({ usuario, onLogout }) {
  return (
    <header className="bg-slate-900 border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-rose-600 p-2 sm:p-3 rounded-xl shadow-lg shadow-rose-900/30 shrink-0">
              <Truck size={24} className="text-white sm:hidden" />
              <Truck size={32} className="text-white hidden sm:block" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-3xl font-bold text-white tracking-tight truncate">
                Rota do Caminhoneiro
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5 hidden sm:block">
                Gerencie seus destinos de entrega
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-lg">
              <User size={13} className="text-slate-400" />
              <span className="text-slate-300 text-xs font-medium">{usuario}</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white px-2 py-1 rounded-lg transition-colors duration-200"
              title="Sair"
            >
              <LogOut size={13} />
              <span className="text-xs">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}