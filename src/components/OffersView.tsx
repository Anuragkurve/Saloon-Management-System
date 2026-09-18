import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, Plus, CheckCheck, Users, Copy, Check, MessageCircle } from 'lucide-react';
import { MarketingCampaign, Customer } from '../types';

interface OffersViewProps {
  campaigns: MarketingCampaign[];
  customers: Customer[];
  onBroadcast: (campaignId: string) => void;
  onAddCampaign: (newCampaign: MarketingCampaign) => void;
}

export const OffersView: React.FC<OffersViewProps> = ({
  campaigns,
  customers,
  onBroadcast,
  onAddCampaign,
}) => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(campaigns[0]?.id || '');
  const [copied, setCopied] = useState(false);
  const [broadcastDone, setBroadcastDone] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);

  const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];

  // New campaign form state
  const [newTitle, setNewTitle] = useState('');
  const [newDiscount, setNewDiscount] = useState('15% OFF');
  const [newAudience, setNewAudience] = useState('All Valued Clients');
  const [newTemplate, setNewTemplate] = useState(
    '✨ Hi {CustomerName}! Treat yourself to a salon glow-up with House of Hairs Saloon. Enjoy special savings this weekend. Reply BOOK to save your spot!'
  );

  const handleCopy = () => {
    if (!selectedCampaign) return;
    navigator.clipboard.writeText(selectedCampaign.messageTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTriggerBroadcast = () => {
    if (!selectedCampaign) return;
    onBroadcast(selectedCampaign.id);
    setBroadcastDone(true);
    setTimeout(() => setBroadcastDone(false), 3000);
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const created: MarketingCampaign = {
      id: `camp-${Date.now()}`,
      name: newTitle,
      discountBadge: newDiscount,
      targetAudience: newAudience,
      messageTemplate: newTemplate,
      isActive: true,
      sentCount: 0,
    };

    onAddCampaign(created);
    setSelectedCampaignId(created.id);
    setShowNewModal(false);
    setNewTitle('');
  };

  return (
    <div id="offers-view-container" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">WhatsApp Marketing & Promo Hub</h2>
          <p className="text-xs text-slate-500">Send personalized broadcast offers, festival discounts, and appointment reminders</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Campaign</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Campaign List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Campaigns & Promotions</h3>
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              onClick={() => setSelectedCampaignId(camp.id)}
              className={`p-4 rounded-2xl bg-white border cursor-pointer transition-all ${
                selectedCampaign?.id === camp.id
                  ? 'border-purple-500 ring-2 ring-purple-500/10 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-900">{camp.name}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {camp.discountBadge}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2 mb-2 font-mono">{camp.messageTemplate}</p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                <span>Audience: {camp.targetAudience}</span>
                <span className="font-semibold text-purple-700">{camp.sentCount} delivered</span>
              </div>
            </div>
          ))}
        </div>

        {/* Campaign Broadcast & Preview */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedCampaign.name}</h3>
                <p className="text-xs text-slate-500">Live preview with personalized client tags</p>
              </div>
              <span className="px-2.5 py-1 text-xs font-bold bg-purple-100 text-purple-800 rounded-full">
                {selectedCampaign.discountBadge}
              </span>
            </div>

            {/* Audience scope */}
            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 font-medium block">Audience Target</span>
                <span className="text-xs font-bold text-slate-800">{selectedCampaign.targetAudience}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 font-medium block">Recipients</span>
                <span className="text-xs font-bold text-slate-800">{customers.length} WhatsApp Contacts</span>
              </div>
            </div>

            {/* Preview Box */}
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">Client WhatsApp Bubble Preview</label>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-xs text-purple-600 font-medium flex items-center gap-1 hover:underline"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-xs font-mono text-slate-800 leading-relaxed space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-[11px]">
                  <MessageCircle className="w-4 h-4" />
                  <span>House of Hairs Saloon Official</span>
                </div>
                <p className="whitespace-pre-wrap">
                  {selectedCampaign.messageTemplate.replace('{CustomerName}', 'Emily Chen')}
                </p>
                <span className="text-[10px] text-slate-400 block text-right">11:45 AM ✓✓</span>
              </div>
            </div>
          </div>

          {/* Broadcast Trigger */}
          <div className="pt-6 border-t border-slate-100 mt-6">
            <button
              onClick={handleTriggerBroadcast}
              className="w-full py-3 bg-[#10b981] hover:bg-[#059669] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              {broadcastDone ? (
                <>
                  <CheckCheck className="w-4 h-4 text-white" />
                  <span>Campaign Sent to {customers.length} Clients!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Launch WhatsApp Broadcast to All Clients</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-2">
              Encrypted messaging delivered directly to client WhatsApp numbers
            </p>
          </div>
        </div>
      </div>

      {/* New Campaign Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-slate-900 text-base mb-1">New WhatsApp Campaign</h3>
            <p className="text-xs text-slate-500 mb-4">Draft a new promotion for salon clientele</p>

            <form onSubmit={handleCreateCampaign} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Hair Detox Special"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Offer Tag</label>
                  <input
                    type="text"
                    required
                    value={newDiscount}
                    onChange={(e) => setNewDiscount(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target</label>
                  <select
                    value={newAudience}
                    onChange={(e) => setNewAudience(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="All Valued Clients">All Valued Clients</option>
                    <option value="VIP Clients">VIP Clients</option>
                    <option value="Color Regulars">Color Regulars</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message Template (use {'{CustomerName}'})
                </label>
                <textarea
                  rows={3}
                  required
                  value={newTemplate}
                  onChange={(e) => setNewTemplate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg"
                >
                  Save Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
