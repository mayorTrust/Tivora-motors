import React, { useState, useRef } from 'react';
import { Plus, Trash2, Edit, Save, X, Eye, Package, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Category } from '../constants';
import { uploadToCloudinary } from '../lib/cloudinary';

const Admin = ({ vehicles, onAdd, onUpdate, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const resetForm = () => {
    setEditForm({
      category: Category.CAR,
      featured: false,
      images: [],
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      condition: 'New',
      engine: '',
      transmission: '',
      color: '',
      location: '',
      description: ''
    });
  };

  const handleStartAdd = () => {
    resetForm();
    setIsAdding(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setEditForm(prev => ({
        ...prev,
        images: [...(prev.images || []), url]
      }));
    } catch (error) {
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index) => {
    setEditForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    if (!editForm.name || !editForm.brand) {
      alert("Please enter Name and Brand.");
      return;
    }

    if (editingId) {
      await onUpdate(editForm);
      setEditingId(null);
    } else {
      await onAdd(editForm);
      setIsAdding(false);
    }
  };

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase">Tivora <span className="text-[#00f3ff]">Mission Control</span></h1>
          <p className="text-gray-500 font-light tracking-wide">Manage the elite inventory fleet in real-time.</p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={handleStartAdd}
            className="bg-[#00f2ff] text-black font-black py-4 px-10 rounded-2xl flex items-center gap-3 hover:bg-white transition-all shadow-[0_0_20px_rgba(0,242,255,0.2)] uppercase tracking-widest text-xs"
          >
            <Plus className="w-5 h-5" /> Provision Asset
          </button>
        )}
      </div>

      {(isAdding || editingId) ? (
        <div className="glass-card p-10 rounded-[3rem] border border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-10 pb-8 border-b border-white/5">
            <div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">{editingId ? 'Modify' : 'Provision'} Listing</h3>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Configure vehicle specifications and media matrix.</p>
            </div>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="p-3 text-gray-500 hover:text-white bg-white/5 rounded-full transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 px-1">Model Identity</label>
              <input
                type="text"
                value={editForm.name || ''}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 focus:outline-none focus:border-[#00f2ff]/50 transition-all font-medium text-white placeholder:text-white/10"
                placeholder="e.g. Roma Spider"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 px-1">Manufacturer</label>
              <input
                type="text"
                value={editForm.brand || ''}
                onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 focus:outline-none focus:border-[#00f2ff]/50 transition-all font-medium text-white placeholder:text-white/10"
                placeholder="e.g. Ferrari"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 px-1">Classification</label>
              <select
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 focus:outline-none focus:border-[#00f2ff]/50 transition-all font-medium text-white appearance-none"
              >
                {Object.values(Category).map(cat => <option key={cat} value={cat} className="bg-[#050505]">{cat}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 px-1">Market Price ($)</label>
              <input
                type="number"
                value={editForm.price || ''}
                onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 focus:outline-none focus:border-[#00f2ff]/50 transition-all font-medium text-white"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 px-1">Production Year</label>
              <input
                type="number"
                value={editForm.year || ''}
                onChange={(e) => setEditForm({ ...editForm, year: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 focus:outline-none focus:border-[#00f2ff]/50 transition-all font-medium text-white"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 px-1">Usage Meter (mi)</label>
              <input
                type="number"
                value={editForm.mileage || ''}
                onChange={(e) => setEditForm({ ...editForm, mileage: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 focus:outline-none focus:border-[#00f2ff]/50 transition-all font-medium text-white"
              />
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 px-1">Media Assets</label>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {editForm.images?.map((img, idx) => (
                  <div key={idx} className="relative aspect-square group">
                    <img src={img} className="w-full h-full object-cover rounded-2xl border border-white/10 shadow-lg" />
                    <button 
                      onClick={() => removeImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="aspect-square rounded-2xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center gap-2 hover:bg-white/[0.08] transition-all group"
                >
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 text-[#00f2ff] animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-gray-500 group-hover:text-[#00f2ff] transition-colors" />
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Upload</span>
                    </>
                  )}
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 px-1">Brief Description</label>
              <textarea
                rows={5}
                value={editForm.description || ''}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 focus:outline-none focus:border-[#00f2ff]/50 transition-all font-medium text-white resize-none placeholder:text-white/10"
                placeholder="Market highlights and unique features..."
              />
            </div>
          </div>

          <div className="mt-12 flex gap-4 pt-10 border-t border-white/5">
            <button
              onClick={handleSave}
              className="flex-1 bg-[#00f2ff] hover:bg-white text-black font-black py-6 rounded-3xl flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_rgba(0,242,255,0.1)] uppercase tracking-[0.2em] text-xs"
            >
              <Save className="w-5 h-5" /> {editingId ? 'Push Updates' : 'Authorize Listing'}
            </button>
            <button
              onClick={() => { setIsAdding(false); setEditingId(null); }}
              className="px-12 bg-white/5 hover:bg-white/10 text-white font-black rounded-3xl transition-all border border-white/5 uppercase tracking-[0.2em] text-xs"
            >
              Abort
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto glass-card rounded-[3rem] border border-white/5 shadow-2xl">
          <table className="w-full text-left">
            <thead className="border-b border-white/5 bg-white/[0.02]">
              <tr>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30">Fleet Asset</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30">Class</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30">Valuation</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30">Era</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {vehicles.map((v) => (
                <tr key={v.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-6">
                      <div className="relative w-16 h-16">
                        <img src={v.images?.[0]} className="w-full h-full rounded-2xl object-cover bg-black border border-white/10 shadow-xl" />
                        {v.featured && <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00f2ff] rounded-full border-4 border-black" />}
                      </div>
                      <div>
                        <div className="font-black text-white tracking-tighter uppercase italic">{v.name}</div>
                        <div className="text-[10px] text-gray-500 font-black mt-1 uppercase tracking-widest">{v.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="text-[10px] border border-white/10 bg-white/5 px-4 py-2 rounded-full text-gray-400 font-black uppercase tracking-[0.2em]">{v.category}</span>
                  </td>
                  <td className="px-10 py-6 font-black text-[#00f2ff] tracking-tighter text-xl">${v.price?.toLocaleString()}</td>
                  <td className="px-10 py-6 text-gray-500 font-black tabular-nums">{v.year}</td>
                  <td className="px-10 py-6">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditingId(v.id); setEditForm(v); }}
                        className="p-4 text-gray-400 hover:text-black hover:bg-[#00f2ff] rounded-2xl transition-all border border-white/5"
                        title="Edit Spec"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(v.id)}
                        className="p-4 text-gray-400 hover:text-white hover:bg-red-500/20 rounded-2xl transition-all border border-white/5"
                        title="Decommission"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {vehicles.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-10 py-40 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-8">
                      <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/5 shadow-inner">
                        <Package className="w-10 h-10 opacity-20" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xl font-black italic tracking-tighter uppercase text-white/20">Inventory Vault Empty</p>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">No assets are currently registered in the database.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;
