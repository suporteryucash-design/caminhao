import React, { useState } from 'react';
import { Save, RotateCcw, MapPin, Building2, Package, FileText, Plus, ChevronUp } from 'lucide-react';

export default function Formulario({ onSalvar, modoCompacto = false }) {
  const [form, setForm] = useState({
    nome: '',
    endereco: '',
    descarga: '',
    observacoes: ''
  });
  const [salvando, setSalvando] = useState(false);
  const [aberto, setAberto] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nome || !form.endereco || !form.descarga) return;
    setSalvando(true);
    const result = await onSalvar(form);
    setSalvando(false);
    if (result.success) {
      setForm({ nome: '', endereco: '', descarga: '', observacoes: '' });
      if (modoCompacto) setAberto(false);
    }
  };

  const handleLimpar = () => {
    setForm({ nome: '', endereco: '', descarga: '', observacoes: '' });
  };

  const formulario = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
          <Building2 size={16} className="text-slate-500" />
          Nome do Local
        </label>
        <input type="text" name="nome" value={form.nome} onChange={handleChange}
          placeholder="Ex: Deposito Sao Paulo" className="input-dark" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
          <MapPin size={16} className="text-slate-500" />
          Endereco Completo
        </label>
        <input type="text" name="endereco" value={form.endereco} onChange={handleChange}
          placeholder="Ex: Rua das Flores, 123 - Centro" className="input-dark" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
          <Package size={16} className="text-slate-500" />
          Onde Descarrega
        </label>
        <input type="text" name="descarga" value={form.descarga} onChange={handleChange}
          placeholder="Ex: Doca 3, Setor B" className="input-dark" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
          <FileText size={16} className="text-slate-500" />
          Observacoes (opcional)
        </label>
        <input type="text" name="observacoes" value={form.observacoes} onChange={handleChange}
          placeholder="Ex: Chegar antes das 14h" className="input-dark" />
      </div>
      <div className="pt-4 space-y-3">
        <button type="submit" disabled={salvando}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
          <Save size={18} />
          {salvando ? 'Salvando...' : 'SALVAR LOCAL'}
        </button>
        <button type="button" onClick={handleLimpar}
          className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
          <RotateCcw size={18} />
          LIMPAR CAMPOS
        </button>
      </div>
    </form>
  );

  // Modo compacto: usado no mobile, com botão para expandir/recolher
  if (modoCompacto) {
    return (
      <div className="card overflow-hidden">
        <button
          onClick={() => setAberto(prev => !prev)}
          className="w-full flex items-center justify-between px-4 py-3 text-left"
        >
          <span className="flex items-center gap-2 text-rose-400 font-bold">
            <Plus size={18} />
            Registrar Novo Endereço
          </span>
          <ChevronUp
            size={20}
            className={`text-slate-400 transition-transform duration-300 ${aberto ? 'rotate-0' : 'rotate-180'}`}
          />
        </button>
        {aberto && (
          <div className="px-4 pb-4 border-t border-slate-800 pt-4">
            {formulario}
          </div>
        )}
      </div>
    );
  }

  // Modo normal: usado no desktop
  return (
    <div className="card p-6 sticky top-8">
      <h2 className="text-xl font-bold text-rose-400 mb-6 flex items-center gap-2">
        <Building2 size={20} />
        Novo Local
      </h2>
      {formulario}
    </div>
  );
}