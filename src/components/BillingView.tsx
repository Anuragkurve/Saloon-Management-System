import React, { useState } from 'react';
import { Receipt, Search, Printer, CheckCircle2, Download, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { Invoice } from '../types';

interface BillingViewProps {
  invoices: Invoice[];
  onOpenQuickBilling: () => void;
}

export const BillingView: React.FC<BillingViewProps> = ({ invoices, onOpenQuickBilling }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.staffName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = invoices.reduce((acc, curr) => acc + curr.total, 0);

  const getMethodIcon = (method: Invoice['paymentMethod']) => {
    switch (method) {
      case 'Credit Card':
      case 'Debit Card':
        return <CreditCard className="w-3.5 h-3.5 text-blue-500" />;
      case 'Cash':
        return <Banknote className="w-3.5 h-3.5 text-emerald-500" />;
      case 'UPI / GPay':
        return <Smartphone className="w-3.5 h-3.5 text-purple-500" />;
      default:
        return <Receipt className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div id="billing-view-container" className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Billing & Invoices Ledger</h2>
          <p className="text-xs text-slate-500">View issued invoices, customer receipts, and terminal settlements</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800">
            Total Billed: ₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <button
            onClick={onOpenQuickBilling}
            className="px-4 py-2 bg-[#141824] hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm"
          >
            + Create New Bill
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
        {/* Search */}
        <div className="relative mb-4 max-w-sm">
          <input
            type="text"
            placeholder="Search invoice number, client or stylist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        {/* Invoices Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-semibold text-[11px]">
                <th className="py-3 px-3">Invoice #</th>
                <th className="py-3 px-3">Client</th>
                <th className="py-3 px-3">Stylist</th>
                <th className="py-3 px-3">Services</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-3 text-right">Total</th>
                <th className="py-3 px-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono font-semibold text-purple-700">{inv.invoiceNumber}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900">{inv.customerName}</td>
                  <td className="py-3 px-3 text-slate-600">{inv.staffName}</td>
                  <td className="py-3 px-3 text-slate-600">
                    {inv.services.map((s) => s.name).join(', ')}
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                      {getMethodIcon(inv.paymentMethod)}
                      {inv.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                    {inv.date} • {inv.time}
                  </td>
                  <td className="py-3 px-3 text-right font-extrabold text-slate-900">
                    ₹{inv.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                    >
                      <Printer className="w-3 h-3" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Receipt Preview Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Receipt Preview</h3>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="my-4 p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-xs font-mono space-y-1.5">
              <div className="text-center font-bold text-slate-900 text-sm">HOUSE OF HAIRS SALOON</div>
              <p className="text-[10px] text-center text-slate-500">Luxury Hair Care • GST Registered</p>
              <div className="border-b border-slate-200 my-2"></div>
              <div className="flex justify-between">
                <span>Receipt:</span>
                <span>{selectedInvoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Client:</span>
                <span>{selectedInvoice.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Stylist:</span>
                <span>{selectedInvoice.staffName}</span>
              </div>
              <div className="flex justify-between">
                <span>Method:</span>
                <span>{selectedInvoice.paymentMethod}</span>
              </div>
              <div className="border-b border-slate-200 my-2"></div>
              {selectedInvoice.services.map((s, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{s.name}</span>
                  <span>₹{s.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              ))}
              {selectedInvoice.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-₹{selectedInvoice.discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="border-b border-slate-200 my-2"></div>
              <div className="flex justify-between font-bold text-slate-900 text-sm">
                <span>TOTAL PAID</span>
                <span>₹{selectedInvoice.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
