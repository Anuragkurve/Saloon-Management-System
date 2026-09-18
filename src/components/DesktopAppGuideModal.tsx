import React, { useState } from 'react';
import {
  X,
  Laptop,
  Check,
  Copy,
  Terminal,
  FolderArchive,
  Monitor,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Printer,
  Zap,
  CheckCircle2,
} from 'lucide-react';

interface DesktopAppGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchStandaloneWindow?: () => void;
}

export const DesktopAppGuideModal: React.FC<DesktopAppGuideModalProps> = ({
  isOpen,
  onClose,
  onLaunchStandaloneWindow,
}) => {
  const [activeOs, setActiveOs] = useState<'windows' | 'mac' | 'linux'>('windows');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const getBuildCommand = () => {
    switch (activeOs) {
      case 'windows':
        return 'npm run build:desktop:win';
      case 'mac':
        return 'npm run build:desktop:mac';
      case 'linux':
        return 'npm run build:desktop:linux';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between relative shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-400/30 flex items-center justify-center text-purple-300">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold">Electron Desktop Application</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Configured & Ready
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Run or package House of Hairs Saloon as a standalone desktop software (.exe / .dmg / .app)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-slate-800">
          {/* Quick Setup Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-purple-50/70 border border-purple-100 rounded-xl p-3">
              <div className="flex items-center gap-2 text-purple-900 font-bold text-xs mb-1">
                <Terminal className="w-3.5 h-3.5 text-purple-600" />
                <span>1. Electron Engine</span>
              </div>
              <p className="text-[11px] text-purple-700">
                Pre-configured with <code className="font-mono bg-purple-100 px-1 py-0.5 rounded">electron@44</code> and <code className="font-mono bg-purple-100 px-1 py-0.5 rounded">electron-builder</code>.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs mb-1">
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>2. Hardware & Print</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Native IPC bridge ready for thermal receipt printers and POS bill printing (<kbd className="font-mono bg-white border border-slate-200 px-1 py-0.5 rounded text-[10px]">Ctrl+P</kbd>).
              </p>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>3. Offline Ready</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                Relative asset paths enabled (<code className="font-mono bg-emerald-100 px-1 py-0.5 rounded">base: './'</code>) for 100% offline desktop launch.
              </p>
            </div>
          </div>

          {/* Platform Tabs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-900">Select Your Target Operating System:</label>
              <span className="text-[11px] text-slate-500">Cross-platform packaging</span>
            </div>

            <div className="flex items-center p-1 bg-slate-100 rounded-xl gap-1">
              <button
                onClick={() => setActiveOs('windows')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeOs === 'windows'
                    ? 'bg-white text-purple-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🪟 Windows (.exe / Portable)</span>
              </button>
              <button
                onClick={() => setActiveOs('mac')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeOs === 'mac'
                    ? 'bg-white text-purple-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🍎 macOS (.dmg / App)</span>
              </button>
              <button
                onClick={() => setActiveOs('linux')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeOs === 'linux'
                    ? 'bg-white text-purple-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🐧 Linux (AppImage / .deb)</span>
              </button>
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              How to Run and Build on Your Computer:
            </h4>

            {/* Step 1 */}
            <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div className="flex-1 space-y-1">
                <p className="text-xs font-bold text-slate-900">Export / Download This Codebase</p>
                <p className="text-xs text-slate-600">
                  In Google AI Studio, open the top-right settings or share menu and click{' '}
                  <strong className="text-slate-800">"Export to ZIP"</strong> or{' '}
                  <strong className="text-slate-800">"Push to GitHub"</strong>. Extract the downloaded ZIP to a folder on your computer.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div className="flex-1 space-y-2">
                <p className="text-xs font-bold text-slate-900">Open Terminal and Install Dependencies</p>
                <div className="flex items-center justify-between bg-slate-900 text-slate-200 px-3 py-2 rounded-lg font-mono text-xs">
                  <span>npm install</span>
                  <button
                    onClick={() => handleCopy('npm install', 'step2')}
                    className="p-1 hover:text-white transition-colors"
                    title="Copy command"
                  >
                    {copiedCmd === 'step2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-900">Launch Desktop App Locally (Live Test)</p>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">Instant Run</span>
                </div>
                <p className="text-xs text-slate-600">
                  Runs the salon window on your PC screen with native menu bar, window frame, and keyboard shortcuts:
                </p>
                <div className="flex items-center justify-between bg-slate-900 text-slate-200 px-3 py-2 rounded-lg font-mono text-xs">
                  <span>npm run electron</span>
                  <button
                    onClick={() => handleCopy('npm run electron', 'step3')}
                    className="p-1 hover:text-white transition-colors"
                    title="Copy command"
                  >
                    {copiedCmd === 'step3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-3 bg-purple-50/80 p-3.5 rounded-xl border border-purple-200">
              <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                4
              </span>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-purple-950">
                    Compile Executable Installer ({activeOs === 'windows' ? '.exe' : activeOs === 'mac' ? '.dmg' : '.AppImage'})
                  </p>
                  <span className="text-[10px] bg-purple-200/80 text-purple-900 px-2 py-0.5 rounded font-bold">Production Build</span>
                </div>
                <p className="text-xs text-purple-800">
                  Builds your final production installer into the <code className="font-mono bg-purple-100 px-1 py-0.5 rounded">dist-electron/</code> folder:
                </p>
                <div className="flex items-center justify-between bg-slate-900 text-emerald-400 px-3 py-2 rounded-lg font-mono text-xs font-semibold">
                  <span>{getBuildCommand()}</span>
                  <button
                    onClick={() => handleCopy(getBuildCommand(), 'step4')}
                    className="p-1 text-slate-300 hover:text-white transition-colors"
                    title="Copy command"
                  >
                    {copiedCmd === 'step4' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pre-configured Project Files Summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
            <h5 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <FolderArchive className="w-3.5 h-3.5 text-slate-600" />
              Files Created & Configured in this Repository:
            </h5>
            <ul className="text-xs text-slate-600 space-y-1.5">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <code className="font-mono text-[11px] text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200">electron/main.cjs</code>
                <span>Main window lifecycle, native salon menu, single-instance lock, print handlers.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <code className="font-mono text-[11px] text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200">electron/preload.cjs</code>
                <span>Secure context isolation bridge exposing native desktop APIs safely to the UI.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <code className="font-mono text-[11px] text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200">vite.config.ts</code>
                <span>Set <code className="text-purple-700 font-mono">base: './'</code> so assets load without server dependencies.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <code className="font-mono text-[11px] text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200">package.json</code>
                <span>Configured with <code className="text-purple-700 font-mono">electron-builder</code> packaging targets for Windows, Mac, and Linux.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Monitor className="w-3.5 h-3.5 text-purple-600" />
            <span>Want to test standalone salon mode right now?</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onLaunchStandaloneWindow && (
              <button
                onClick={() => {
                  onLaunchStandaloneWindow();
                  onClose();
                }}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Launch POS Window Now</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
