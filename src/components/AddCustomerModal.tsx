import React, { useState } from 'react';
import { X, UserPlus, Sparkles, Check } from 'lucide-react';
import { Customer, Staff } from '../types';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffList: Staff[];
  onAddCustomer: (customer: Customer) => void;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  isOpen,
  onClose,
  staffList,
  onAddCustomer,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [email, setEmail] = useState('');
  const [hairType, setHairType] = useState('Fine to medium wavy');
  const [hairColorFormula, setHairColorFormula] = useState('');
  const [preferredStylist, setPreferredStylist] = useState(staffList[0]?.name || 'Sarah J.');
  const [allergies, setAllergies] = useState('');
  const [notes, setNotes] = useState('');
  const [tag, setTag] = useState('New Client');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
      totalVisits: 1,
      totalSpent: 0,
      lastVisit: 'Today',
      hairType,
      hairColorFormula: hairColorFormula || 'Consultation on next service',
      preferredStylist,
      allergies: allergies || 'None reported',
      notes: notes || 'New walk-in client profile created',
      status: 'Select',
      tags: [tag, 'House of Hairs Member'],
    };

    onAddCustomer(newCustomer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">New Client Profile</h3>
              <p className="text-xs text-slate-500">Capture client hair history, formula & preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Natasha Roman"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
              <input
                type="text"
                required
                placeholder="+91 98765 00000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="client@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Stylist</label>
              <select
                value={preferredStylist}
                onChange={(e) => setPreferredStylist(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                {staffList.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.role.split(' ')[0]})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Hair Type & Texture</label>
            <input
              type="text"
              placeholder="e.g. Thick wavy 2B, bleached ends, dry scalp"
              value={hairType}
              onChange={(e) => setHairType(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Hair Color Formula / Treatment Recipe
            </label>
            <input
              type="text"
              placeholder="e.g. Wella 7/1 Ash + 20vol or Olaplex No. 2 soak"
              value={hairColorFormula}
              onChange={(e) => setHairColorFormula(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Allergies / Scalp Sensitivity</label>
              <input
                type="text"
                placeholder="e.g. Ammonia sensitive, perfume allergy"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Client Tag</label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="New Client">New Client</option>
                <option value="VIP Client">VIP Client</option>
                <option value="Balayage Regular">Balayage Regular</option>
                <option value="Keratin Fan">Keratin Fan</option>
                <option value="Walk-in">Walk-in</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Personal Notes</label>
            <textarea
              rows={2}
              placeholder="Beverage preference, styling goals, special requests..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm shadow-purple-600/20 flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Client Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
