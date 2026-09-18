import React, { useState } from 'react';
import {
  Settings,
  Scissors,
  Save,
  Check,
  Plus,
  ShieldCheck,
  Clock,
  MapPin,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Sparkles,
  Layers,
  Laptop,
  Terminal,
  Copy,
  ExternalLink,
  HardDrive,
  Download,
  UploadCloud,
  Printer,
  Database,
  WifiOff,
} from 'lucide-react';
import {
  Customer,
  Staff,
  Receptionist,
  ServiceItem,
  AppointmentLedgerItem,
  MarketingCampaign,
  Invoice,
} from '../types';
import { CreateServiceTemplateModal } from './CreateServiceTemplateModal';
import { DesktopAppGuideModal } from './DesktopAppGuideModal';
import {
  exportDatabaseToDisk,
  importDatabaseFromDisk,
  isElectronDesktop,
  SalonDatabaseExport,
} from '../utils/offlineBackup';

interface SettingsViewProps {
  servicesList: ServiceItem[];
  customers?: Customer[];
  staffList?: Staff[];
  receptionists?: Receptionist[];
  ledgerItems?: AppointmentLedgerItem[];
  campaigns?: MarketingCampaign[];
  invoices?: Invoice[];
  onAddService: (service: ServiceItem) => void;
  onDeleteService?: (serviceId: string) => void;
  onResetToCleanData?: () => void;
  onRestoreDatabase?: (data: SalonDatabaseExport['data']) => void;
  onShowToast?: (title: string, desc: string, type?: 'success' | 'info') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  servicesList,
  customers = [],
  staffList = [],
  receptionists = [],
  ledgerItems = [],
  campaigns = [],
  invoices = [],
  onAddService,
  onDeleteService,
  onResetToCleanData,
  onRestoreDatabase,
  onShowToast,
}) => {
  const [salonName, setSalonName] = useState('House of Hairs Saloon');
  const [salonAddress, setSalonAddress] = useState('42 Avenue Grand Boulevard, Luxury Arcade Suite 4B');
  const [salonPhone, setSalonPhone] = useState('+91 98765 43210');
  const [currencySymbol, setCurrencySymbol] = useState('₹');
  const [isSaved, setIsSaved] = useState(false);
  const [isResetDone, setIsResetDone] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isDesktopModalOpen, setIsDesktopModalOpen] = useState(false);
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  // Backup & Restore State
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [backupStatusMessage, setBackupStatusMessage] = useState<string | null>(null);

  const isDesktop = isElectronDesktop();

  const handleExportBackup = async () => {
    setIsExporting(true);
    setBackupStatusMessage(null);
    const result = await exportDatabaseToDisk({
      customers,
      staffList,
      receptionists,
      servicesList,
      ledgerItems,
      campaigns,
      invoices,
    });
    setIsExporting(false);
    setBackupStatusMessage(result.message);
    if (onShowToast) {
      onShowToast(result.success ? 'Backup Exported' : 'Export Notice', result.message, result.success ? 'success' : 'info');
    }
    setTimeout(() => setBackupStatusMessage(null), 6000);
  };

  const handleImportBackup = async () => {
    setIsImporting(true);
    setBackupStatusMessage(null);
    const result = await importDatabaseFromDisk();
    setIsImporting(false);
    if (result.success && result.data && onRestoreDatabase) {
      onRestoreDatabase(result.data);
      setBackupStatusMessage(result.message);
      if (onShowToast) {
        onShowToast('Database Restored', 'All salon records successfully loaded from backup file.', 'success');
      }
    } else if (!result.success && result.message !== 'Restore cancelled by user.') {
      setBackupStatusMessage(result.message);
      if (onShowToast) {
        onShowToast('Restore Notice', result.message, 'info');
      }
    }
    setTimeout(() => setBackupStatusMessage(null), 6000);
  };

  const handleTestPrint = () => {
    const electronAPI = (window as unknown as { electronAPI?: { printThermalReceipt?: (opts: unknown) => Promise<unknown>; printWindow?: () => Promise<unknown> } }).electronAPI;
    if (electronAPI && typeof electronAPI.printThermalReceipt === 'function') {
      electronAPI.printThermalReceipt({ silent: false });
    } else {
      window.print();
    }
  };

  const handleCopyCommand = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(id);
    setTimeout(() => setCopiedScript(null), 2000);
  };

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

      {/* Offline Local Database & Hard Drive Backup Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/60">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Offline Storage & Hard Drive Backups</h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  100% Offline Capable
                </span>
              </div>
              <p className="text-xs text-slate-500">
                All salon data is saved directly on this computer. Zero cloud server dependency.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestPrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              title="Test system printer or POS thermal receipt printer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Test POS Print</span>
            </button>
          </div>
        </div>

        {/* Live Local Database Records Count */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-center">
            <p className="text-lg font-black text-slate-800">{customers.length}</p>
            <p className="text-[11px] font-semibold text-slate-500">Clients</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-center">
            <p className="text-lg font-black text-slate-800">{staffList.length}</p>
            <p className="text-[11px] font-semibold text-slate-500">Stylists</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-center">
            <p className="text-lg font-black text-slate-800">{receptionists.length}</p>
            <p className="text-[11px] font-semibold text-slate-500">Reception</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-center">
            <p className="text-lg font-black text-slate-800">{servicesList.length}</p>
            <p className="text-[11px] font-semibold text-slate-500">Services</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-center">
            <p className="text-lg font-black text-slate-800">{invoices.length}</p>
            <p className="text-[11px] font-semibold text-slate-500">Invoices</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-center">
            <p className="text-lg font-black text-slate-800">{ledgerItems.length}</p>
            <p className="text-[11px] font-semibold text-slate-500">Appointments</p>
          </div>
        </div>

        {/* Action Buttons: Export & Restore */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/50 space-y-3">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-purple-600" />
              <h4 className="text-xs font-bold text-slate-800">Export Backup to Hard Drive</h4>
            </div>
            <p className="text-xs text-slate-500">
              Saves a timestamped <code className="text-purple-700 font-mono">.json</code> file containing your complete salon records (clients, hair formulas, invoices, ledger) directly to your computer or USB drive.
            </p>
            <button
              type="button"
              onClick={handleExportBackup}
              disabled={isExporting}
              className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold rounded-xl text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Exporting Backup...' : 'Export Complete Backup (.json)'}</span>
            </button>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/50 space-y-3">
            <div className="flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-slate-800">Restore Backup from Hard Drive</h4>
            </div>
            <p className="text-xs text-slate-500">
              Restore your salon from any previously exported <code className="text-emerald-700 font-mono">.json</code> backup file. Works entirely offline without requiring internet.
            </p>
            <button
              type="button"
              onClick={handleImportBackup}
              disabled={isImporting}
              className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{isImporting ? 'Reading Backup File...' : 'Restore from Backup (.json)'}</span>
            </button>
          </div>
        </div>

        {backupStatusMessage && (
          <div className="p-3 bg-purple-50 border border-purple-200 text-purple-900 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
            <span>{backupStatusMessage}</span>
          </div>
        )}
      </div>

      {/* Desktop Application (Electron) Configuration Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950 text-white rounded-2xl p-6 border border-purple-800/40 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-400/30 flex items-center justify-center text-purple-300">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white">Desktop Application (Option 1: Electron)</h3>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Configured & Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pre-configured for Windows (<code className="text-purple-300">.exe</code>), macOS (<code className="text-purple-300">.dmg</code>), and Linux (<code className="text-purple-300">.AppImage</code>)
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDesktopModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-sm shrink-0"
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Open Packaging Guide</span>
          </button>
        </div>

        {/* Quick Commands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {/* Command 1: Local test */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-purple-300">1. Test Desktop App Locally</p>
              <code className="text-xs font-mono text-emerald-400 block truncate">npm run electron</code>
            </div>
            <button
              onClick={() => handleCopyCommand('npm run electron', 'cmd1')}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
              title="Copy command"
            >
              {copiedScript === 'cmd1' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Command 2: Windows Build */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-purple-300">2. Build Windows .exe Installer</p>
              <code className="text-xs font-mono text-emerald-400 block truncate">npm run build:desktop:win</code>
            </div>
            <button
              onClick={() => handleCopyCommand('npm run build:desktop:win', 'cmd2')}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
              title="Copy command"
            >
              {copiedScript === 'cmd2' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Command 3: macOS Build */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-purple-300">3. Build macOS .dmg Installer</p>
              <code className="text-xs font-mono text-emerald-400 block truncate">npm run build:desktop:mac</code>
            </div>
            <button
              onClick={() => handleCopyCommand('npm run build:desktop:mac', 'cmd3')}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
              title="Copy command"
            >
              {copiedScript === 'cmd3' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Command 4: Universal Builder */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-purple-300">4. Universal Build (Current Host OS)</p>
              <code className="text-xs font-mono text-emerald-400 block truncate">npm run build:desktop</code>
            </div>
            <button
              onClick={() => handleCopyCommand('npm run build:desktop', 'cmd4')}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
              title="Copy command"
            >
              {copiedScript === 'cmd4' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="pt-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-400 border-t border-slate-800/80">
          <span>Files installed: <code className="font-mono text-purple-300">electron/main.cjs</code>, <code className="font-mono text-purple-300">electron/preload.cjs</code>, <code className="font-mono text-purple-300">package.json</code></span>
          <span className="text-purple-300 font-semibold">Output Directory: dist-electron/</span>
        </div>
      </div>

      {/* Service Template Modal */}
      <CreateServiceTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSaveTemplate={onAddService}
      />

      {/* Desktop App Packaging Guide Modal */}
      <DesktopAppGuideModal
        isOpen={isDesktopModalOpen}
        onClose={() => setIsDesktopModalOpen(false)}
      />
    </div>
  );
};
