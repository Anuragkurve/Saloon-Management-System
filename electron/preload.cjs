const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// IPC channels without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  printWindow: () => ipcRenderer.invoke('print-current-window'),
  printThermalReceipt: (options) => ipcRenderer.invoke('print-thermal-receipt', options),
  saveBackup: (jsonData, defaultFilename) => ipcRenderer.invoke('save-backup-file', jsonData, defaultFilename),
  loadBackup: () => ipcRenderer.invoke('read-backup-file'),
  getAppInfo: () => ipcRenderer.invoke('get-app-info'),
});
