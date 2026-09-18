import React, { useState } from 'react';
import { Settings, Scissors, Save, Check, Plus, ShieldCheck, Clock, MapPin, RefreshCw, Trash2, CheckCircle2, Sparkles, Layers } from 'lucide-react';
import { ServiceItem } from '../types';
import { CreateServiceTemplateModal } from './CreateServiceTemplateModal';

interface SettingsViewProps {
  servicesList: ServiceItem[];
  onAddService: (service: ServiceItem) => void;
  onDeleteService?: (serviceId: string) => void;
  onResetToCleanData?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  servicesList,
  onAddService,
  onDeleteService,
  onResetToCleanData,
}) => {
  const [salonName, setSalonName] = useState('House of Hairs Saloon');
  const [salonAddress, setSalonAddress] = useState('42 Avenue Grand Boulevard, Luxury Arcade Suite 4B');
  const [salonPhone, setSalonPhone] = useState('+91 98765 43210');
  const [currencySymbol, setCurrencySymbol] = useState('₹');
  const [isSaved, setIsSaved] = useState(false);
  const [isResetDone, setIsResetDone] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  // New Service
  const [showAddService, setShowAddService] = useState(false);
  const [srvName, setSrvName] = useState('');
  const [srvCategory, setSrvCategory] = useState<ServiceItem['category']>('Haircut & Styling');
  const [srvPrice, setSrvPrice] = useState('1500');
  const [srvDuration, setSrvDuration] = useState('45');
  const [srvDesc, setSrvDesc] = useState('');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!srvName) return;

    const newSrv: ServiceItem = {
      id: `srv-${Date.now()}`,
      name: srvName,
      category: srvCategory,
      price: parseFloat(srvPrice) || 0,
      durationMinutes: parseInt(srvDuration) || 30,
      description: srvDesc || 'Signature salon service treatment.',
    };

    onAddService(newSrv);
    setShowAddService(false);
    setSrvName('');
    setSrvDesc('');
  };

  return (
    <div id="settings-view-container" className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Salon Configuration & Services Menu</h2>
        <p className="text-xs text-slate-500">Configure salon credentials, pricing menu, and operational parameters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Salon General Info */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Scissors className="w-4 h-4 text-purple-600" />
            <span>Salon Business Profile</span>
          </h3>

          <form onSubmit={handleSaveSettings} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Salon Brand Name</label>
              <input
                type="text"
                value={salonName}
                onChange={(e) => setSalonName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Store Address</label>
              <input
                type="text"
                value={salonAddress}
                onChange={(e) => setSalonAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Hotline</label>
                <input
                  type="text"
                  value={salonPhone}
                  onChange={(e) => setSalonPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Base Currency</label>
                <input
                  type="text"
                  value={currencySymbol}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                <span>{isSaved ? 'Settings Saved!' : 'Save Changes'}</span>
              </button>
            </div>
          </form>

          {/* Operating hours info */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Standard Operating Hours</span>
            </h4>
            <div className="text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Monday – Saturday:</span>
                <span className="font-semibold text-slate-800">09:30 AM – 08:30 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday (Peak Hours):</span>
                <span className="font-semibold text-purple-700">10:00 AM – 07:00 PM</span>
              </div>
            </div>
          </div>

          {/* Clean Software Data Management */}
          {onResetToCleanData && (
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Clean Software Baseline</span>
              </h4>
              <p className="text-[11px] text-slate-500 mb-3">
                All bloated demo records have been removed. Exactly one starter demo record exists per module (Customer, Staff, Billing, Appointments, Offers).
              </p>
              <button
                type="button"
                onClick={() => {
                  onResetToCleanData();
                  setIsResetDone(true);
                  setTimeout(() => setIsResetDone(false), 2500);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all"
              >
                {isResetDone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <RefreshCw className="w-3.5 h-3.5 text-slate-500" />}
                <span>{isResetDone ? 'Reset to 1-Record Demo Data Done!' : 'Reset to Clean 1-Record Demo Data'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Services & Pricing Menu */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Services & Template Menu</h3>
              <p className="text-[11px] text-slate-500">Service templates for quick billing & POS presets</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="btn-settings-create-template"
                onClick={() => setIsTemplateModalOpen(true)}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>+ Create Template</span>
              </button>
              <button
                type="button"
                onClick={() => setShowAddService(!showAddService)}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </button>
            </div>
          </div>

          {showAddService && (
            <form onSubmit={handleCreateService} className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Service Name"
                  value={srvName}
                  onChange={(e) => setSrvName(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-md"
                />
                <select
                  value={srvCategory}
                  onChange={(e) => setSrvCategory(e.target.value as any)}
                  className="px-2 py-1.5 bg-white border border-slate-200 rounded-md"
                >
                  <option value="Haircut & Styling">Haircut & Styling</option>
                  <option value="Color & Balayage">Color & Balayage</option>
                  <option value="Treatments & Spa">Treatments & Spa</option>
                  <option value="Texture & Keratin">Texture & Keratin</option>
                  <option value="Beauty & Nails">Beauty & Nails</option>
                  <option value="Combo Package">Combo Package</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Price (₹)"
                  value={srvPrice}
                  onChange={(e) => setSrvPrice(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-md"
                />
                <input
                  type="number"
                  placeholder="Duration (mins)"
                  value={srvDuration}
                  onChange={(e) => setSrvDuration(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-md"
                />
              </div>
              <button
                type="submit"
                className="w-full py-1.5 bg-purple-600 text-white rounded-md font-bold text-xs"
              >
                Save New Service
              </button>
            </form>
          )}

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 pr-1 space-y-0.5">
            {servicesList.map((srv) => (
              <div key={srv.id} className="py-2.5 flex items-center justify-between text-xs group hover:bg-slate-50/80 px-1 rounded-lg transition-colors">
                <div className="min-w-0 flex-1 pr-2">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-800 truncate">{srv.name}</p>
                    {srv.isTemplate && (
                      <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded font-bold">
                        Template
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {srv.category} • {srv.durationMinutes} mins
                    {srv.packageItems && srv.packageItems.length > 0 && ` • ${srv.packageItems.length} perks`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-sm">
                    ₹{srv.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  {onDeleteService && servicesList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onDeleteService(srv.id)}
                      className="p-1 text-slate-300 hover:text-red-500 rounded transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete service template"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Template Modal */}
      <CreateServiceTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSaveTemplate={onAddService}
      />
    </div>
  );
};
