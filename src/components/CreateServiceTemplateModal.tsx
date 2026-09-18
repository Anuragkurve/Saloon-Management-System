import React, { useState } from 'react';
import { X, Sparkles, Clock, Check, Plus, Trash2, Layers, Tag, FileText } from 'lucide-react';
import { ServiceItem } from '../types';

interface CreateServiceTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTemplate: (template: ServiceItem) => void;
}

const CATEGORIES = [
  'Haircut & Styling',
  'Color & Balayage',
  'Treatments & Spa',
  'Texture & Keratin',
  'Beauty & Nails',
  'Combo Package',
];

const POPULAR_PRESETS = [
  { name: 'Bridal Royal Glow Package', category: 'Combo Package', price: 8500, duration: 180, desc: 'Complete bridal hair styling, glow facial, manicure, and precision draping.' },
  { name: 'Men’s Executive Fade & Beard Grooming', category: 'Haircut & Styling', price: 1200, duration: 45, desc: 'Hot towel steam, precision skin fade haircut, organic beard shaping, and tonic styling.' },
  { name: 'Japanese Scalp Head Spa & Detox', category: 'Treatments & Spa', price: 2800, duration: 60, desc: 'Deep follicle detox with circular water halo therapy, rosemary essential oil, and neck massage.' },
  { name: 'Express Blowout & Volume Styling', category: 'Haircut & Styling', price: 900, duration: 30, desc: 'Rapid shampoo wash, volumizing root booster, and bouncy round-brush blowout.' },
];

export const CreateServiceTemplateModal: React.FC<CreateServiceTemplateModalProps> = ({
  isOpen,
  onClose,
  onSaveTemplate,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [price, setPrice] = useState<string>('1500');
  const [durationMinutes, setDurationMinutes] = useState<string>('45');
  const [description, setDescription] = useState('');
  const [packageItems, setPackageItems] = useState<string[]>([]);
  const [newItemInput, setNewItemInput] = useState('');

  if (!isOpen) return null;

  const handleAddPackageItem = () => {
    if (!newItemInput.trim()) return;
    setPackageItems([...packageItems, newItemInput.trim()]);
    setNewItemInput('');
  };

  const handleRemovePackageItem = (idxToRemove: number) => {
    setPackageItems(packageItems.filter((_, idx) => idx !== idxToRemove));
  };

  const handleApplyPreset = (preset: typeof POPULAR_PRESETS[0]) => {
    setName(preset.name);
    setCategory(preset.category);
    setIsCustomCategory(false);
    setPrice(preset.price.toString());
    setDurationMinutes(preset.duration.toString());
    setDescription(preset.desc);
    if (preset.category === 'Combo Package') {
      setPackageItems(['Hair Styling', 'Treatment Mask', 'Blowout Finish']);
    } else {
      setPackageItems([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalCategory = isCustomCategory && customCategory.trim() ? customCategory.trim() : category;

    const newTemplate: ServiceItem = {
      id: `srv-tpl-${Date.now()}`,
      name: name.trim(),
      category: finalCategory,
      price: Math.max(0, parseFloat(price) || 0),
      durationMinutes: Math.max(5, parseInt(durationMinutes) || 30),
      description: description.trim() || 'Custom salon service template.',
      isTemplate: true,
      packageItems: packageItems.length > 0 ? packageItems : undefined,
    };

    onSaveTemplate(newTemplate);
    onClose();

    // Reset fields
    setName('');
    setDescription('');
    setPackageItems([]);
    setPrice('1500');
    setDurationMinutes('45');
    setIsCustomCategory(false);
  };

  return (
    <div id="create-service-template-modal-backdrop" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        id="create-service-template-modal"
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Create Service Template</h3>
              <p className="text-[11px] text-slate-500">Save custom service or combo package template for instant 1-click billing</p>
            </div>
          </div>
          <button
            id="close-create-template-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* Quick Preset Ideas */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Quick Inspiration Presets (Click to Auto-fill)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 text-[11px] font-semibold border border-purple-200/70 transition-colors flex items-center gap-1"
                >
                  <span>{p.name.split(' ')[0]} {p.name.split(' ')[1]}</span>
                  <span className="text-purple-600 font-bold">₹{p.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Template Service Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Service Template Name <span className="text-red-500">*</span>
            </label>
            <input
              id="template-name-input"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Signature Balayage + Keratin Mask or Men's Royal Grooming"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          {/* Category */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-purple-600" />
                <span>Service Category</span>
              </label>
              <button
                type="button"
                onClick={() => setIsCustomCategory(!isCustomCategory)}
                className="text-[11px] text-purple-600 hover:text-purple-700 font-semibold"
              >
                {isCustomCategory ? 'Choose Preset Category' : '+ Custom Category'}
              </button>
            </div>

            {isCustomCategory ? (
              <input
                id="template-custom-category"
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="e.g. Bridal Packages, Spa Therapy..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            ) : (
              <select
                id="template-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Price & Duration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Default Template Price (₹)</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Editable anytime</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                <input
                  id="template-price-input"
                  type="number"
                  min="0"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="1500"
                  className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Estimated Duration (mins)</span>
              </label>
              <input
                id="template-duration-input"
                type="number"
                min="5"
                step="5"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                placeholder="45"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Description / Service Inclusions</span>
            </label>
            <textarea
              id="template-description-input"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Includes premium scalp massage, Moroccan oil wash, precision cut, and salon blowout finish."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          {/* Package Bundled Items (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-purple-600" />
                <span>Package Items / Inclusions (Optional)</span>
              </label>
              <span className="text-[10px] text-slate-400 font-medium">For combo deals</span>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={newItemInput}
                onChange={(e) => setNewItemInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPackageItem();
                  }
                }}
                placeholder="e.g. Steam Facial, Organic Hair Spa, Beard Shaping..."
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
              <button
                type="button"
                onClick={handleAddPackageItem}
                className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {packageItems.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                {packageItems.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-800 text-[11px] font-semibold shadow-2xs"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePackageItem(idx)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Quick Notice Banner */}
          <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 text-[11px] text-purple-900 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <p>
              Once saved, this template appears in your <strong>Quick Billing</strong> dropdown and one-click packages bar. During checkout, you can <strong>manually override or adjust the amount</strong> for any client on the fly.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              id="cancel-create-template-btn"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-create-template-btn"
              className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Save Service Template</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
