import React, { useState } from 'react';
import { X, Check, Printer, CreditCard, Banknote, Smartphone, Receipt, Sparkles } from 'lucide-react';
import { Invoice } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingInvoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'date' | 'time' | 'status'> | null;
  onCompletePayment: (finalInvoice: Invoice) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  pendingInvoice,
  onCompletePayment,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<Invoice['paymentMethod']>('Credit Card');
  const [isSuccess, setIsSuccess] = useState(false);
  const [completedInvoice, setCompletedInvoice] = useState<Invoice | null>(null);

  if (!isOpen || !pendingInvoice) return null;

  const paymentMethods: { id: Invoice['paymentMethod']; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'Credit Card', label: 'Credit Card', icon: CreditCard },
    { id: 'Debit Card', label: 'Debit Card', icon: CreditCard },
    { id: 'Cash', label: 'Cash Register', icon: Banknote },
    { id: 'UPI / GPay', label: 'UPI / QR / GPay', icon: Smartphone },
  ];

  const handlePay = () => {
    const newInvoice: Invoice = {
      ...pendingInvoice,
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      paymentMethod: selectedMethod,
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Completed',
    };

    setCompletedInvoice(newInvoice);
    setIsSuccess(true);
    onCompletePayment(newInvoice);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDone = () => {
    setIsSuccess(false);
    setCompletedInvoice(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {!isSuccess ? (
          <div>
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Complete Payment</h3>
                  <p className="text-xs text-slate-500">House of Hairs Saloon Billing</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Bill Details */}
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <span>Client: <strong className="text-slate-800">{pendingInvoice.customerName}</strong></span>
                  <span>Stylist: <strong className="text-slate-800">{pendingInvoice.staffName}</strong></span>
                </div>

                <div className="divide-y divide-slate-200/60 my-2">
                  {pendingInvoice.services.map((srv, idx) => (
                    <div key={idx} className="py-1.5 flex justify-between text-xs text-slate-800">
                      <span>{srv.name}</span>
                      <span className="font-semibold">₹{srv.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium text-slate-800">₹{pendingInvoice.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>

                {pendingInvoice.discount > 0 && (
                  <div className="flex justify-between items-center text-xs text-emerald-600 font-medium mt-1">
                    <span>Discount Applied</span>
                    <span>-₹{pendingInvoice.discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}

                <div className="pt-2 mt-2 border-t border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-slate-800 text-sm">Total Due</span>
                  <span className="font-extrabold text-slate-900 text-xl text-purple-700">
                    ₹{pendingInvoice.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Select Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setSelectedMethod(method.id)}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                          selectedMethod === method.id
                            ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold shadow-xs ring-1 ring-purple-600/30'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${selectedMethod === method.id ? 'text-purple-600' : 'text-slate-400'}`} />
                        <span className="text-xs">{method.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Confirm Pay Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handlePay}
                  className="w-full py-3 bg-[#141824] hover:bg-slate-800 active:scale-[0.99] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Confirm & Charge ₹{pendingInvoice.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Receipt View */
          <div className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-3">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Payment Successful!</h3>
            <p className="text-xs text-slate-500 mb-4">Invoice {completedInvoice?.invoiceNumber} generated.</p>

            {/* Receipt Box */}
            <div className="bg-slate-50 border border-dashed border-slate-300 p-4 rounded-xl text-left text-xs font-mono space-y-1.5 mb-5">
              <div className="text-center font-bold text-slate-800 text-sm mb-1">
                HOUSE OF HAIRS SALOON
              </div>
              <p className="text-[11px] text-center text-slate-500">Luxury Hair & Beauty Care</p>
              <div className="border-b border-slate-200 my-2"></div>
              <div className="flex justify-between">
                <span>Inv:</span>
                <span>{completedInvoice?.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Client:</span>
                <span>{completedInvoice?.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Stylist:</span>
                <span>{completedInvoice?.staffName}</span>
              </div>
              <div className="flex justify-between">
                <span>Method:</span>
                <span>{completedInvoice?.paymentMethod}</span>
              </div>
              <div className="border-b border-slate-200 my-2"></div>
              {completedInvoice?.services.map((s, i) => (
                <div key={i} className="flex justify-between">
                  <span>{s.name}</span>
                  <span>₹{s.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              ))}
              <div className="border-b border-slate-200 my-2"></div>
              <div className="flex justify-between font-bold text-slate-900 text-sm">
                <span>TOTAL PAID</span>
                <span>₹{completedInvoice?.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
              <button
                type="button"
                onClick={handleDone}
                className="flex-1 py-2.5 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
