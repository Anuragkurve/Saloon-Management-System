import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, Maximize2, Minimize2, Copy, Check, Monitor, Smartphone, Globe, Sparkles, X } from 'lucide-react';

interface WindowLauncherProps {
  variant?: 'header-button' | 'sidebar-item' | 'banner';
}

export const WindowLauncher: React.FC<WindowLauncherProps> = ({ variant = 'header-button' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      setIsInIframe(true);
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getAppUrl = () => {
    return window.location.href;
  };

  const handleOpenNewTab = () => {
    window.open(getAppUrl(), '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleOpenDedicatedWindow = () => {
    const width = Math.min(1440, window.screen.availWidth - 40);
    const height = Math.min(920, window.screen.availHeight - 40);
    const left = Math.max(0, (window.screen.availWidth - width) / 2);
    const top = Math.max(0, (window.screen.availHeight - height) / 2);

    window.open(
      getAppUrl(),
      'HouseOfHairsWindow',
      `width=${width},height=${height},top=${top},left=${left},status=no,menubar=no,toolbar=no,location=yes,resizable=yes,scrollbars=yes`
    );
    setIsOpen(false);
  };

  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
    }
    setIsOpen(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getAppUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Clipboard copy failed:', err);
    }
  };

  // 1. Iframe Banner Variant
  if (variant === 'banner') {
    if (!isInIframe || bannerDismissed) return null;

    return (
      <div
        id="window-launcher-banner"
        className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white px-3 sm:px-4 py-2 text-xs flex items-center justify-between gap-2 border-b border-purple-800/40 shadow-sm relative z-40 w-full"
      >
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-purple-200 shrink-0">Window Mode:</span>
          <span className="text-slate-200 truncate hidden md:inline">
            Open in any dedicated window or browser tab for maximum screen space & salon POS view.
          </span>
          <span className="text-slate-200 truncate md:hidden">
            Open in dedicated window for best view.
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            id="banner-open-window-btn"
            onClick={handleOpenDedicatedWindow}
            className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 bg-white text-purple-950 font-bold rounded-lg text-xs hover:bg-purple-50 active:scale-95 transition-all shadow-xs shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5 text-purple-700 shrink-0" />
            <span>
              <span className="sm:hidden">Full Window</span>
              <span className="hidden sm:inline">Open in Dedicated Window</span>
            </span>
          </button>
          <button
            onClick={() => setBannerDismissed(true)}
            className="p-1 text-purple-300 hover:text-white rounded-md hover:bg-purple-800/50"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // 2. Sidebar Item Variant
  if (variant === 'sidebar-item') {
    return (
      <div className="pt-2">
        <button
          id="sidebar-launch-window-btn"
          onClick={handleOpenDedicatedWindow}
          className="w-full flex items-center justify-between px-3 py-2 bg-purple-950/40 hover:bg-purple-900/60 border border-purple-700/40 text-purple-200 rounded-xl text-xs font-semibold transition-all group shadow-2xs"
          title="Open application in separate standalone window"
        >
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            <span>Open in Any Window</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-purple-400 opacity-70 group-hover:opacity-100" />
        </button>
      </div>
    );
  }

  // 3. Header Dropdown Button (Default)
  return (
    <div className="relative" ref={menuRef}>
      <button
        id="btn-open-in-window"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
          isOpen
            ? 'bg-purple-50 text-purple-800 border-purple-300 shadow-xs'
            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-2xs'
        }`}
        title="Open app in a new window, browser tab, or monitor"
      >
        <ExternalLink className="w-3.5 h-3.5 text-purple-600" />
        <span className="hidden sm:inline">Open in Window</span>
      </button>

      {isOpen && (
        <div
          id="window-options-dropdown"
          className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-3 py-2 border-b border-slate-100">
            <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5 text-purple-600" />
              Window Options
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Display House of Hairs across any screen or window
            </p>
          </div>

          <div className="py-1.5 space-y-1">
            {/* Dedicated App Window */}
            <button
              onClick={handleOpenDedicatedWindow}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-purple-50/80 transition-colors flex items-start gap-2.5 group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Monitor className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-purple-950">
                    Dedicated Salon Window
                  </span>
                  <span className="text-[10px] bg-purple-100 text-purple-700 font-semibold px-1.5 py-0.5 rounded">
                    POS View
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Launches an independent borderless window for counter desks.
                </p>
              </div>
            </button>

            {/* Standard New Tab */}
            <button
              onClick={handleOpenNewTab}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-2.5 group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                <Globe className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-slate-800 block">
                  Open in New Browser Tab
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Standard browser window tab with full address bar.
                </p>
              </div>
            </button>

            {/* Fullscreen Mode */}
            <button
              onClick={handleToggleFullscreen}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-2.5 group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-slate-800 block">
                  {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen Window'}
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Fill entire monitor for reception kiosk mode.
                </p>
              </div>
            </button>

            {/* Copy Window Link */}
            <button
              onClick={handleCopyLink}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-2.5 group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 block">
                    {copied ? 'Link Copied to Clipboard!' : 'Copy Direct Window Link'}
                  </span>
                  {copied && (
                    <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Paste into Chrome, Edge, iPad, or another display.
                </p>
              </div>
            </button>
          </div>

          <div className="p-2 border-t border-slate-100 bg-slate-50/70 rounded-b-xl text-[10px] text-slate-500 flex items-center justify-between">
            <span>Live URL: {window.location.hostname || 'salon app'}</span>
            <span className="text-purple-600 font-semibold">Any device</span>
          </div>
        </div>
      )}
    </div>
  );
};
