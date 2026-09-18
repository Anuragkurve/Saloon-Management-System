import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Scissors, Sparkles, Check, AlertCircle, CheckCircle2, Phone, Mail } from 'lucide-react';
import { Customer, Staff, ServiceItem, AppointmentLedgerItem } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  staffList: Staff[];
  servicesList: ServiceItem[];
  initialCustomerId?: string;
  onBookAppointment: (
    appointment: Omit<AppointmentLedgerItem, 'id'>,
    newCustomerData?: {
      email?: string;
      hairType?: string;
      allergies?: string;
    }
  ) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  customers,
  staffList,
  servicesList,
  initialCustomerId,
  onBookAppointment
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(initialCustomerId || customers[0]?.id || 'new');
  const [customCustomerName, setCustomCustomerName] = useState('');
  const [customCustomerPhone, setCustomCustomerPhone] = useState('');
  const [customCustomerEmail, setCustomCustomerEmail] = useState('');
  const [customCustomerHairType, setCustomCustomerHairType] = useState('Normal, Medium Texture');
  const [customCustomerAllergies, setCustomCustomerAllergies] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(servicesList[0]?.id || '');
  const [manualServiceName, setManualServiceName] = useState<string>(servicesList[0]?.name || '');
  const [manualPrice, setManualPrice] = useState<string>(servicesList[0]?.price.toString() || '1500');
  const [selectedStaffId, setSelectedStaffId] = useState<string>(staffList[0]?.id || '');
  const [bookingDate, setBookingDate] = useState<string>('Today');
  const [bookingTime, setBookingTime] = useState<string>('02:00 PM');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      if (initialCustomerId) {
        setSelectedCustomerId(initialCustomerId);
      } else if (customers.length > 0 && selectedCustomerId !== 'new') {
        const found = customers.find(c => c.id === selectedCustomerId);
        if (!found) {
          setSelectedCustomerId(customers[0]?.id || 'new');
        }
      }
    }
  }, [isOpen, initialCustomerId, customers]);

  if (!isOpen) return null;

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);
  const selectedService = servicesList.find((s) => s.id === selectedServiceId) || servicesList[0];
  const selectedStaff = staffList.find((s) => s.id === selectedStaffId) || staffList[0] || {
    id: 'unassigned',
    name: 'Salon Stylist',
    role: 'Stylist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'active' as const,
    rating: 5.0,
    phone: '',
    commissionRate: 0,
    servicesToday: 0,
    totalRevenueToday: 0,
  };

  const timeSlots = [
    '10:00 AM',
    '11:00 AM',
    '11:30 AM',
    '12:15 PM',
    '01:00 PM',
    '02:00 PM',
    '03:15 PM',
    '04:30 PM',
    '05:45 PM',
    '06:30 PM',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isNew = selectedCustomerId === 'new';
    const clientName = isNew ? customCustomerName.trim() : (selectedCustomer?.name || 'Walk-in Guest');
    const clientPhone = isNew ? customCustomerPhone.trim() : (selectedCustomer?.phone || '+91 99999 00000');
    const clientAvatar = isNew 
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      : (selectedCustomer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');

    onBookAppointment({
      staffId: selectedStaff.id,
      staffName: selectedStaff.name,
      staffAvatar: selectedStaff.avatar,
      customerId: selectedCustomerId,
      customerName: clientName,
      customerPhone: clientPhone,
      customerAvatar: clientAvatar,
      service: manualServiceName.trim() || selectedService.name,
      price: Math.max(0, parseFloat(manualPrice) || selectedService.price),
      time: bookingTime,
      date: bookingDate,
      status: 'Scheduled',
      paymentStatus: 'Unpaid',
      notes: notes || undefined
    }, isNew ? {
      email: customCustomerEmail.trim() || undefined,
      hairType: customCustomerHairType.trim() || undefined,
      allergies: customCustomerAllergies.trim() || undefined,
    } : undefined);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Book Appointment</h3>
              <p className="text-xs text-slate-500">Schedule client chair time & stylist assignment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Customer Selection */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">Select Client</label>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Auto-saves to Customer Module</span>
              </span>
            </div>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-purple-500/20"
            >
              <optgroup label="Existing Clients">
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone}) — {c.hairType ? c.hairType.split(',')[0] : 'Client'}
                  </option>
                ))}
              </optgroup>
              <option value="new">+ Enter New Client (Auto-save to Customer Module)</option>
            </select>
          </div>

          {selectedCustomerId === 'new' ? (
            <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200/90 space-y-3">
              <div className="flex items-start gap-2 text-emerald-900">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold">New Client Auto-Registration</p>
                  <p className="text-[11px] text-emerald-700 leading-tight">
                    Booking this appointment will automatically add this client to your Customer Module, Hair Records, and WhatsApp Marketing list.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jessica Taylor"
                    value={customCustomerName}
                    onChange={(e) => setCustomCustomerName(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98000 00000"
                    value={customCustomerPhone}
                    onChange={(e) => setCustomCustomerPhone(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="client@example.com"
                    value={customCustomerEmail}
                    onChange={(e) => setCustomCustomerEmail(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Hair Type / Concerns</label>
                  <select
                    value={customCustomerHairType}
                    onChange={(e) => setCustomCustomerHairType(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="Normal, Medium Texture">Normal, Medium Texture</option>
                    <option value="Fine, Straight (Low Volume)">Fine, Straight (Low Volume)</option>
                    <option value="Thick & Wavy (Frizz Prone)">Thick & Wavy (Frizz Prone)</option>
                    <option value="Curly (3B/3C Texture)">Curly (3B/3C Texture)</option>
                    <option value="Bleached / High Porosity">Bleached / High Porosity</option>
                    <option value="Color-Treated / Balayage">Color-Treated / Balayage</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            selectedCustomer && (
              <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <img
                    src={selectedCustomer.avatar}
                    alt={selectedCustomer.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-purple-500/30"
                  />
                  <div>
                    <p className="font-bold text-slate-800">{selectedCustomer.name}</p>
                    <p className="text-[11px] text-slate-500">{selectedCustomer.phone} • {selectedCustomer.totalVisits} previous visits</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  Profile in Sync
                </span>
              </div>
            )
          )}

          {/* Service Selection & Manual Name/Amount Customization */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Service Template / Catalog</label>
              <select
                value={selectedServiceId}
                onChange={(e) => {
                  const srvId = e.target.value;
                  setSelectedServiceId(srvId);
                  const matched = servicesList.find((s) => s.id === srvId);
                  if (matched) {
                    setManualServiceName(matched.name);
                    setManualPrice(matched.price.toString());
                  }
                }}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
              >
                {servicesList.map((srv) => (
                  <option key={srv.id} value={srv.id}>
                    {srv.name} (₹{srv.price} • {srv.durationMinutes}m)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Service Name</span>
                  <span className="text-[10px] text-purple-600 font-semibold">Manual override allowed</span>
                </label>
                <input
                  type="text"
                  value={manualServiceName}
                  onChange={(e) => setManualServiceName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  placeholder="Service Name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Service Amount (₹)</span>
                  <span className="text-[10px] text-purple-600 font-semibold">Manual override allowed</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={manualPrice}
                    onChange={(e) => setManualPrice(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    placeholder="Service Amount"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Assign Stylist</label>
            <select
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
            >
              {staffList.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} — {st.role} (⭐ {st.rating})
                </option>
              ))}
            </select>
          </div>

          {/* Time Slot Picker */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">Select Time Slot</label>
              <span className="text-[11px] text-purple-600 font-medium">Est. {selectedService.durationMinutes} mins</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setBookingTime(slot)}
                  className={`py-1.5 text-center text-xs rounded-lg font-medium transition-all ${
                    bookingTime === slot
                      ? 'bg-purple-600 text-white shadow-xs font-bold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Hair Formula or Preference Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Special Hair Instructions / Notes</label>
            <input
              type="text"
              placeholder="e.g. Redken 09V toner requested, allergic to latex gloves..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          {/* Summary Card */}
          <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl flex items-center justify-between">
            <div className="text-xs">
              <p className="font-bold text-purple-900">{manualServiceName.trim() || selectedService.name}</p>
              <p className="text-slate-500 text-[11px]">
                For <span className="font-semibold text-slate-800">{selectedCustomerId === 'new' ? (customCustomerName.trim() || 'New Client') : (selectedCustomer?.name || 'Client')}</span> • With {selectedStaff.name} • {bookingDate} at {bookingTime}
              </p>
            </div>
            <div className="text-right">
              <span className="text-lg font-extrabold text-purple-700">
                ₹{(Math.max(0, parseFloat(manualPrice) || selectedService.price)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Submit */}
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
              <span>Confirm Appointment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
