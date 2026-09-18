export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  totalVisits: number;
  totalSpent: number;
  lastVisit: string;
  hairType: string;
  hairColorFormula: string;
  preferredStylist: string;
  allergies: string;
  notes: string;
  status: 'Sent' | 'Failed' | 'Select' | 'Delivered' | 'New';
  tags: string[];
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'active' | 'on_break' | 'busy' | 'off';
  rating: number;
  servicesToday: number;
  totalRevenueToday: number;
  commissionRate: number; // percentage e.g. 15%
  phone: string;
}

export interface Receptionist {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  deskNumber: string;
  shift: string;
  status: 'active' | 'on_break' | 'off';
  notes?: string;
  languages?: string[];
}

export interface ServiceItem {
  id: string;
  name: string;
  category: 'Haircut & Styling' | 'Color & Balayage' | 'Treatments & Spa' | 'Texture & Keratin' | 'Beauty & Nails' | 'Combo Package' | string;
  price: number;
  durationMinutes: number;
  description: string;
  isTemplate?: boolean;
  packageItems?: string[];
}

export interface AppointmentLedgerItem {
  id: string;
  staffId: string;
  staffName: string;
  staffAvatar: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAvatar: string;
  service: string;
  time: string;
  date: string;
  status: 'Completed' | 'In Progress' | 'Scheduled' | 'Waiting' | 'Cancelled';
  price: number;
  notes?: string;
  paymentStatus: 'Paid' | 'Unpaid';
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  staffId: string;
  staffName: string;
  services: { name: string; price: number }[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: 'Cash' | 'Credit Card' | 'Debit Card' | 'UPI / GPay' | 'Split';
  date: string;
  time: string;
  status: 'Completed' | 'Pending';
}

export interface MarketingCampaign {
  id: string;
  name: string;
  discountBadge: string;
  targetAudience: string;
  messageTemplate: string;
  isActive: boolean;
  sentCount: number;
}
