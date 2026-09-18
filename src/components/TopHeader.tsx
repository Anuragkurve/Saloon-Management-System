import React, { useState } from 'react';
import { Bell, Plus, Calendar, Sparkles, CheckCircle2, Clock, Menu } from 'lucide-react';
import { AppointmentLedgerItem, Receptionist } from '../types';
import { WindowLauncher } from './WindowLauncher';

interface TopHeaderProps {
  currentTabName: string;
  onOpenBookingModal: () => void;
  onOpenCustomerModal: () => void;
  upcomingAppointments: AppointmentLedgerItem[];
  onToggleMobileMenu?: () => void;
  receptionists?: Receptionist[];
  activeReceptionistId?: string;
  onSelectReceptionist?: (id: string) => void;
  onNavigateToReceptionists?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentTabName,
  onOpenBookingModal,
  onOpenCustomerModal,
  upcomingAppointments,
  onToggleMobileMenu,
  receptionists = [],
  activeReceptionistId,
  onSelectReceptionist,
  onNavigateToReceptionists,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showReceptionistSwitcher, setShowReceptionistSwitcher] = useState(false);

  const activeReceptionist =
    receptionists.find((r) => r.id === activeReceptionistId) ||
    receptionists.find((r) => r.status === 'active') ||
    receptionists[0] ||
    null;

  return (
    <header id="top-header" className="h-16 bg-white border-b border-slate-200/80 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="p-2 -ml-1 text-slate-600 hover:text-slate-900 lg:hidden rounded-lg hover:bg-slate-100 shrink-0"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-base sm:text-xl font-bold text-slate-800 tracking-tight capitalize truncate">
          {currentTabName}
        </h1>
        <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-xs text-slate-600 font-medium shrink-0">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          Today, Sep 13 • Peak Hours
        </span>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Quick Action Buttons */}
        <button
          id="btn-quick-new-customer"
          onClick={onOpenCustomerModal}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          New Client
        </button>

        <button
          id="btn-book-appointment-header"
          onClick={onOpenBookingModal}
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 rounded-lg shadow-sm shadow-purple-600/20 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-200 shrink-0" />
          <span>
            <span className="hidden sm:inline">Book Appointment</span>
            <span className="sm:hidden">Book</span>
          </span>
        </button>

        {/* Window Launcher Quick Action */}
        <WindowLauncher variant="header-button" />

        <div className="h-6 w-[1px] bg-slate-200 mx-0.5 hidden md:block" />

        {/* Receptionist Profile Badge & Switcher */}
        <div className="relative hidden md:block">
          <button
            onClick={() => {
              if (receptionists.length > 1) {
                setShowReceptionistSwitcher(!showReceptionistSwitcher);
              } else if (onNavigateToReceptionists) {
                onNavigateToReceptionists();
              }
            }}
            className="flex items-center gap-2.5 pl-1 py-1 pr-2 rounded-xl hover:bg-slate-100 transition-colors text-left"
            title="Front Desk Receptionist (Click to switch or manage)"
          >
            <div className="relative">
              <img
                src={
                  activeReceptionist?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                }
                alt={activeReceptionist?.name || 'Receptionist'}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-500/30"
              />
              <span
                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                  activeReceptionist?.status === 'active'
                    ? 'bg-emerald-500'
                    : activeReceptionist?.status === 'on_break'
                    ? 'bg-amber-500'
                    : 'bg-slate-400'
                }`}
              />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider leading-none">
                {activeReceptionist?.deskNumber ? activeReceptionist.deskNumber.split(' ')[0] : 'Reception'}
              </p>
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {activeReceptionist?.name || 'Front Desk'}
              </p>
            </div>
          </button>

          {/* Switcher Dropdown */}
          {showReceptionistSwitcher && receptionists.length > 0 && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2 py-1.5 border-b border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700">Front Desk Staff</span>
                <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
                  {receptionists.length} Total
                </span>
              </div>
              <div className="py-1 space-y-1">
                {receptionists.map((rec) => {
                  const isSelected = activeReceptionist?.id === rec.id;
                  return (
                    <button
                      key={rec.id}
                      onClick={() => {
                        if (onSelectReceptionist) {
                          onSelectReceptionist(rec.id);
                        }
                        setShowReceptionistSwitcher(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-colors ${
                        isSelected ? 'bg-purple-50 border border-purple-200/80' : 'hover:bg-slate-50'
                      }`}
                    >
                      <img
                        src={rec.avatar}
                        alt={rec.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-900 truncate">{rec.name}</p>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              rec.status === 'active'
                                ? 'bg-emerald-500'
                                : rec.status === 'on_break'
                                ? 'bg-amber-500'
                                : 'bg-slate-400'
                            }`}
                          />
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">{rec.deskNumber}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              {onNavigateToReceptionists && (
                <div className="pt-1.5 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setShowReceptionistSwitcher(false);
                      onNavigateToReceptionists();
                    }}
                    className="w-full text-center text-xs font-bold text-purple-600 hover:text-purple-700 py-1"
                  >
                    Manage / Add / Delete Receptionists →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            id="notifications-bell-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600 relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
          </button>

          {showNotifications && (
            <div
              id="notifications-dropdown"
              className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-100"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">Live Salon Alerts</span>
                <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                  {upcomingAppointments.length} Today
                </span>
              </div>
              <div className="mt-2 space-y-2 max-h-72 overflow-y-auto">
                {upcomingAppointments.map((app) => (
                  <div key={app.id} className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <div className="flex-1 text-xs">
                      <p className="font-semibold text-slate-800">
                        {app.customerName} <span className="text-slate-500 font-normal">({app.service})</span>
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Stylist: {app.staffName} • {app.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2 mt-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-purple-600 hover:text-purple-700"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
