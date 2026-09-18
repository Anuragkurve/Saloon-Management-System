import React, { useState } from 'react';
import { Search, Send, CheckCheck, Sparkles, MessageCircle, Copy, Check, ExternalLink } from 'lucide-react';
import { Customer, MarketingCampaign } from '../types';

interface CustomerMarketingWidgetProps {
  customers: Customer[];
  campaigns: MarketingCampaign[];
  onSelectCustomerForDetail: (customer: Customer) => void;
  onSendWhatsApp: (customerId: string, message: string) => void;
  onBroadcastCampaign: (campaignId: string) => void;
}

export const CustomerMarketingWidget: React.FC<CustomerMarketingWidgetProps> = ({
  customers,
  campaigns,
  onSelectCustomerForDetail,
  onSendWhatsApp,
  onBroadcastCampaign
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(campaigns[0]?.id || 'camp-1');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || 'cust-1');
  const [copied, setCopied] = useState(false);
  const [broadcastDone, setBroadcastDone] = useState(false);

  const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];
  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  // Personalized message
  const personalizedMessage = selectedCampaign
    ? selectedCampaign.messageTemplate.replace('{CustomerName}', selectedCustomer ? selectedCustomer.name : 'Valued Guest')
    : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(personalizedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDirectWhatsAppWeb = (customer: Customer) => {
    const cleanPhone = customer.phone.replace(/[^0-9]/g, '');
    const msg = selectedCampaign
      ? selectedCampaign.messageTemplate.replace('{CustomerName}', customer.name)
      : `Hello ${customer.name}, greetings from House of Hairs Saloon!`;
    const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    onSendWhatsApp(customer.id, msg);
  };

  const handleBroadcast = () => {
    onBroadcastCampaign(selectedCampaignId);
    setBroadcastDone(true);
    setTimeout(() => setBroadcastDone(false), 3000);
  };

  const getStatusBadge = (status: Customer['status']) => {
    switch (status) {
      case 'Sent':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Sent</span>;
      case 'Failed':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">Failed</span>;
      case 'Delivered':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">Delivered</span>;
      case 'Select':
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">Select</span>;
    }
  };

  return (
    <div id="customer-marketing-widget" className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <span>Customer Database & WhatsApp Marketing</span>
            </h3>
            <p className="text-[11px] text-slate-500">Targeted promos & automated salon outreach</p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            WhatsApp Cloud Connected
          </span>
        </div>

        {/* Split Container */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Customer Database (cols 12 on mobile, 6 or 7 on desktop) */}
          <div className="lg:col-span-6 flex flex-col">
            {/* Search Input */}
            <div className="relative mb-2">
              <input
                id="marketing-customer-search"
                type="text"
                placeholder="Search customer or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-purple-500/30 text-slate-800"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            {/* Customer List table-like view */}
            <div className="overflow-y-auto max-h-56 divide-y divide-slate-100 border border-slate-100 rounded-lg bg-slate-50/40">
              {filteredCustomers.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">No matching clients found</div>
              ) : (
                filteredCustomers.map((cust) => (
                  <div
                    key={cust.id}
                    onClick={() => setSelectedCustomerId(cust.id)}
                    className={`p-2.5 flex items-center justify-between hover:bg-slate-100/80 cursor-pointer transition-colors ${
                      selectedCustomerId === cust.id ? 'bg-purple-50/70 border-l-2 border-purple-600' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={cust.avatar}
                        alt={cust.name}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                      />
                      <div className="truncate">
                        <p className="text-xs font-semibold text-slate-800 truncate">{cust.name}</p>
                        <p className="text-[10px] text-slate-500">{cust.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {getStatusBadge(cust.status)}
                      <button
                        title="Open WhatsApp chat"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDirectWhatsAppWeb(cust);
                        }}
                        className="w-7 h-7 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-transform hover:scale-105 shadow-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Campaign & Message Preview */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Campaign Picker */}
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">Marketing Campaign</label>
                <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200">
                  Active
                </span>
              </div>

              <select
                id="marketing-campaign-select"
                value={selectedCampaignId}
                onChange={(e) => setSelectedCampaignId(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-purple-500/30 font-medium text-slate-800 mb-3"
              >
                {campaigns.map((camp) => (
                  <option key={camp.id} value={camp.id}>
                    {camp.name} ({camp.discountBadge})
                  </option>
                ))}
              </select>

              {/* Message preview */}
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">Message preview</label>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-[11px] font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed font-mono whitespace-pre-wrap min-h-[96px]">
                {personalizedMessage}
              </div>
            </div>

            {/* Big Send Offers Button */}
            <div className="mt-4">
              <button
                id="btn-send-whatsapp-offers"
                onClick={handleBroadcast}
                className="w-full py-2.5 px-4 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                {broadcastDone ? (
                  <>
                    <CheckCheck className="w-4 h-4 text-white" />
                    <span>Offers Broadcasted to {customers.length} Clients!</span>
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Send Offers via WhatsApp Business API</span>
                  </>
                )}
              </button>
              <p className="text-[10px] text-center text-slate-400 mt-1.5">
                Official WhatsApp Cloud API integration for House of Hairs Saloon
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
