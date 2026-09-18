import { Customer, Staff, Receptionist, ServiceItem, AppointmentLedgerItem, MarketingCampaign, Invoice } from '../types';

export const INITIAL_RECEPTIONISTS: Receptionist[] = [
  {
    id: 'rec-1',
    name: 'Sarah Jenkins',
    phone: '+91 98111 22334',
    email: 'sarah.reception@houseofhair.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    deskNumber: 'Front Desk #1 (Main)',
    shift: 'Morning (8:30 AM - 2:30 PM)',
    status: 'active',
    notes: 'Handles client check-ins, telephone appointments, and quick billing checkouts.',
    languages: ['English', 'Hindi'],
  },
  {
    id: 'rec-2',
    name: 'Priya Sharma',
    phone: '+91 98222 33445',
    email: 'priya.reception@houseofhair.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    deskNumber: 'VIP Concierge Desk #2',
    shift: 'Evening (2:00 PM - 8:30 PM)',
    status: 'active',
    notes: 'Oversees VIP lounge hospitality, client feedback, and WhatsApp reminders.',
    languages: ['English', 'Hindi', 'Marathi'],
  },
];

export const INITIAL_STAFF: Staff[] = [
  {
    id: 'staff-1',
    name: 'Sarah Jenkins',
    role: 'Senior Master Stylist & Colorist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    rating: 4.9,
    servicesToday: 1,
    totalRevenueToday: 1500,
    commissionRate: 20,
    phone: '+91 98234 56781',
  }
];

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    name: 'Haircut & Styling',
    category: 'Haircut & Styling',
    price: 1500,
    durationMinutes: 45,
    description: 'Bespoke consultation, precision haircut, relaxing shampoo, and blowout finish.',
  },
  {
    id: 'srv-2',
    name: 'Balayage & Highlights',
    category: 'Color & Balayage',
    price: 4500,
    durationMinutes: 120,
    description: 'Custom hand-painted multidimensional blonde/caramel highlights with gloss treatment.',
  },
  {
    id: 'srv-3',
    name: 'Luxury Scalp Detox & Spa',
    category: 'Treatments & Spa',
    price: 2200,
    durationMinutes: 60,
    description: 'Japanese-style head spa, rosemary scalp exfoliation, and steamed botanical mask.',
  },
  {
    id: 'srv-4',
    name: 'Keratin Smoothing Therapy',
    category: 'Texture & Keratin',
    price: 6500,
    durationMinutes: 150,
    description: 'Formaldehyde-free smoothing therapy that eliminates frizz and restores luminous shine.',
  },
  {
    id: 'srv-5',
    name: 'Deluxe Manicure & Nail Care',
    category: 'Beauty & Nails',
    price: 950,
    durationMinutes: 40,
    description: 'Deluxe cuticle treatment, hand massage, shaping, and premium gel coat polish.',
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Pooja Sharma',
    phone: '+91 98765 43210',
    email: 'pooja.sharma@example.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    totalVisits: 1,
    totalSpent: 1500,
    lastVisit: 'Today',
    hairType: 'Straight silky, medium density',
    hairColorFormula: 'Natural Dark Brown - Moroccan Oil Serum finish',
    preferredStylist: 'Sarah Jenkins',
    allergies: 'None reported',
    notes: 'Prefers gentle scalp massage and sulfate-free shampoo.',
    status: 'Sent',
    tags: ['VIP Client'],
  }
];

export const INITIAL_LEDGER: AppointmentLedgerItem[] = [
  {
    id: 'ledg-1',
    staffId: 'staff-1',
    staffName: 'Sarah Jenkins',
    staffAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    customerId: 'cust-1',
    customerName: 'Pooja Sharma',
    customerPhone: '+91 98765 43210',
    customerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    service: 'Haircut & Styling',
    time: '11:00 AM',
    date: 'Today',
    status: 'Completed',
    price: 1500.00,
    paymentStatus: 'Paid',
    notes: 'Precision haircut with blowout styling.'
  }
];

export const INITIAL_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: 'camp-1',
    name: "Festive Sparkle 20% OFF",
    discountBadge: '20% OFF',
    targetAudience: 'All Valued Clients',
    messageTemplate: "✨ Hello {CustomerName}! House of Hairs Saloon brings you 20% OFF on all Haircuts, Styling & Treatments this week. Reply YES to reserve your slot or call us directly! 💇‍♀️",
    isActive: true,
    sentCount: 1
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1001',
    invoiceNumber: 'INV-2026-001',
    customerId: 'cust-1',
    customerName: 'Pooja Sharma',
    customerPhone: '+91 98765 43210',
    staffId: 'staff-1',
    staffName: 'Sarah Jenkins',
    services: [{ name: 'Haircut & Styling', price: 1500.00 }],
    subtotal: 1500.00,
    discount: 0.00,
    tax: 0.00,
    total: 1500.00,
    paymentMethod: 'UPI / GPay',
    date: 'Today',
    time: '11:45 AM',
    status: 'Completed'
  }
];
