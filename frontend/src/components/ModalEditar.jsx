import React, { useState } from 'react';
import { X, Save, MapPin, Building2, Package, FileText } from 'lucide-react';

export default function ModalEditar({ local, onSalvar, onFechar }) {
  const [form, setForm] = useState({
    nome: local.nome,
    endereco: local.endereco,
    descarga: local.descarga,
    observacoes: local.observacoes || ''
  });
  const [salvando, setSalvando] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nome || !form.endereco || !form.descarga) return;
    setSalvando(true);
    await onSalvar(form);
    setSalvando(false);
  };

  if (!local) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-amber-400">Editar Local</h2>
          <button onClick={onFechar} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <Building2 size={16} className="text-slate-500" />
              Nome do Local
            </label>
            <input type="text" name="nome" value={form.nome} onChange={handleChange} className="input-dark" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <MapPin size={16} className="text-slate-500" />
              Endereco
            </label>
            <input type="text" name="endereco" value={form.endereco} onChange={handleChange} className="input-dark" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <Package size={16} className="text-slate-500" />
              Onde Descarrega
            </label>
            <input type="text" name="descarga" value={form.descarga} onChange={handleChange} className="input-dark" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <FileText size={16} className="text-slate-500" />
              Observacoes
            </label>
            <input type="text" name="observacoes" value={form.observacoes} onChange={handleChange} className="input-dark" />
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onFechar}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-all">
              Cancelar
            </button>
            <button type="submit" disabled={salvando}
              className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50">
              <Save size={18} />
              {salvando ? 'Salvando...' : 'Salvar Alteracoes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}