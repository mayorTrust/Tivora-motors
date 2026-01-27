
import React, { useState } from 'react';
import { Plus, Trash2, Edit, Save, X, Eye, Package } from 'lucide-react';
import { Category } from '../constants';

const Admin = ({ vehicles, onAdd, onUpdate, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const resetForm = () => {
    setEditForm({
      category: Category.CAR,
      featured: false,
      images: ['https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&q=80&w=1200'],
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      condition: 'New'
    });
  };

  const handleStartAdd = () => {
    resetForm();
    setIsAdding(true);
  };

  const handleSave = () => {
    if (editingId) {
      onUpdate(editForm);
      setEditingId(null);
    } else {
      const newVehicle = {
        ...editForm,
        id: Math.random().toString(36).substr(2, 9)
      };
      onAdd(newVehicle);
      setIsAdding(false);
    }
  };

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase">Tivora <span className="text-[#00f3ff]">Dashboard</span></h1>
          <p className="text-gray-500">Manage your collection inventory.</p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={handleStartAdd}
            className="bg-[#00f3ff] text-black font-bold py-3 px-6 rounded-xl flex items-center gap-2 hover:bg-white hover:text-black transition-colors"
          >
            <Plus className="w-5 h-5" /> Add New Vehicle
          </button>
        )}
      </div>

      {(isAdding || editingId) ? (
        <div className="glass-card p-8 rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
            <h3 className="text-2xl font-bold italic">{editingId ? 'Edit' : 'Add New'} Vehicle</h3>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="p-2 text-gray-500 hover:text-white transition-colors">
              <X />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500">Name</label>
              <input
                type="text"
                value={editForm.name || ''}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[#00f3ff]"
                placeholder="Model Name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500">Brand</label>
              <input
                type="text"
                value={editForm.brand || ''}
                onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[#00f3ff]"
                placeholder="Manufacturer"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500">Category</label>
              <select
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[#00f3ff] appearance-none"
              >
                {Object.values(Category).map(cat => <option key={cat} value={cat} className="bg-[#111]">{cat}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500">Price ($)</label>
              <input
                type="number"
                value={editForm.price || ''}
                onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[#00f3ff]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500">Year</label>
              <input
                type="number"
                value={editForm.year || ''}
                onChange={(e) => setEditForm({ ...editForm, year: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[#00f3ff]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500">Mileage (mi)</label>
              <input
                type="number"
                value={editForm.mileage || ''}
                onChange={(e) => setEditForm({ ...editForm, mileage: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[#00f3ff]"
              />
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Description</label>
            <textarea
              rows={3}
              value={editForm.description || ''}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[#00f3ff] resize-none"
            />
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-[#00f3ff] hover:bg-white hover:text-black text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <Save className="w-5 h-5" /> {editingId ? 'Update' : 'Publish'} Listing
            </button>
            <button
              onClick={() => { setIsAdding(false); setEditingId(null); }}
              className="px-8 bg-white/10 hover:bg-white/20 font-bold rounded-xl transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto glass-card rounded-3xl border border-white/10">
          <table className="w-full text-left">
            <thead className="border-b border-white/10">
              <tr>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-500">Vehicle</th>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-500">Category</th>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-500">Price</th>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-500">Year</th>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {vehicles.map((v) => (
                <tr key={v.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={v.images[0]} className="w-12 h-12 rounded-lg object-cover bg-black" />
                      <div>
                        <div className="font-bold">{v.name}</div>
                        <div className="text-xs text-gray-500">{v.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">{v.category}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-[#00f3ff]">${v.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-400">{v.year}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditingId(v.id); setEditForm(v); }}
                        className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(v.id)}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {vehicles.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-500 italic">
                    <div className="flex flex-col items-center gap-4">
                      <Package className="w-10 h-10 opacity-20" />
                      No listings found in the showroom.
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
