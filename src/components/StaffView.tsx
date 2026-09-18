import React, { useState } from 'react';
import {
  UserCheck,
  Star,
  Clock,
  Phone,
  UserPlus,
  Search,
  Trash2,
  AlertTriangle,
  X,
  Mail,
  MapPin,
  Languages,
  FileText,
  User,
  Scissors,
} from 'lucide-react';
import { Staff, Receptionist } from '../types';
import { AddStaffModal } from './AddStaffModal';
import { AddReceptionistModal } from './AddReceptionistModal';

interface StaffViewProps {
  staffList: Staff[];
  onUpdateStaffStatus: (staffId: string, status: Staff['status']) => void;
  onAddStaff: (staff: Staff) => void;
  onDeleteStaff?: (staffId: string) => void;
  receptionists?: Receptionist[];
  onAddReceptionist?: (receptionist: Receptionist) => void;
  onDeleteReceptionist?: (receptionistId: string) => void;
  onUpdateReceptionistStatus?: (receptionistId: string, status: Receptionist['status']) => void;
  initialCategory?: 'stylists' | 'receptionists';
}

export const StaffView: React.FC<StaffViewProps> = ({
  staffList,
  onUpdateStaffStatus,
  onAddStaff,
  onDeleteStaff,
  receptionists = [],
  onAddReceptionist,
  onDeleteReceptionist,
  onUpdateReceptionistStatus,
  initialCategory = 'stylists',
}) => {
  const [activeCategory, setActiveCategory] = useState<'stylists' | 'receptionists'>(initialCategory);

  // Stylists state
  const [filterRole, setFilterRole] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);

  // Receptionists state
  const [receptionistSearchQuery, setReceptionistSearchQuery] = useState('');
  const [filterShift, setFilterShift] = useState('All');
  const [isAddReceptionistModalOpen, setIsAddReceptionistModalOpen] = useState(false);
  const [receptionistToDelete, setReceptionistToDelete] = useState<Receptionist | null>(null);

  // Stylists filtering
  const filteredStaff = staffList.filter((s) => {
    const matchesRole = filterRole === 'All' || s.role.toLowerCase().includes(filterRole.toLowerCase());
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery);
    return matchesRole && matchesSearch;
  });

  // Receptionists filtering
  const filteredReceptionists = receptionists.filter((r) => {
    const matchesShift =
      filterShift === 'All' || r.shift.toLowerCase().includes(filterShift.toLowerCase());
    const q = receptionistSearchQuery.toLowerCase();
    const matchesSearch =
      r.name.toLowerCase().includes(q) ||
      r.phone.includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.deskNumber.toLowerCase().includes(q) ||
      (r.notes && r.notes.toLowerCase().includes(q));
    return matchesShift && matchesSearch;
  });

  const getStaffStatusColor = (status: Staff['status']) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'busy':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'on_break':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'off':
        return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  const getReceptionistStatusColor = (status: Receptionist['status']) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'on_break':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'off':
        return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  return (
    <div id="staff-view-container" className="space-y-6">
      {/* Category Navigation: Stylists vs Receptionists */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            id="tab-btn-stylists"
            onClick={() => setActiveCategory('stylists')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'stylists'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Stylists & Specialists</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeCategory === 'stylists' ? 'bg-purple-700/80 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {staffList.length}
            </span>
          </button>

          <button
            id="tab-btn-receptionists"
            onClick={() => setActiveCategory('receptionists')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'receptionists'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Receptionists & Front Desk</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeCategory === 'receptionists'
                  ? 'bg-purple-700/80 text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {receptionists.length}
            </span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 pr-2 text-[11px] text-slate-500 font-medium">
          <span>Salon Roster Management</span>
        </div>
      </div>

      {/* ==================== RECEPTIONISTS SECTION ==================== */}
      {activeCategory === 'receptionists' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Header with Add Receptionist button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Front Desk & Receptionists</span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
                  {receptionists.length} Registered
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Manage front desk staff, check-in desks, shift schedules, and contact details
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-2 rounded-xl">
                On Duty:{' '}
                <strong className="text-emerald-600">
                  {receptionists.filter((r) => r.status === 'active').length}
                </strong>{' '}
                • Total: {receptionists.length}
              </span>
              <button
                id="add-receptionist-btn"
                onClick={() => setIsAddReceptionistModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Receptionist</span>
              </button>
            </div>
          </div>

          {/* Filter & Search Bar for Receptionists */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['All', 'Morning', 'Evening', 'Full Day'].map((sh) => (
                <button
                  key={sh}
                  onClick={() => setFilterShift(sh)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                    filterShift === sh
                      ? 'bg-purple-600 text-white shadow-2xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {sh === 'All' ? 'All Shifts' : `${sh} Shift`}
                </button>
              ))}
            </div>

            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="search-receptionists-input"
                type="text"
                value={receptionistSearchQuery}
                onChange={(e) => setReceptionistSearchQuery(e.target.value)}
                placeholder="Search by name, desk, or phone..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Receptionists Grid */}
          {filteredReceptionists.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
                <User className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">No Receptionists Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                {receptionistSearchQuery || filterShift !== 'All'
                  ? 'No front desk staff match the current search or shift filter.'
                  : 'Add your salon receptionist to manage customer check-ins, telephone calls, and front desk service.'}
              </p>
              <button
                onClick={() => setIsAddReceptionistModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Receptionist</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredReceptionists.map((rec) => (
                <div
                  key={rec.id}
                  id={`receptionist-card-${rec.id}`}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Avatar, Name, Desk, Status & Delete button */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={rec.avatar}
                            alt={rec.name}
                            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-100 shadow-2xs"
                          />
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-white ${
                              rec.status === 'active'
                                ? 'bg-emerald-500'
                                : rec.status === 'on_break'
                                ? 'bg-amber-500'
                                : 'bg-slate-400'
                            }`}
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm leading-tight">{rec.name}</h3>
                          <div className="flex items-center gap-1 text-[11px] text-purple-700 font-semibold mt-0.5">
                            <MapPin className="w-3 h-3 text-purple-500 shrink-0" />
                            <span className="truncate max-w-[170px]">{rec.deskNumber}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize whitespace-nowrap ${getReceptionistStatusColor(
                            rec.status
                          )}`}
                        >
                          {rec.status === 'active' ? 'On Duty' : rec.status.replace('_', ' ')}
                        </span>

                        {onDeleteReceptionist && (
                          <button
                            id={`delete-receptionist-btn-${rec.id}`}
                            title={`Delete receptionist ${rec.name}`}
                            aria-label={`Delete receptionist ${rec.name}`}
                            onClick={() => setReceptionistToDelete(rec)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Shift Information Pill */}
                    <div className="mt-3.5 p-2.5 rounded-xl bg-purple-50/40 border border-purple-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-purple-600" />
                        <span>Shift Hours</span>
                      </span>
                      <span className="text-xs font-bold text-purple-900 bg-white px-2 py-0.5 rounded-lg border border-purple-200/60 shadow-2xs">
                        {rec.shift}
                      </span>
                    </div>

                    {/* Contact Details: Phone & Email */}
                    <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <a
                          href={`tel:${rec.phone}`}
                          className="hover:text-purple-600 hover:underline transition-colors font-medium truncate"
                        >
                          {rec.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <a
                          href={`mailto:${rec.email}`}
                          className="hover:text-purple-600 hover:underline transition-colors truncate text-[11px]"
                        >
                          {rec.email}
                        </a>
                      </div>
                    </div>

                    {/* Languages Spoken */}
                    {rec.languages && rec.languages.length > 0 && (
                      <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                        <Languages className="w-3 h-3 text-slate-400 shrink-0" />
                        {rec.languages.map((lang, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Notes / Responsibilities */}
                    {rec.notes && (
                      <div className="mt-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 italic flex items-start gap-1.5">
                        <FileText className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                        <p className="line-clamp-2">{rec.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Quick Shift Status Toggle */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 font-medium">Shift Status:</span>
                    <div className="flex items-center gap-1">
                      {(['active', 'on_break', 'off'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => {
                            if (onUpdateReceptionistStatus) {
                              onUpdateReceptionistStatus(rec.id, st);
                            }
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize transition-colors ${
                            rec.status === st
                              ? 'bg-purple-600 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {st === 'active' ? 'On Duty' : st.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== STYLISTS SECTION ==================== */}
      {activeCategory === 'stylists' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Header with Add Staff button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Hair Stylists & Specialists</span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
                  {staffList.length} Active
                </span>
              </h2>
              <p className="text-xs text-slate-500">Monitor active station chairs, daily bookings, and commission payouts</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-2 rounded-xl">
                Active Chairs: {staffList.filter((s) => s.status === 'active' || s.status === 'busy').length} • Total: {staffList.length}
              </span>
              <button
                id="add-staff-btn"
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Stylist</span>
              </button>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['All', 'Stylist', 'Color', 'Grooming', 'Spa', 'Nail'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterRole(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                    filterRole === tab
                      ? 'bg-purple-600 text-white shadow-2xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab === 'All' ? 'All Roles' : tab}
                </button>
              ))}
            </div>

            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stylist by name or phone..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Staff Cards Grid */}
          {filteredStaff.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">No Stylists Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                {searchQuery || filterRole !== 'All'
                  ? 'No staff members match the selected filter or search query.'
                  : 'Add your first salon stylist or staff member to begin tracking chairs and commissions.'}
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Stylist</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredStaff.map((staff) => (
                <div
                  key={staff.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={staff.avatar}
                          alt={staff.name}
                          className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100"
                        />
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">{staff.name}</h3>
                          <p className="text-[11px] text-purple-700 font-medium">{staff.role}</p>
                          <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mt-0.5">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{staff.rating}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${getStaffStatusColor(
                            staff.status
                          )}`}
                        >
                          {staff.status.replace('_', ' ')}
                        </span>
                        {onDeleteStaff && (
                          <button
                            title="Delete staff member"
                            aria-label={`Delete ${staff.name}`}
                            onClick={() => setStaffToDelete(staff)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Stats today */}
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
                      <div className="p-2 rounded-lg bg-slate-50">
                        <span className="text-[10px] text-slate-400 block font-medium">Clients Today</span>
                        <span className="text-xs font-bold text-slate-800">{staff.servicesToday}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50">
                        <span className="text-[10px] text-slate-400 block font-medium">Revenue</span>
                        <span className="text-xs font-bold text-slate-800">
                          ₹{staff.totalRevenueToday.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-purple-50">
                        <span className="text-[10px] text-purple-600 block font-medium">Comm ({staff.commissionRate}%)</span>
                        <span className="text-xs font-bold text-purple-800">
                          ₹
                          {((staff.totalRevenueToday * staff.commissionRate) / 100).toLocaleString('en-IN', {
                            maximumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{staff.phone}</span>
                    </div>
                  </div>

                  {/* Quick Status Toggle */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 font-medium">Shift Status:</span>
                    <div className="flex items-center gap-1">
                      {(['active', 'busy', 'on_break', 'off'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => onUpdateStaffStatus(staff.id, st)}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize transition-colors ${
                            staff.status === st
                              ? 'bg-purple-600 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {st.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Staff Modal */}
      <AddStaffModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddStaff={onAddStaff}
      />

      {/* Add Receptionist Modal */}
      <AddReceptionistModal
        isOpen={isAddReceptionistModalOpen}
        onClose={() => setIsAddReceptionistModalOpen(false)}
        onAddReceptionist={(rec) => {
          if (onAddReceptionist) {
            onAddReceptionist(rec);
          }
        }}
      />

      {/* Delete Staff Confirmation Modal */}
      {staffToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5 text-rose-600">
                <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Delete Staff Member</h3>
              </div>
              <button
                onClick={() => setStaffToDelete(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to remove this staff member from your salon roster?
              </p>

              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs space-y-2">
                <div className="flex items-center gap-3">
                  <img
                    src={staffToDelete.avatar}
                    alt={staffToDelete.name}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900">{staffToDelete.name}</h4>
                    <p className="text-[11px] text-purple-700 font-semibold">{staffToDelete.role}</p>
                    <p className="text-[11px] text-slate-500">{staffToDelete.phone}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div className="bg-white p-1.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Rating</span>
                    <span className="font-bold text-amber-600 flex items-center justify-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-amber-400" />
                      {staffToDelete.rating}
                    </span>
                  </div>
                  <div className="bg-white p-1.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Clients Today</span>
                    <span className="font-bold text-slate-800">{staffToDelete.servicesToday}</span>
                  </div>
                  <div className="bg-white p-1.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Commission</span>
                    <span className="font-bold text-purple-700">{staffToDelete.commissionRate}%</span>
                  </div>
                </div>

                {staffList.length <= 1 && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200/80">
                    ⚠️ Note: This is your only registered staff member. You can add new stylists whenever needed.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setStaffToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Keep Staff Member
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteStaff) {
                    onDeleteStaff(staffToDelete.id);
                  }
                  setStaffToDelete(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Staff Member</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Receptionist Confirmation Modal */}
      {receptionistToDelete && (
        <div
          id="delete-receptionist-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        >
          <div
            id="delete-receptionist-modal"
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5 text-rose-600">
                <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Delete Receptionist</h3>
              </div>
              <button
                id="close-delete-receptionist-modal-btn"
                onClick={() => setReceptionistToDelete(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to permanently delete this receptionist from the front desk roster?
              </p>

              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs space-y-2">
                <div className="flex items-center gap-3">
                  <img
                    src={receptionistToDelete.avatar}
                    alt={receptionistToDelete.name}
                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 shadow-2xs"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm">{receptionistToDelete.name}</h4>
                    <p className="text-[11px] text-purple-700 font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{receptionistToDelete.deskNumber}</span>
                    </p>
                    <p className="text-[11px] text-slate-500">{receptionistToDelete.phone}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-center text-[11px]">
                  <div className="bg-white p-2 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-medium">Shift Timing</span>
                    <span className="font-bold text-slate-800 text-[11px]">{receptionistToDelete.shift}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-medium">Duty Status</span>
                    <span className="font-bold text-emerald-600 capitalize text-[11px]">
                      {receptionistToDelete.status === 'active'
                        ? 'On Duty'
                        : receptionistToDelete.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {receptionists.length <= 1 && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200/80">
                    ⚠️ Note: This is your only receptionist. If deleted, you can add another receptionist anytime.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                id="cancel-delete-receptionist-btn"
                onClick={() => setReceptionistToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Keep Receptionist
              </button>
              <button
                type="button"
                id="confirm-delete-receptionist-btn"
                onClick={() => {
                  if (onDeleteReceptionist) {
                    onDeleteReceptionist(receptionistToDelete.id);
                  }
                  setReceptionistToDelete(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Receptionist</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
