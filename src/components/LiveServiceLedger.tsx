import React, { useState } from 'react';
import { Clock, CheckCircle, Play, MoreVertical, Plus, Check, Trash2 } from 'lucide-react';
import { AppointmentLedgerItem } from '../types';

interface LiveServiceLedgerProps {
  ledgerItems: AppointmentLedgerItem[];
  onUpdateStatus: (id: string, newStatus: AppointmentLedgerItem['status']) => void;
  onOpenBookingModal: () => void;
  onDeleteAppointment?: (id: string) => void;
}

export const LiveServiceLedger: React.FC<LiveServiceLedgerProps> = ({
  ledgerItems,
  onUpdateStatus,
  onOpenBookingModal,
  onDeleteAppointment,
}) => {
  const [filter, setFilter] = useState<'All' | 'In Progress' | 'Scheduled' | 'Completed'>('All');

  const filteredItems = ledgerItems.filter((item) => {
    if (filter === 'All') return true;
    return item.status === filter;
  });

  const getStatusBadge = (status: AppointmentLedgerItem['status']) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Check className="w-3 h-3 text-emerald-600" />
            Completed
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            In Progress
          </span>
        );
      case 'Scheduled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Clock className="w-3 h-3 text-purple-600" />
            Scheduled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
            {status}
          </span>
        );
    }
  };

  return (
    <div id="live-service-ledger-card" className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header and Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <span>Live Staff Service Ledger</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </h3>
            <p className="text-[11px] text-slate-500">Active salon floor tracker</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
              {(['All', 'In Progress', 'Scheduled', 'Completed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    filter === f
                      ? 'bg-white text-slate-800 font-bold shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <button
              onClick={onOpenBookingModal}
              title="Add Service to Ledger"
              className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-semibold text-[11px]">
                <th className="py-2.5 pr-3">Staff Name</th>
                <th className="py-2.5 px-3">Service</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 pl-3 text-right">Price</th>
                <th className="py-2.5 pl-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-400">
                    No services found for this filter.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                    {/* Staff */}
                    <td className="py-3 pr-3 font-medium text-slate-800">
                      <div className="flex items-center gap-2">
                        <img
                          src={item.staffAvatar}
                          alt={item.staffName}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <span className="font-semibold whitespace-nowrap">{item.staffName}</span>
                      </div>
                    </td>

                    {/* Service */}
                    <td className="py-3 px-3 text-slate-700 font-medium whitespace-nowrap">
                      {item.service}
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-3 text-slate-800 font-medium whitespace-nowrap">
                      <div>
                        <span>{item.customerName}</span>
                        {item.notes && (
                          <span className="block text-[10px] text-slate-400 truncate max-w-[120px]">
                            {item.notes}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Time */}
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                      {item.time}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>

                    {/* Price */}
                    <td className="py-3 pl-3 text-right font-bold text-slate-900 whitespace-nowrap">
                      ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    {/* Actions */}
                    <td className="py-3 pl-2 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        {item.status === 'Scheduled' && (
                          <button
                            onClick={() => onUpdateStatus(item.id, 'In Progress')}
                            className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded text-[10px] font-semibold transition-colors"
                          >
                            Start
                          </button>
                        )}
                        {item.status === 'In Progress' && (
                          <button
                            onClick={() => onUpdateStatus(item.id, 'Completed')}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded text-[10px] font-semibold transition-colors"
                          >
                            Done
                          </button>
                        )}
                        {item.status === 'Completed' && (
                          <span className="text-[10px] font-medium text-slate-400">
                            {item.paymentStatus === 'Paid' ? 'Paid' : 'Unbilled'}
                          </span>
                        )}
                        {onDeleteAppointment && (
                          <button
                            onClick={() => onDeleteAppointment(item.id)}
                            className="p-1 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            title="Delete Appointment"
                            aria-label={`Delete ${item.service} for ${item.customerName}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Showing {filteredItems.length} active service chairs</span>
        <button
          onClick={onOpenBookingModal}
          className="text-purple-600 font-semibold hover:underline"
        >
          + Add walk-in / book
        </button>
      </div>
    </div>
  );
};
