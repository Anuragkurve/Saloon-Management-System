import React, { useState } from 'react';
import {
  Search,
  Plus,
  X,
  CreditCard,
  UserPlus,
  Sparkles,
  Layers,
  Tag,
  RotateCcw,
  Sliders,
  Check,
  ChevronDown,
  ChevronUp,
  Pencil,
} from 'lucide-react';
import { Customer, Staff, ServiceItem, Invoice } from '../types';
import { CreateServiceTemplateModal } from './CreateServiceTemplateModal';

interface SelectedServiceEntry {
  id: string;
  name: string;
  originalName: string;
  price: number;
  originalPrice: number;
  isCustom?: boolean;
}

interface QuickBillingProps {
  customers: Customer[];
  staffList: Staff[];
  servicesList: ServiceItem[];
  onProcessPayment: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'date' | 'time' | 'status'>) => void;
  onOpenAddCustomerModal: () => void;
  onAddServiceTemplate?: (template: ServiceItem) => void;
}

export const QuickBilling: React.FC<QuickBillingProps> = ({
  customers,
  staffList,
  servicesList,
  onProcessPayment,
  onOpenAddCustomerModal,
  onAddServiceTemplate,
}) => {
  const [customerSearch, setCustomerSearch] = useState(customers[0]?.name || '');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [selectedStaffId, setSelectedStaffId] = useState<string>(staffList[0]?.id || '');
  const [selectedServices, setSelectedServices] = useState<SelectedServiceEntry[]>([]);
  const [discountAmount, setDiscountAmount] = useState<string>('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  // Template creation modal state
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  // Custom manual service entry state
  const [showCustomServiceForm, setShowCustomServiceForm] = useState(false);
  const [customServiceName, setCustomServiceName] = useState('');
  const [customServicePrice, setCustomServicePrice] = useState('1200');
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);

  // Filter customer suggestions
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.phone.includes(customerSearch)
  );

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomerId(customer.id);
    setCustomerSearch(customer.name);
    setShowCustomerDropdown(false);
  };

  const handleAddService = (serviceId: string) => {
    if (!serviceId) return;
    const service = servicesList.find((s) => s.id === serviceId);
    if (service) {
      setSelectedServices((prev) => [
        ...prev,
        {
          id: `${service.id}-${Date.now()}`,
          name: service.name,
          originalName: service.name,
          price: service.price,
          originalPrice: service.price,
        },
      ]);
    }
  };

  // Direct manual adjustment of any service's name
  const handleUpdateServiceName = (index: number, newName: string) => {
    setSelectedServices((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, name: newName } : item
      )
    );
  };

  // Reset service name to catalog original
  const handleResetServiceName = (index: number) => {
    setSelectedServices((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, name: item.originalName } : item
      )
    );
  };

  // Direct manual adjustment of any service's price
  const handleUpdateServicePrice = (index: number, newPrice: number) => {
    setSelectedServices((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, price: Math.max(0, newPrice) } : item
      )
    );
  };

  // Quick incremental adjust (+100 / -100)
  const handleAdjustPriceStep = (index: number, delta: number) => {
    setSelectedServices((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, price: Math.max(0, item.price + delta) } : item
      )
    );
  };

  // Reset to original default template price
  const handleResetServicePrice = (index: number) => {
    setSelectedServices((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, price: item.originalPrice } : item
      )
    );
  };

  const handleRemoveService = (indexToRemove: number) => {
    setSelectedServices((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Add ad-hoc custom service with manual price
  const handleAddCustomService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customServiceName.trim()) return;

    const priceNum = Math.max(0, parseFloat(customServicePrice) || 0);
    const newEntry: SelectedServiceEntry = {
      id: `custom-${Date.now()}`,
      name: customServiceName.trim(),
      originalName: customServiceName.trim(),
      price: priceNum,
      originalPrice: priceNum,
      isCustom: true,
    };

    setSelectedServices((prev) => [...prev, newEntry]);

    // If cashier checked "Save as Template"
    if (saveAsTemplate && onAddServiceTemplate) {
      const newTemplate: ServiceItem = {
        id: `srv-tpl-${Date.now()}`,
        name: customServiceName.trim(),
        category: 'Combo Package',
        price: priceNum,
        durationMinutes: 45,
        description: 'Custom service template created from Quick Billing.',
        isTemplate: true,
      };
      onAddServiceTemplate(newTemplate);
    }

    setCustomServiceName('');
    setCustomServicePrice('1200');
    setSaveAsTemplate(false);
    setShowCustomServiceForm(false);
  };

  // Handle saving new template from modal
  const handleSaveTemplateFromModal = (template: ServiceItem) => {
    if (onAddServiceTemplate) {
      onAddServiceTemplate(template);
    }
    // Also auto-add this template to the current bill!
    setSelectedServices((prev) => [
      ...prev,
      {
        id: `${template.id}-${Date.now()}`,
        name: template.name,
        originalName: template.name,
        price: template.price,
        originalPrice: template.price,
      },
    ]);
  };

  // Compute subtotal, discount, total
  const subtotal = selectedServices.reduce((acc, curr) => acc + curr.price, 0);
  const discountVal = parseFloat(discountAmount) || 0;
  const total = Math.max(0, subtotal - discountVal);

  const handleTriggerPayment = () => {
    if (selectedServices.length === 0) {
      alert('Please select or add at least one service to bill.');
      return;
    }

    const currentCustomer = customers.find((c) => c.id === selectedCustomerId) || {
      id: 'walk-in',
      name: customerSearch || 'Walk-in Client',
      phone: '+91 99999 00000',
    };

    const currentStaff = staffList.find((s) => s.id === selectedStaffId) || staffList[0] || {
      id: 'unassigned',
      name: 'Salon Stylist',
      role: 'Stylist',
    };

    onProcessPayment({
      customerId: currentCustomer.id,
      customerName: currentCustomer.name,
      customerPhone: currentCustomer.phone,
      staffId: currentStaff.id,
      staffName: currentStaff.name,
      services: selectedServices.map((s) => ({ name: s.name, price: s.price })),
      subtotal,
      discount: discountVal,
      tax: 0,
      total,
      paymentMethod: 'Credit Card',
    });
  };

  return (
    <div id="quick-billing-card" className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
      <div>
        {/* Top Header & Template Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <span>Quick Billing & New Invoice</span>
            </h3>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/60">
              POS Terminal
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-create-service-template"
              onClick={() => setIsTemplateModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200/80 transition-all shadow-2xs hover:shadow-xs"
              title="Create a reusable service or package template"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Create Template</span>
            </button>
          </div>
        </div>

        {/* Quick Templates Strip */}
        <div className="mt-3.5 pt-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-purple-600" />
              <span>Service Templates (1-Click Add):</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              Click template to add • Price is manually editable
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
            {servicesList.map((srv) => (
              <button
                key={srv.id}
                type="button"
                onClick={() => handleAddService(srv.id)}
                className="px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-900 border border-slate-200 hover:border-purple-300 text-xs font-semibold whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5 group"
              >
                <span>{srv.name}</span>
                <span className="text-purple-600 font-bold bg-white group-hover:bg-purple-100 px-1.5 py-0.5 rounded text-[11px]">
                  ₹{srv.price}
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setIsTemplateModalOpen(true)}
              className="px-2 py-1 rounded-xl bg-purple-50/60 hover:bg-purple-100 text-purple-700 border border-dashed border-purple-300 text-xs font-bold whitespace-nowrap transition-all shrink-0 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Template</span>
            </button>
          </div>
        </div>

        <div className="mt-3 space-y-3.5">
          {/* Row 1: Search Customer & Staff */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Search Customer with Dropdown */}
            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">Search Customer</label>
                <button
                  type="button"
                  onClick={onOpenAddCustomerModal}
                  className="text-[11px] text-purple-600 hover:underline font-semibold"
                >
                  + New Client
                </button>
              </div>
              <div className="relative">
                <input
                  id="billing-customer-search"
                  type="text"
                  value={customerSearch}
                  onChange={(e) => {
                    setCustomerSearch(e.target.value);
                    setShowCustomerDropdown(true);
                  }}
                  onFocus={() => setShowCustomerDropdown(true)}
                  placeholder="Type name or phone..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 text-slate-800 font-semibold"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>

              {/* Customer Dropdown Results */}
              {showCustomerDropdown && (
                <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectCustomer(c)}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-purple-50 flex items-center justify-between border-b border-slate-50 last:border-0"
                      >
                        <div>
                          <p className="font-semibold text-slate-800">{c.name}</p>
                          <p className="text-[10px] text-slate-400">{c.phone}</p>
                        </div>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          {c.totalVisits} visits
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="p-2 text-center text-xs text-slate-500">
                      <span>No customer found.</span>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCustomerDropdown(false);
                          onOpenAddCustomerModal();
                        }}
                        className="text-purple-600 font-semibold block mt-1 hover:underline"
                      >
                        + Add new customer
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Staff Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Stylist</label>
              <select
                id="billing-staff-select"
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500/30 text-slate-800 font-semibold"
              >
                {staffList.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.role.split(' ')[0]}) • {st.status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Add Service from Dropdown & Custom Service Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            {/* Add from Template Catalog */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Service from Catalog / Template
              </label>
              <select
                id="billing-add-service-select"
                defaultValue=""
                onChange={(e) => {
                  handleAddService(e.target.value);
                  e.target.value = '';
                }}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500/30 text-slate-800 font-medium"
              >
                <option value="" disabled>
                  + Add service template to bill...
                </option>
                {servicesList.map((srv) => (
                  <option key={srv.id} value={srv.id}>
                    {srv.name} — ₹{srv.price} ({srv.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Service Toggle */}
            <div className="pt-2 sm:pt-4 flex items-center justify-between sm:justify-end gap-2">
              <button
                type="button"
                id="toggle-custom-service-btn"
                onClick={() => setShowCustomServiceForm(!showCustomServiceForm)}
                className="text-xs font-bold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-200/70 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Custom Service (Manual Name & Amount)</span>
                {showCustomServiceForm ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Collapsible Custom Service Entry */}
          {showCustomServiceForm && (
            <div className="p-3.5 rounded-xl bg-purple-50/40 border border-purple-200/80 animate-in fade-in duration-150 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-purple-600" />
                  <span>Add Ad-Hoc Service with Manual Name & Amount</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowCustomServiceForm(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-7">
                  <input
                    type="text"
                    value={customServiceName}
                    onChange={(e) => setCustomServiceName(e.target.value)}
                    placeholder="Enter manual service name (e.g. Bridal Saree Draping & Hair Accessories)..."
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 font-semibold focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
                <div className="sm:col-span-3">
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      min="0"
                      value={customServicePrice}
                      onChange={(e) => setCustomServicePrice(e.target.value)}
                      placeholder="Amount"
                      className="w-full pl-6 pr-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="button"
                    onClick={handleAddCustomService}
                    className="w-full py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-all shadow-2xs"
                  >
                    + Add
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="save-template-check"
                  checked={saveAsTemplate}
                  onChange={(e) => setSaveAsTemplate(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="save-template-check" className="text-[11px] font-semibold text-slate-600 cursor-pointer">
                  Save this service as a reusable template for future billing
                </label>
              </div>
            </div>
          )}

          {/* Selected Services Table / Interactive Price Editor */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span>Billed Services (Manual Name & Amount Editable):</span>
                <span className="text-[11px] font-normal text-purple-600">({selectedServices.length} items)</span>
              </label>
              <span className="text-[10px] text-slate-400 font-medium">
                Type directly to edit any service name or price
              </span>
            </div>

            {selectedServices.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center bg-slate-50/50">
                <p className="text-xs text-slate-400 font-medium">
                  No services added yet. Click a template above or select from the dropdown.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {selectedServices.map((srv, idx) => {
                  const isPriceModified = srv.price !== srv.originalPrice;
                  const isNameModified = srv.name !== srv.originalName;
                  return (
                    <div
                      key={srv.id}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs hover:border-purple-300 transition-all"
                    >
                      {/* Service Title / Manual Name Input */}
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="relative flex items-center group/input">
                            <input
                              type="text"
                              value={srv.name}
                              onChange={(e) => handleUpdateServiceName(idx, e.target.value)}
                              placeholder="Enter service name manually..."
                              className="w-full text-xs font-bold text-slate-900 bg-white hover:bg-slate-100/70 focus:bg-white px-2.5 py-1.5 border border-slate-200 focus:border-purple-500 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 shadow-2xs transition-all pr-7"
                              title="Click to manually edit this service name"
                            />
                            <Pencil className="w-3 h-3 text-slate-400 absolute right-2.5 pointer-events-none opacity-40 group-hover/input:opacity-100 transition-opacity" />
                          </div>

                          <div className="flex items-center flex-wrap gap-2 mt-1 px-1">
                            {isNameModified && (
                              <span className="text-[10px] font-semibold text-purple-700 flex items-center gap-1 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200/50">
                                <span>Custom Name (Original: {srv.originalName})</span>
                                <button
                                  type="button"
                                  onClick={() => handleResetServiceName(idx)}
                                  className="text-[10px] text-purple-600 hover:text-purple-900 underline font-bold ml-1 cursor-pointer"
                                  title="Reset to default service name"
                                >
                                  Reset
                                </button>
                              </span>
                            )}
                            {isPriceModified && (
                              <span className="text-[10px] font-semibold text-amber-700 flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/50">
                                <span>Manual Price (Catalog: ₹{srv.originalPrice})</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Manual Price Input & Quick Adjusters */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {/* Quick -100 */}
                        <button
                          type="button"
                          onClick={() => handleAdjustPriceStep(idx, -100)}
                          className="px-1.5 py-1 rounded bg-white hover:bg-slate-200 text-slate-600 text-[11px] font-bold border border-slate-200 shadow-2xs transition-colors"
                          title="Decrease ₹100"
                        >
                          -100
                        </button>

                        {/* Interactive Manual Price Input */}
                        <div className="relative flex items-center">
                          <span className="absolute left-2.5 text-xs font-bold text-slate-400">₹</span>
                          <input
                            type="number"
                            min="0"
                            step="50"
                            value={srv.price}
                            onChange={(e) => handleUpdateServicePrice(idx, parseFloat(e.target.value) || 0)}
                            className="w-24 pl-5 pr-2 py-1.5 text-xs font-extrabold text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 text-right shadow-2xs"
                            title="Click and type whatever manual amount for this service"
                          />
                        </div>

                        {/* Quick +100 */}
                        <button
                          type="button"
                          onClick={() => handleAdjustPriceStep(idx, 100)}
                          className="px-1.5 py-1 rounded bg-white hover:bg-slate-200 text-slate-600 text-[11px] font-bold border border-slate-200 shadow-2xs transition-colors"
                          title="Increase ₹100"
                        >
                          +100
                        </button>

                        {/* Reset to Default Price */}
                        {isPriceModified && (
                          <button
                            type="button"
                            onClick={() => handleResetServicePrice(idx)}
                            className="p-1 text-slate-400 hover:text-purple-600 rounded transition-colors"
                            title="Reset to default template amount"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Delete service */}
                        <button
                          type="button"
                          onClick={() => handleRemoveService(idx)}
                          className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors ml-1"
                          title="Remove item"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Discount & Grand Total */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Promotional Discount (₹)
              </label>
              <input
                id="billing-discount-input"
                type="number"
                min="0"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
                placeholder="Discount amount in ₹..."
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500/30 text-slate-800 font-semibold"
              />
            </div>

            <div className="sm:text-right pt-2 sm:pt-0">
              <div className="text-[11px] text-slate-500 font-medium">
                Subtotal: <span className="font-semibold text-slate-700">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                {discountVal > 0 && <span className="text-emerald-600 ml-1">(-₹{discountVal})</span>}
              </div>
              <div className="flex sm:justify-end items-baseline gap-2 mt-0.5">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Final Total:</span>
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-3">
        <button
          id="btn-process-payment"
          type="button"
          onClick={handleTriggerPayment}
          className="flex-1 py-2.5 px-4 bg-[#141824] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
        >
          <CreditCard className="w-3.5 h-3.5 text-purple-400" />
          <span>Process Payment & Settle Bill</span>
        </button>

        <button
          id="btn-quick-add-customer"
          type="button"
          onClick={onOpenAddCustomerModal}
          className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Create Service Template Modal */}
      <CreateServiceTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSaveTemplate={handleSaveTemplateFromModal}
      />
    </div>
  );
};
