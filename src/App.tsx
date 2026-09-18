import React, { useState, useEffect } from 'react';
import { CheckCircle2, Sparkles, X, UserCheck } from 'lucide-react';
import { Sidebar, NavTab } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { DailyOverview } from './components/DailyOverview';
import { QuickBilling } from './components/QuickBilling';
import { LiveServiceLedger } from './components/LiveServiceLedger';
import { CustomerMarketingWidget } from './components/CustomerMarketingWidget';
import { BookingModal } from './components/BookingModal';
import { AddCustomerModal } from './components/AddCustomerModal';
import { PaymentModal } from './components/PaymentModal';
import { WindowLauncher } from './components/WindowLauncher';

import { CustomersView } from './components/CustomersView';
import { StaffView } from './components/StaffView';
import { BillingView } from './components/BillingView';
import { AppointmentsView } from './components/AppointmentsView';
import { OffersView } from './components/OffersView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';

import {
  INITIAL_STAFF,
  INITIAL_RECEPTIONISTS,
  INITIAL_SERVICES,
  INITIAL_CUSTOMERS,
  INITIAL_LEDGER,
  INITIAL_CAMPAIGNS,
  INITIAL_INVOICES
} from './data/initialData';

import {
  Customer,
  Staff,
  Receptionist,
  ServiceItem,
  AppointmentLedgerItem,
  MarketingCampaign,
  Invoice
} from './types';
import { SalonDatabaseExport } from './utils/offlineBackup';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Salon State with localStorage backing (versioned for clean 1-record software state)
  const isCleanStorage = typeof window !== 'undefined' && localStorage.getItem('hoh_clean_software_v1') === 'clean';

  const [customers, setCustomers] = useState<Customer[]>(() => {
    if (!isCleanStorage) {
      return INITIAL_CUSTOMERS;
    }
    const saved = localStorage.getItem('hoh_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [staffList, setStaffList] = useState<Staff[]>(() => {
    if (!isCleanStorage) {
      return INITIAL_STAFF;
    }
    const saved = localStorage.getItem('hoh_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [receptionists, setReceptionists] = useState<Receptionist[]>(() => {
    if (!isCleanStorage) {
      return INITIAL_RECEPTIONISTS;
    }
    const saved = localStorage.getItem('hoh_receptionists');
    return saved ? JSON.parse(saved) : INITIAL_RECEPTIONISTS;
  });

  const [activeReceptionistId, setActiveReceptionistId] = useState<string | undefined>(undefined);

  const [servicesList, setServicesList] = useState<ServiceItem[]>(() => {
    if (!isCleanStorage) {
      return INITIAL_SERVICES;
    }
    const saved = localStorage.getItem('hoh_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [ledgerItems, setLedgerItems] = useState<AppointmentLedgerItem[]>(() => {
    if (!isCleanStorage) {
      return INITIAL_LEDGER;
    }
    const saved = localStorage.getItem('hoh_ledger');
    return saved ? JSON.parse(saved) : INITIAL_LEDGER;
  });

  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(() => {
    if (!isCleanStorage) {
      return INITIAL_CAMPAIGNS;
    }
    const saved = localStorage.getItem('hoh_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    if (!isCleanStorage) {
      localStorage.setItem('hoh_clean_software_v1', 'clean');
      return INITIAL_INVOICES;
    }
    const saved = localStorage.getItem('hoh_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  // Modals state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [preselectedCustomerId, setPreselectedCustomerId] = useState<string | undefined>(undefined);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [pendingInvoice, setPendingInvoice] = useState<Omit<Invoice, 'id' | 'invoiceNumber' | 'date' | 'time' | 'status'> | null>(null);
  const [billingAppointmentId, setBillingAppointmentId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type?: 'success' | 'info' } | null>(null);

  // Auto-dismiss toast after 4 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('hoh_clean_software_v1', 'clean');
    localStorage.setItem('hoh_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('hoh_staff', JSON.stringify(staffList));
  }, [staffList]);

  useEffect(() => {
    localStorage.setItem('hoh_receptionists', JSON.stringify(receptionists));
  }, [receptionists]);

  useEffect(() => {
    localStorage.setItem('hoh_services', JSON.stringify(servicesList));
  }, [servicesList]);

  useEffect(() => {
    localStorage.setItem('hoh_ledger', JSON.stringify(ledgerItems));
  }, [ledgerItems]);

  useEffect(() => {
    localStorage.setItem('hoh_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('hoh_invoices', JSON.stringify(invoices));
  }, [invoices]);

  // Clean, real-time Daily Overview calculations from active module records
  const currentTotalSales = invoices.reduce((acc, curr) => acc + curr.total, 0);
  const completedServicesCount = ledgerItems.filter((l) => l.status === 'Completed').length;
  const activeStaffCount = staffList.filter((s) => s.status === 'active' || s.status === 'busy').length;
  const newCustomersCount = customers.length;

  // Reset to clean 1-record software state
  const handleResetToCleanData = () => {
    localStorage.removeItem('hoh_customers');
    localStorage.removeItem('hoh_staff');
    localStorage.removeItem('hoh_services');
    localStorage.removeItem('hoh_ledger');
    localStorage.removeItem('hoh_campaigns');
    localStorage.removeItem('hoh_invoices');
    localStorage.removeItem('hoh_receptionists');
    setCustomers(INITIAL_CUSTOMERS);
    setStaffList(INITIAL_STAFF);
    setReceptionists(INITIAL_RECEPTIONISTS);
    setServicesList(INITIAL_SERVICES);
    setLedgerItems(INITIAL_LEDGER);
    setCampaigns(INITIAL_CAMPAIGNS);
    setInvoices(INITIAL_INVOICES);
  };

  // Handlers
  const handleOpenPayment = (
    inv: Omit<Invoice, 'id' | 'invoiceNumber' | 'date' | 'time' | 'status'>,
    appointmentId?: string
  ) => {
    setPendingInvoice(inv);
    setBillingAppointmentId(appointmentId || null);
    setIsPaymentModalOpen(true);
  };

  const handleBillAppointment = (item: AppointmentLedgerItem) => {
    const matchedCustomer = customers.find((c) => c.id === item.customerId || c.name === item.customerName);
    const pendingInv: Omit<Invoice, 'id' | 'invoiceNumber' | 'date' | 'time' | 'status'> = {
      customerId: item.customerId,
      customerName: item.customerName,
      customerPhone: item.customerPhone || matchedCustomer?.phone || '+91 99999 00000',
      staffId: item.staffId,
      staffName: item.staffName,
      services: [{ name: item.service, price: item.price }],
      subtotal: item.price,
      discount: 0,
      tax: Math.round(item.price * 0.18),
      total: item.price + Math.round(item.price * 0.18),
      paymentMethod: 'Credit Card',
    };
    handleOpenPayment(pendingInv, item.id);
  };

  const handleCompletePayment = (finalInvoice: Invoice) => {
    setInvoices((prev) => [finalInvoice, ...prev]);

    // If payment was generated from a booked appointment, update that appointment to Paid & Completed
    if (billingAppointmentId) {
      setLedgerItems((prev) =>
        prev.map((item) => {
          if (item.id === billingAppointmentId) {
            return {
              ...item,
              status: 'Completed',
              paymentStatus: 'Paid',
            };
          }
          return item;
        })
      );
      setBillingAppointmentId(null);
    }

    // Update customer total spend & visit, or auto-save new billed client
    setCustomers((prev) => {
      const existing = prev.find((c) => c.id === finalInvoice.customerId);
      if (existing) {
        return prev.map((c) => {
          if (c.id === finalInvoice.customerId) {
            return {
              ...c,
              totalVisits: c.totalVisits + 1,
              totalSpent: c.totalSpent + finalInvoice.total,
              lastVisit: 'Today',
            };
          }
          return c;
        });
      } else if (finalInvoice.customerId && finalInvoice.customerName && finalInvoice.customerName !== 'Walk-in Client') {
        const newBilledCust: Customer = {
          id: finalInvoice.customerId === 'walk-in' ? `cust-${Date.now()}` : finalInvoice.customerId,
          name: finalInvoice.customerName,
          phone: finalInvoice.customerPhone || '+91 99999 00000',
          email: `${finalInvoice.customerName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@example.com`,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          totalVisits: 1,
          totalSpent: finalInvoice.total,
          lastVisit: 'Today',
          hairType: 'Normal, Medium Texture',
          hairColorFormula: 'Salon Service Completed',
          preferredStylist: finalInvoice.staffName,
          allergies: 'None reported',
          notes: `Billed for ${finalInvoice.services.map((s) => s.name).join(', ')}`,
          status: 'New',
          tags: ['Billed Client', 'Auto-Saved'],
        };
        return [newBilledCust, ...prev];
      }
      return prev;
    });

    // Update staff revenue
    setStaffList((prev) =>
      prev.map((s) => {
        if (s.id === finalInvoice.staffId) {
          return {
            ...s,
            servicesToday: s.servicesToday + 1,
            totalRevenueToday: s.totalRevenueToday + finalInvoice.total,
          };
        }
        return s;
      })
    );
  };

  const handleBookAppointment = (
    appointment: Omit<AppointmentLedgerItem, 'id'>,
    newCustomerData?: {
      email?: string;
      hairType?: string;
      allergies?: string;
    }
  ) => {
    const cleanDigits = (val: string) => val.replace(/\D/g, '');
    const appointmentPhoneDigits = cleanDigits(appointment.customerPhone);

    // Check if customer already exists in Customer Module
    const matchedCustomer = customers.find((c) => {
      if (appointment.customerId !== 'new' && c.id === appointment.customerId) return true;
      if (appointmentPhoneDigits && cleanDigits(c.phone) === appointmentPhoneDigits) return true;
      return false;
    });

    let assignedCustomerId = matchedCustomer?.id;

    if (matchedCustomer) {
      // Existing client: sync their profile with new appointment preferences
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id === matchedCustomer.id) {
            return {
              ...c,
              lastVisit: appointment.date || 'Today',
              preferredStylist: appointment.staffName || c.preferredStylist,
              hairType: newCustomerData?.hairType || c.hairType,
              allergies: newCustomerData?.allergies || c.allergies,
              notes: appointment.notes
                ? (c.notes ? `${c.notes}; Appointment: ${appointment.service} (${appointment.notes})` : appointment.notes)
                : c.notes,
            };
          }
          return c;
        })
      );
    } else {
      // New Client: AUTOMATICALLY SAVE in Customer Module!
      const newCustId = `cust-${Date.now()}`;
      assignedCustomerId = newCustId;

      const defaultAvatars = [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      ];
      const avatarUrl =
        appointment.customerAvatar && !appointment.customerAvatar.includes('photo-1534528741775')
          ? appointment.customerAvatar
          : defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

      const clientDisplayName = appointment.customerName.trim() || 'New Client';
      const fallbackEmail = `${clientDisplayName.toLowerCase().replace(/[^a-z0-9]/g, '.') || 'client'}@example.com`;

      const newCustomerRecord: Customer = {
        id: newCustId,
        name: clientDisplayName,
        phone: appointment.customerPhone.trim() || '+91 99999 00000',
        email: newCustomerData?.email?.trim() || fallbackEmail,
        avatar: avatarUrl,
        totalVisits: 1,
        totalSpent: 0,
        lastVisit: appointment.date || 'Today',
        hairType: newCustomerData?.hairType?.trim() || 'Normal, Medium Texture',
        hairColorFormula: 'Initial Consultation Scheduled',
        preferredStylist: appointment.staffName,
        allergies: newCustomerData?.allergies?.trim() || 'None reported',
        notes: appointment.notes
          ? `Booked for ${appointment.service} on ${appointment.date} at ${appointment.time}. Instructions: ${appointment.notes}`
          : `Booked for ${appointment.service} on ${appointment.date} at ${appointment.time}`,
        status: 'New',
        tags: ['Booked Appointment', 'Auto-Saved', 'New Client'],
      };

      // Instantly save to Customer Module!
      setCustomers((prev) => [newCustomerRecord, ...prev]);
    }

    const newEntry: AppointmentLedgerItem = {
      ...appointment,
      customerId: assignedCustomerId || `cust-${Date.now()}`,
      id: `ledg-${Date.now()}`,
    };
    setLedgerItems((prev) => [newEntry, ...prev]);

    // Instant toast notification verifying automatic customer save
    setToastMessage({
      title: 'Appointment Booked & Customer Saved',
      desc: `"${appointment.customerName}" has been automatically registered into your Customer Module and WhatsApp Directory.`,
      type: 'success',
    });
  };

  const handleUpdateLedgerStatus = (id: string, newStatus: AppointmentLedgerItem['status']) => {
    const targetItem = ledgerItems.find((item) => item.id === id);
    if (targetItem && newStatus === 'Completed' && targetItem.status !== 'Completed') {
      // Sync customer visits and spend
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id === targetItem.customerId || c.name === targetItem.customerName) {
            return {
              ...c,
              totalVisits: c.totalVisits + 1,
              totalSpent: c.totalSpent + targetItem.price,
              lastVisit: 'Today',
            };
          }
          return c;
        })
      );
    }

    setLedgerItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, status: newStatus };
        }
        return item;
      })
    );
  };

  const handleAddCustomer = (newCust: Customer) => {
    setCustomers((prev) => [newCust, ...prev]);
  };

  const handleDeleteCustomer = (customerId: string) => {
    const target = customers.find((c) => c.id === customerId);
    setCustomers((prev) => prev.filter((c) => c.id !== customerId));
    setToastMessage({
      title: 'Customer Deleted',
      desc: target
        ? `Client profile for "${target.name}" and their hair records have been deleted.`
        : 'Customer profile has been deleted successfully.',
      type: 'info',
    });
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    const target = ledgerItems.find((item) => item.id === appointmentId);
    setLedgerItems((prev) => prev.filter((item) => item.id !== appointmentId));
    setToastMessage({
      title: 'Appointment Deleted',
      desc: target
        ? `Appointment for "${target.customerName}" (${target.service}) has been deleted.`
        : 'Appointment has been deleted successfully.',
      type: 'info',
    });
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    const target = invoices.find((inv) => inv.id === invoiceId);
    setInvoices((prev) => prev.filter((inv) => inv.id !== invoiceId));
    if (target) {
      // Revert customer lifetime spend and visit if applicable
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id === target.customerId || c.name === target.customerName) {
            return {
              ...c,
              totalVisits: Math.max(0, c.totalVisits - 1),
              totalSpent: Math.max(0, c.totalSpent - target.total),
            };
          }
          return c;
        })
      );
      // Revert staff revenue if applicable
      setStaffList((prev) =>
        prev.map((s) => {
          if (s.id === target.staffId) {
            return {
              ...s,
              servicesToday: Math.max(0, s.servicesToday - 1),
              totalRevenueToday: Math.max(0, s.totalRevenueToday - target.total),
            };
          }
          return s;
        })
      );
    }
    setToastMessage({
      title: 'Invoice Voided & Deleted',
      desc: target
        ? `Invoice ${target.invoiceNumber} (₹${target.total}) was removed. Total Sales updated in real-time.`
        : 'Invoice removed successfully.',
      type: 'info',
    });
  };

  const handleAddStaff = (newStaff: Staff) => {
    setStaffList((prev) => [...prev, newStaff]);
  };

  const handleDeleteStaff = (staffId: string) => {
    const target = staffList.find((s) => s.id === staffId);
    setStaffList((prev) => prev.filter((s) => s.id !== staffId));
    setToastMessage({
      title: 'Staff Member Removed',
      desc: target
        ? `"${target.name}" (${target.role}) has been removed from the staff roster.`
        : 'Staff member removed successfully.',
      type: 'info',
    });
  };

  const handleUpdateStaffStatus = (staffId: string, status: Staff['status']) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === staffId ? { ...s, status } : s))
    );
  };

  const handleAddReceptionist = (newReceptionist: Receptionist) => {
    setReceptionists((prev) => [newReceptionist, ...prev]);
    setActiveReceptionistId(newReceptionist.id);
    setToastMessage({
      title: 'Receptionist Added',
      desc: `"${newReceptionist.name}" registered successfully at ${newReceptionist.deskNumber}.`,
      type: 'success',
    });
  };

  const handleDeleteReceptionist = (receptionistId: string) => {
    const target = receptionists.find((r) => r.id === receptionistId);
    setReceptionists((prev) => prev.filter((r) => r.id !== receptionistId));
    
    // If active receptionist was deleted, select next remaining receptionist
    if (activeReceptionistId === receptionistId) {
      const remaining = receptionists.filter((r) => r.id !== receptionistId);
      setActiveReceptionistId(remaining[0]?.id || undefined);
    }

    setToastMessage({
      title: 'Receptionist Deleted',
      desc: target
        ? `"${target.name}" has been removed from the front desk receptionist roster.`
        : 'Receptionist removed successfully.',
      type: 'info',
    });
  };

  const handleUpdateReceptionistStatus = (receptionistId: string, status: Receptionist['status']) => {
    setReceptionists((prev) =>
      prev.map((r) => (r.id === receptionistId ? { ...r, status } : r))
    );
  };

  const handleBroadcastCampaign = (campaignId: string) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, sentCount: c.sentCount + customers.length } : c))
    );
    setCustomers((prev) =>
      prev.map((c) => ({ ...c, status: 'Sent' }))
    );
  };

  const handleSendSingleWhatsApp = (customerId: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, status: 'Sent' } : c))
    );
  };

  const handleAddService = (newSrv: ServiceItem) => {
    setServicesList((prev) => [...prev, newSrv]);
  };

  const handleDeleteService = (srvId: string) => {
    setServicesList((prev) => prev.filter((s) => s.id !== srvId));
  };

  const handleAddCampaign = (newCamp: MarketingCampaign) => {
    setCampaigns((prev) => [newCamp, ...prev]);
  };

  const handleRestoreDatabase = (data: SalonDatabaseExport['data']) => {
    if (data.customers && Array.isArray(data.customers)) setCustomers(data.customers);
    if (data.staffList && Array.isArray(data.staffList)) setStaffList(data.staffList);
    if (data.receptionists && Array.isArray(data.receptionists)) setReceptionists(data.receptionists);
    if (data.servicesList && Array.isArray(data.servicesList)) setServicesList(data.servicesList);
    if (data.ledgerItems && Array.isArray(data.ledgerItems)) setLedgerItems(data.ledgerItems);
    if (data.campaigns && Array.isArray(data.campaigns)) setCampaigns(data.campaigns);
    if (data.invoices && Array.isArray(data.invoices)) setInvoices(data.invoices);
    setToastMessage({
      title: 'Salon Database Restored',
      desc: 'All clients, appointments, invoices, and staff records loaded successfully from local file.',
      type: 'success',
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col lg:flex-row w-full overflow-x-hidden">
      {/* Sleek Dark Brand Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingAppointmentsCount={ledgerItems.filter((l) => l.status === 'Scheduled').length}
        activeStaffCount={activeStaffCount}
        totalSales={currentTotalSales}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden">
        {/* Banner if inside an iframe */}
        <WindowLauncher variant="banner" />

        <TopHeader
          currentTabName={activeTab === 'offers' ? 'Offers (WhatsApp)' : activeTab}
          onOpenBookingModal={() => setIsBookingModalOpen(true)}
          onOpenCustomerModal={() => setIsAddCustomerModalOpen(true)}
          upcomingAppointments={ledgerItems.filter((l) => l.status === 'Scheduled' || l.status === 'In Progress')}
          totalSales={currentTotalSales}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          receptionists={receptionists}
          activeReceptionistId={activeReceptionistId}
          onSelectReceptionist={(id) => setActiveReceptionistId(id)}
          onNavigateToReceptionists={() => setActiveTab('staff')}
        />

        <main className="p-3.5 sm:p-5 md:p-6 max-w-[1600px] w-full mx-auto">
          {/* DASHBOARD TAB (Matches user plan image exactly) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Bento Grid layout matching the reference mockup */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                {/* Left Column (xl:col-span-7) */}
                <div className="xl:col-span-7 space-y-6">
                  {/* Daily Overview Stats */}
                  <DailyOverview
                    totalSales={currentTotalSales}
                    servicesCount={completedServicesCount}
                    newCustomersCount={newCustomersCount}
                    activeStaffCount={activeStaffCount}
                  />

                  {/* Live Staff Service Ledger */}
                  <LiveServiceLedger
                    ledgerItems={ledgerItems}
                    onUpdateStatus={handleUpdateLedgerStatus}
                    onOpenBookingModal={() => setIsBookingModalOpen(true)}
                    onDeleteAppointment={handleDeleteAppointment}
                    onBillAppointment={handleBillAppointment}
                  />
                </div>

                {/* Right Column (xl:col-span-5) */}
                <div className="xl:col-span-5 space-y-6">
                  {/* Quick Billing & New Invoice */}
                  <QuickBilling
                    customers={customers}
                    staffList={staffList}
                    servicesList={servicesList}
                    onProcessPayment={handleOpenPayment}
                    onOpenAddCustomerModal={() => setIsAddCustomerModalOpen(true)}
                    onAddServiceTemplate={handleAddService}
                  />

                  {/* Customer Database & WhatsApp Marketing */}
                  <CustomerMarketingWidget
                    customers={customers}
                    campaigns={campaigns}
                    onSelectCustomerForDetail={(cust) => {
                      setActiveTab('customers');
                    }}
                    onSendWhatsApp={handleSendSingleWhatsApp}
                    onBroadcastCampaign={handleBroadcastCampaign}
                  />
                </div>
              </div>
            </div>
          )}

          {/* APPOINTMENTS TAB */}
          {activeTab === 'appointments' && (
            <AppointmentsView
              appointments={ledgerItems}
              onOpenBookingModal={() => setIsBookingModalOpen(true)}
              onUpdateStatus={handleUpdateLedgerStatus}
              onDeleteAppointment={handleDeleteAppointment}
              onBillAppointment={handleBillAppointment}
            />
          )}

          {/* CUSTOMERS TAB */}
          {activeTab === 'customers' && (
            <CustomersView
              customers={customers}
              onOpenAddCustomerModal={() => setIsAddCustomerModalOpen(true)}
              onSelectCustomerToBook={(cust) => {
                setPreselectedCustomerId(cust.id);
                setIsBookingModalOpen(true);
              }}
              onSendWhatsApp={handleSendSingleWhatsApp}
              onDeleteCustomer={handleDeleteCustomer}
            />
          )}

          {/* STAFF & RECEPTIONIST TAB */}
          {activeTab === 'staff' && (
            <StaffView
              staffList={staffList}
              onUpdateStaffStatus={handleUpdateStaffStatus}
              onAddStaff={handleAddStaff}
              onDeleteStaff={handleDeleteStaff}
              receptionists={receptionists}
              onAddReceptionist={handleAddReceptionist}
              onDeleteReceptionist={handleDeleteReceptionist}
              onUpdateReceptionistStatus={handleUpdateReceptionistStatus}
            />
          )}

          {/* BILLING TAB */}
          {activeTab === 'billing' && (
            <BillingView
              invoices={invoices}
              onOpenQuickBilling={() => {
                setActiveTab('dashboard');
              }}
              onDeleteInvoice={handleDeleteInvoice}
            />
          )}

          {/* OFFERS (WHATSAPP) TAB */}
          {activeTab === 'offers' && (
            <OffersView
              campaigns={campaigns}
              customers={customers}
              onBroadcast={handleBroadcastCampaign}
              onAddCampaign={handleAddCampaign}
            />
          )}

          {/* REPORTS TAB */}
          {activeTab === 'reports' && (
            <ReportsView
              invoices={invoices}
              staffList={staffList}
              servicesList={servicesList}
            />
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <SettingsView
              servicesList={servicesList}
              customers={customers}
              staffList={staffList}
              receptionists={receptionists}
              ledgerItems={ledgerItems}
              campaigns={campaigns}
              invoices={invoices}
              onAddService={handleAddService}
              onDeleteService={handleDeleteService}
              onResetToCleanData={handleResetToCleanData}
              onRestoreDatabase={handleRestoreDatabase}
              onShowToast={(title, desc, type) => setToastMessage({ title, desc, type })}
            />
          )}
        </main>
      </div>

      {/* Toast Notification Alert for Auto-Save and Actions */}
      {toastMessage && (
        <aside 
          role="status" 
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 max-w-sm bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-emerald-200 flex items-start gap-3 transition-all animate-in slide-in-from-bottom-5 duration-200"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1 pr-1">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>{toastMessage.title}</span>
              <span className="inline-flex items-center text-[9px] font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
                Saved
              </span>
            </h4>
            <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
              {toastMessage.desc}
            </p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}

      {/* MODALS */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setPreselectedCustomerId(undefined);
        }}
        customers={customers}
        staffList={staffList}
        servicesList={servicesList}
        initialCustomerId={preselectedCustomerId}
        onBookAppointment={handleBookAppointment}
      />

      <AddCustomerModal
        isOpen={isAddCustomerModalOpen}
        onClose={() => setIsAddCustomerModalOpen(false)}
        staffList={staffList}
        onAddCustomer={handleAddCustomer}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setPendingInvoice(null);
        }}
        pendingInvoice={pendingInvoice}
        onCompletePayment={handleCompletePayment}
      />
    </div>
  );
}
