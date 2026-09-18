import React from 'react';
import { IndianRupee, Sparkles, UserPlus, Users, ArrowUpRight } from 'lucide-react';
import { formatINR } from '../utils/format';

interface DailyOverviewProps {
  totalSales: number;
  servicesCount: number;
  newCustomersCount: number;
  activeStaffCount: number;
}

export const DailyOverview: React.FC<DailyOverviewProps> = ({
  totalSales,
  servicesCount,
  newCustomersCount,
  activeStaffCount,
}) => {
  const cards = [
    {
      id: 'stat-total-sales',
      label: 'Total Sales',
      value: formatINR(totalSales, true),
      growth: 'Live POS register',
      icon: IndianRupee,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: 'stat-services',
      label: 'Services',
      value: servicesCount.toString(),
      growth: 'Completed today',
      icon: Sparkles,
      iconBg: 'bg-purple-50 text-purple-600',
    },
    {
      id: 'stat-new-customers',
      label: 'New Customers',
      value: newCustomersCount.toString(),
      growth: 'Registered clients',
      icon: UserPlus,
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      id: 'stat-active-staff',
      label: 'Active Staff',
      value: activeStaffCount.toString(),
      growth: 'Stylists on shift',
      icon: Users,
      iconBg: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <section id="daily-overview-section" className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-slate-800 tracking-tight">Daily Overview</h2>
        <span className="text-xs font-medium text-slate-500">Real-time salon registers</span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              id={card.id}
              className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200/90 shadow-xs hover:border-purple-300/80 transition-all overflow-hidden"
            >
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <span className="text-xs font-semibold text-slate-500 truncate">{card.label}</span>
                <span className={`w-7 h-7 rounded-lg ${card.iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className="w-4 h-4" />
                </span>
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight truncate">
                {card.value}
              </div>
              <div className="mt-1.5 sm:mt-2 flex items-center text-[10px] sm:text-[11px] font-medium text-emerald-600 gap-0.5 truncate">
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{card.growth}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
