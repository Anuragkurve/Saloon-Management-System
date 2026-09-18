import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Receipt,
  MessageSquare,
  BarChart3,
  Settings,
  Scissors,
  Sparkles,
  CalendarDays,
  IndianRupee,
  X
} from 'lucide-react';
import { WindowLauncher } from './WindowLauncher';
import { formatINR } from '../utils/format';

export type NavTab = 'dashboard' | 'appointments' | 'customers' | 'staff' | 'billing' | 'offers' | 'reports' | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  pendingAppointmentsCount: number;
  activeStaffCount?: number;
  totalSales?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingAppointmentsCount,
  activeStaffCount = 1,
  totalSales = 0,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments' as NavTab, label: 'Appointments', icon: CalendarDays, badge: pendingAppointmentsCount },
    { id: 'customers' as NavTab, label: 'Customers', icon: Users },
    { id: 'staff' as NavTab, label: 'Staff & Reception', icon: UserCheck },
    { id: 'billing' as NavTab, label: 'Billing', icon: Receipt },
    { id: 'offers' as NavTab, label: 'Offers (WhatsApp)', icon: MessageSquare },
    { id: 'reports' as NavTab, label: 'Reports', icon: BarChart3 },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside
        id="main-sidebar"
        className={`w-64 bg-[#141824] text-slate-300 flex flex-col select-none border-r border-slate-800 transition-all duration-200 z-50 ${
          isOpenMobile
            ? 'fixed inset-y-0 left-0 h-screen shadow-2xl translate-x-0'
            : 'hidden lg:flex lg:sticky lg:top-0 lg:h-screen lg:shrink-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-rose-400 flex items-center justify-center text-white shadow-lg shadow-purple-900/30 shrink-0">
              <Scissors className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="overflow-hidden">
              <h1 className="text-white font-bold text-base tracking-tight leading-tight flex items-center gap-1.5">
                House of Hairs
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              </h1>
              <p className="text-[11px] font-medium text-slate-400 tracking-wider uppercase">Luxury Saloon & Spa</p>
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              title="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 group ${
                  isActive
                    ? 'bg-purple-600/20 text-purple-200 border border-purple-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-purple-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-[11px] font-semibold bg-purple-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Info Box */}
        <div className="p-4 border-t border-slate-800/80 bg-[#0f121d] space-y-2">
          {/* Real-time Sales Live Indicator */}
          <div className="bg-slate-800/50 rounded-xl p-2.5 border border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <IndianRupee className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-medium">Real-Time Sales</div>
                <div className="text-xs font-bold text-white tracking-tight">
                  {formatINR(totalSales, true)}
                </div>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" title="Real-time synchronized" />
          </div>

          <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/50">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-slate-400 font-medium">Salon Shift</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Live & Open
              </span>
            </div>
            <div className="text-xs text-slate-300 font-semibold flex items-center justify-between">
              <span>Today's Active Roster</span>
              <span className="text-purple-300">
                {activeStaffCount} Stylist{activeStaffCount === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          <WindowLauncher variant="sidebar-item" />
        </div>
      </aside>
    </>
  );
};
