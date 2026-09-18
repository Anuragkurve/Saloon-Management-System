import { Customer, Staff, Receptionist, ServiceItem, AppointmentLedgerItem, MarketingCampaign, Invoice } from '../types';

export interface SalonDatabaseExport {
  exportDate: string;
  appVersion: string;
  salonName: string;
  data: {
    customers: Customer[];
    staffList: Staff[];
    receptionists: Receptionist[];
    servicesList: ServiceItem[];
    ledgerItems: AppointmentLedgerItem[];
    campaigns: MarketingCampaign[];
    invoices: Invoice[];
  };
}

// Check if running inside Electron desktop container
export const isElectronDesktop = (): boolean => {
  return typeof window !== 'undefined' && Boolean((window as unknown as { electronAPI?: { isElectron: boolean } }).electronAPI?.isElectron);
};

/**
 * Export complete salon database to local disk
 */
export async function exportDatabaseToDisk(data: SalonDatabaseExport['data']): Promise<{ success: boolean; message: string; filePath?: string }> {
  const exportPayload: SalonDatabaseExport = {
    exportDate: new Date().toISOString(),
    appVersion: '1.0.0',
    salonName: 'House of Hairs Saloon',
    data,
  };

  const jsonStr = JSON.stringify(exportPayload, null, 2);
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `HouseOfHairs-Backup-${dateStr}.json`;

  // Native Electron Disk Save
  const electronAPI = (window as unknown as { electronAPI?: { saveBackup: (data: string, filename: string) => Promise<{ success: boolean; filePath?: string; canceled?: boolean; error?: string }> } }).electronAPI;

  if (electronAPI && typeof electronAPI.saveBackup === 'function') {
    try {
      const res = await electronAPI.saveBackup(jsonStr, filename);
      if (res.canceled) {
        return { success: false, message: 'Export cancelled by user.' };
      }
      if (res.success) {
        return { success: true, message: `Backup saved to ${res.filePath || 'desktop file'}.`, filePath: res.filePath };
      }
      return { success: false, message: res.error || 'Failed to save backup file.' };
    } catch (err: unknown) {
      console.error('Electron save backup failed, falling back to browser download', err);
    }
  }

  // Web / Standalone fallback (Blob download)
  try {
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return { success: true, message: `Database downloaded as ${filename} to your local Downloads folder.` };
  } catch (err: unknown) {
    return { success: false, message: (err as Error)?.message || 'Failed to export backup.' };
  }
}

/**
 * Import and restore salon database from a local .json file
 */
export async function importDatabaseFromDisk(): Promise<{ success: boolean; data?: SalonDatabaseExport['data']; message: string }> {
  // Native Electron Disk Read
  const electronAPI = (window as unknown as { electronAPI?: { loadBackup: () => Promise<{ success: boolean; data?: string; canceled?: boolean; error?: string }> } }).electronAPI;

  if (electronAPI && typeof electronAPI.loadBackup === 'function') {
    try {
      const res = await electronAPI.loadBackup();
      if (res.canceled) {
        return { success: false, message: 'Restore cancelled by user.' };
      }
      if (res.success && res.data) {
        const parsed: SalonDatabaseExport = JSON.parse(res.data);
        if (parsed?.data?.customers && parsed?.data?.staffList) {
          return { success: true, data: parsed.data, message: 'Backup file loaded successfully.' };
        }
        return { success: false, message: 'Invalid backup file structure.' };
      }
      return { success: false, message: res.error || 'Could not read backup file.' };
    } catch (err: unknown) {
      console.error('Electron load backup failed, falling back to browser input', err);
    }
  }

  // Web / Standalone File Picker fallback
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        resolve({ success: false, message: 'No file selected.' });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const parsed = JSON.parse(content);
          const data = parsed.data || parsed;
          if (data.customers && data.staffList) {
            resolve({ success: true, data, message: 'Backup file restored successfully.' });
          } else {
            resolve({ success: false, message: 'Invalid backup format. Please use a valid House of Hairs backup file.' });
          }
        } catch {
          resolve({ success: false, message: 'Failed to parse JSON backup file.' });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  });
}
