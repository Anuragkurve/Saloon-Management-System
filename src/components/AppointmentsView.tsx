import React, { useState } from 'react';
import { Calendar, Clock, Plus, Check, Play, Search, Filter, Trash2, AlertTriangle, X, UserCheck, Scissors, CreditCard } from 'lucide-react';
import { AppointmentLedgerItem } from '../types';

interface AppointmentsViewProps {
  appointments: AppointmentLedgerItem[];
  onOpenBookingModal: () => void;
  onUpdateStatus: (id: string, newStatus: AppointmentLedgerItem['status']) => void;
  onDeleteAppointment: (id: string) => void;
  onBillAppointment?: (item: AppointmentLedgerItem) => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments,
  onOpenBookingModal,
  onUpdateStatus,
  onDeleteAppointment,
  onBillAppointment,
}) => {
  const [filterStatus, setFilterStatus] = useState<'All' | 'Scheduled' | 'Boarded' | 'In Progress' | 'Completed'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [appointmentToDelete, setAppointmentToDelete] = useState<AppointmentLedgerItem | null>(null);

  const filteredAppointments = appointments.filter((app) => {
    const matchesSearch =
      app.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.service.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filterStatus === 'All') return true;
    return app.status === filterStatus;
  });

  return (
    <div id="appointments-view-container" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Appointment Calendar & Roster</h2>
          <p className="text-xs text-slate-500">Manage client bookings, scheduled salon chairs, and service runtimes</p>
        </div>
        <button
          onClick={onOpenBookingModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ Book New Appointment</span>
        </button>
      </div>

      {/* Control Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="relative max-w-sm w-full">
            <input
              type="text"
              placeholder="Search by client, service, or stylist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
            {(['All', 'Scheduled', 'Boarded', 'In Progress', 'Completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  filterStatus === status ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Appointments List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-semibold text-[11px]">
                <th className="py-3 px-3">Time & Date</th>
                <th className="py-3 px-3">Client</th>
                <th className="py-3 px-3">Service</th>
                <th className="py-3 px-3">Assigned Stylist</th>
                <th className="py-3 px-3">Hair Notes</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Price</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                    No appointments found. Click "+ Book New Appointment" to schedule.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-purple-600" />
                        <span>{app.time}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({app.date})</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      <div className="flex items-center gap-2">
                        <img
                          src={app.customerAvatar}
                          alt={app.customerName}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <p>{app.customerName}</p>
                          <p className="text-[10px] text-slate-400">{app.customerPhone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">{app.service}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 font-medium text-slate-800">
                        <img
                          src={app.staffAvatar}
                          alt={app.staffName}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span>{app.staffName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-500 max-w-[150px] truncate">
                      {app.notes || '—'}
                    </td>
                    <td className="py-3 px-3">
                      {app.status === 'Completed' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Completed
                        </span>
                      )}
                      {app.status === 'In Progress' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse inline-flex items-center gap-1">
                          <Scissors className="w-3 h-3" />
                          In Chair
                        </span>
                      )}
                      {app.status === 'Boarded' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 inline-flex items-center gap-1">
                          <UserCheck className="w-3 h-3" />
                          Boarded
                        </span>
                      )}
                      {app.status === 'Scheduled' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Scheduled
                        </span>
                      )}
                      {app.status === 'Cancelled' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                          Cancelled
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-extrabold text-slate-900">
                      ₹{app.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        {app.status === 'Scheduled' && (
                          <button
                            onClick={() => onUpdateStatus(app.id, 'Boarded')}
                            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                            title="Mark client arrived at salon"
                          >
                            <UserCheck className="w-3 h-3" />
                            <span>Customer Boarded</span>
                          </button>
                        )}
                        {app.status === 'Boarded' && (
                          <button
                            onClick={() => onUpdateStatus(app.id, 'In Progress')}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-md font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                            title="Seat client in chair"
                          >
                            <Scissors className="w-3 h-3" />
                            <span>Seat In Chair</span>
                          </button>
                        )}
                        {app.status === 'In Progress' && (
                          <button
                            onClick={() => onUpdateStatus(app.id, 'Completed')}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-md font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                            title="Complete appointment"
                          >
                            <Check className="w-3 h-3" />
                            <span>Appointment Completed</span>
                          </button>
                        )}
                        {app.status === 'Completed' && (
                          <div className="inline-flex items-center gap-1">
                            {app.paymentStatus === 'Paid' ? (
                              <span className="text-[11px] text-emerald-600 font-bold px-1.5 py-0.5 bg-emerald-50 rounded">Paid</span>
                            ) : onBillAppointment ? (
                              <button
                                onClick={() => onBillAppointment(app)}
                                className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-md font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                                title="Process payment & bill"
                              >
                                <CreditCard className="w-3 h-3" />
                                <span>Bill Now</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400 font-semibold px-1">Done</span>
                            )}
                          </div>
                        )}

                        <button
                          onClick={() => setAppointmentToDelete(app)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Appointment"
                          aria-label={`Delete appointment for ${app.customerName}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Appointment Confirmation Modal */}
      {appointmentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5 text-rose-600">
                <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Delete Appointment</h3>
              </div>
              <button
                onClick={() => setAppointmentToDelete(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to cancel and delete this appointment? This action cannot be undone.
              </p>

              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs space-y-1">
                <p className="font-bold text-slate-900">{appointmentToDelete.customerName}</p>
                <p className="text-slate-600">Service: <span className="font-semibold text-slate-800">{appointmentToDelete.service}</span></p>
                <p className="text-slate-500 text-[11px]">
                  Scheduled with {appointmentToDelete.staffName} on {appointmentToDelete.date} at {appointmentToDelete.time}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setAppointmentToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Keep Appointment
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteAppointment(appointmentToDelete.id);
                  setAppointmentToDelete(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Appointment</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
