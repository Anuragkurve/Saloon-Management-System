import React, { useState } from 'react';
import { Search, UserPlus, Phone, Mail, Sparkles, MessageCircle, Calendar, Tag, AlertTriangle, FileText, ChevronRight, Trash2, X } from 'lucide-react';
import { Customer } from '../types';

interface CustomersViewProps {
  customers: Customer[];
  onOpenAddCustomerModal: () => void;
  onSelectCustomerToBook: (customer: Customer) => void;
  onSendWhatsApp: (customerId: string, message: string) => void;
  onDeleteCustomer: (customerId: string) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  onOpenAddCustomerModal,
  onSelectCustomerToBook,
  onSendWhatsApp,
  onDeleteCustomer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0] || null;

  const availableTags = ['All', ...Array.from(new Set(customers.flatMap((c) => c.tags)))];

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (activeFilter === 'All') return true;
    return c.tags.includes(activeFilter);
  });

  const handleOpenWhatsApp = (customer: Customer) => {
    const cleanPhone = customer.phone.replace(/[^0-9]/g, '');
    const msg = `Hello ${customer.name}! Greetings from House of Hairs Saloon. How can we assist your hair care today?`;
    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`, '_blank');
    onSendWhatsApp(customer.id, msg);
  };

  return (
    <div id="customers-view-container" className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Client Profiles & Hair Records</h2>
          <p className="text-xs text-slate-500">Manage client history, formulas, allergies, and lifetime spend</p>
        </div>
        <button
          onClick={onOpenAddCustomerModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add New Client</span>
        </button>
      </div>

      {/* Main Grid: Left list, Right detail card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col h-[680px]">
          {/* Search & Tags */}
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2">
            {availableTags.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  activeFilter === filter
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Customers Scroll List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 pr-1">
            {filteredCustomers.map((cust) => (
              <div
                key={cust.id}
                onClick={() => setSelectedCustomerId(cust.id)}
                className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-all my-1 ${
                  selectedCustomer?.id === cust.id
                    ? 'bg-purple-50/80 border border-purple-200 shadow-2xs'
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={cust.avatar}
                    alt={cust.name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                  />
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-800 truncate">{cust.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{cust.phone}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-semibold text-purple-700 bg-purple-100/60 px-1.5 py-0.2 rounded">
                        {cust.totalVisits} visits
                      </span>
                      <span className="text-[10px] text-slate-400">
                        ₹{cust.totalSpent.toLocaleString('en-IN')} spent
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCustomerToDelete(cust);
                    }}
                    className="p-1 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title={`Delete ${cust.name}`}
                    aria-label={`Delete ${cust.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Detail Panel */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          {selectedCustomer ? (
            <div className="space-y-6">
              {/* Profile Top Bar */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedCustomer.avatar}
                    alt={selectedCustomer.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-500/20 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900">{selectedCustomer.name}</h3>
                      {selectedCustomer.tags.includes('VIP Client') && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          VIP
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />
                        {selectedCustomer.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" />
                        {selectedCustomer.email}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenWhatsApp(selectedCustomer)}
                    className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    title="WhatsApp Client"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>
                  <button
                    onClick={() => onSelectCustomerToBook(selectedCustomer)}
                    className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Service</span>
                  </button>
                  <button
                    onClick={() => setCustomerToDelete(selectedCustomer)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl transition-all flex items-center gap-1 text-xs font-semibold"
                    title="Delete Client Profile"
                    aria-label={`Delete ${selectedCustomer.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden xl:inline">Delete</span>
                  </button>
                </div>
              </div>

              {/* Spend & Visit Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-[11px] font-medium text-slate-500">Total Visits</span>
                  <p className="text-lg font-bold text-slate-800">{selectedCustomer.totalVisits} sessions</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 text-center">
                  <span className="text-[11px] font-medium text-purple-700">Lifetime Spend</span>
                  <p className="text-lg font-extrabold text-purple-900">₹{selectedCustomer.totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-[11px] font-medium text-slate-500">Preferred Stylist</span>
                  <p className="text-xs font-bold text-slate-800 mt-1">{selectedCustomer.preferredStylist}</p>
                </div>
              </div>

              {/* Hair Profile Card */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  Hair Diagnostics & Characteristics
                </h4>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 space-y-1">
                  <p className="font-semibold text-slate-900">{selectedCustomer.hairType}</p>
                  <p className="text-[11px] text-slate-500">Last analyzed during last visit: {selectedCustomer.lastVisit}</p>
                </div>
              </div>

              {/* Hair Color Formula Card (Salon Specific & High Value!) */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-purple-600" />
                  Master Color Formula & Chemical Recipes
                </h4>
                <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200/70 text-xs font-mono text-amber-900 leading-relaxed">
                  {selectedCustomer.hairColorFormula}
                </div>
              </div>

              {/* Allergies & Safety Alert */}
              <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200/70 flex items-start gap-2.5 text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-rose-800">Allergies / Scalp Sensitivity:</span>
                  <p className="text-rose-700 mt-0.5">{selectedCustomer.allergies}</p>
                </div>
              </div>

              {/* Notes */}
              <div className="text-xs text-slate-600">
                <span className="font-bold text-slate-700">Client Preferences:</span> {selectedCustomer.notes}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400">Select a client from the list to view profile details</div>
          )}
        </div>
      </div>

      {/* Delete Customer Confirmation Modal */}
      {customerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5 text-rose-600">
                <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Delete Client Profile</h3>
              </div>
              <button
                onClick={() => setCustomerToDelete(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to permanently delete this client? This will erase their hair records, chemical formulas, and visit history.
              </p>

              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <img
                    src={customerToDelete.avatar}
                    alt={customerToDelete.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <p className="font-bold text-slate-900">{customerToDelete.name}</p>
                    <p className="text-[11px] text-slate-500">{customerToDelete.phone} • {customerToDelete.email}</p>
                  </div>
                </div>
                <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600">
                  <span>Visits: <strong className="text-slate-800">{customerToDelete.totalVisits}</strong></span>
                  <span>Total Spent: <strong className="text-slate-800">₹{customerToDelete.totalSpent.toLocaleString('en-IN')}</strong></span>
                  <span>Stylist: <strong className="text-slate-800">{customerToDelete.preferredStylist}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setCustomerToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const targetId = customerToDelete.id;
                  onDeleteCustomer(targetId);
                  if (selectedCustomerId === targetId) {
                    const remaining = customers.filter((c) => c.id !== targetId);
                    setSelectedCustomerId(remaining[0]?.id || '');
                  }
                  setCustomerToDelete(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Client</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
