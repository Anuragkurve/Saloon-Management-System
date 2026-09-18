import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Sparkles, Download, CheckCircle2 } from 'lucide-react';
import { Invoice, Staff, ServiceItem } from '../types';

interface ReportsViewProps {
  invoices: Invoice[];
  staffList: Staff[];
  servicesList: ServiceItem[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ invoices, staffList, servicesList }) => {
  const totalRevenue = invoices.reduce((acc, curr) => acc + curr.total, 0);
  const totalDiscounts = invoices.reduce((acc, curr) => acc + curr.discount, 0);

  // Calculate revenue by payment method
  const methodTotals: Record<string, number> = {};
  invoices.forEach((inv) => {
    methodTotals[inv.paymentMethod] = (methodTotals[inv.paymentMethod] || 0) + inv.total;
  });

  const handleExportCSV = () => {
    const headers = ['InvoiceNumber', 'Customer', 'Staff', 'Services', 'Total', 'PaymentMethod', 'Date'];
    const rows = invoices.map((inv) => [
      inv.invoiceNumber,
      `"${inv.customerName}"`,
      `"${inv.staffName}"`,
      `"${inv.services.map((s) => s.name).join(', ')}"`,
      inv.total,
      inv.paymentMethod,
      inv.date,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'house_of_hairs_sales_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="reports-view-container" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Sales & Service Performance Analytics</h2>
          <p className="text-xs text-slate-500">Comprehensive salon financial ledger, commission payouts, and chair utilization</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV Ledger</span>
        </button>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold">Total Net Revenue Today</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <span className="text-[11px] text-emerald-600 font-medium">100% Collected at POS</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold">Promotional Discounts Given</span>
          <p className="text-2xl font-extrabold text-purple-700 mt-1">₹{totalDiscounts.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <span className="text-[11px] text-slate-400">Via WhatsApp campaign codes</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold">Average Ticket Size</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">
            ₹{invoices.length > 0 ? (totalRevenue / invoices.length).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">Premium Hair Services</span>
        </div>
      </div>

      {/* Stylist Commission & Performance Table */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <span>Stylist Performance & Commission Ledger</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-semibold text-[11px]">
                <th className="py-2.5 px-3">Stylist</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Rating</th>
                <th className="py-2.5 px-3 text-center">Services Completed</th>
                <th className="py-2.5 px-3 text-right">Gross Billed</th>
                <th className="py-2.5 px-3 text-right">Commission Rate</th>
                <th className="py-2.5 px-3 text-right font-bold text-slate-900">Stylist Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffList.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-3 font-semibold text-slate-900 flex items-center gap-2">
                    <img src={staff.avatar} alt={staff.name} className="w-7 h-7 rounded-full object-cover" />
                    <span>{staff.name}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{staff.role}</td>
                  <td className="py-3 px-3 font-bold text-amber-500">⭐ {staff.rating}</td>
                  <td className="py-3 px-3 text-center font-medium">{staff.servicesToday}</td>
                  <td className="py-3 px-3 text-right font-semibold text-slate-800">
                    ₹{staff.totalRevenueToday.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-500">{staff.commissionRate}%</td>
                  <td className="py-3 px-3 text-right font-bold text-purple-700">
                    ₹{((staff.totalRevenueToday * staff.commissionRate) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Method Breakdown */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Settlement by Payment Method</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(methodTotals).map(([method, amount]) => (
            <div key={method} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 font-semibold block">{method}</span>
              <span className="text-lg font-extrabold text-slate-900 mt-1 block">
                ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
