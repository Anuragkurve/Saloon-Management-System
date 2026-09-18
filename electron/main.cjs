const { app, BrowserWindow, Menu, shell, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;

// Single instance lock
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  function createWindow() {
    mainWindow = new BrowserWindow({
      title: 'House of Hairs Saloon - Luxury Saloon & Spa Management',
      width: 1360,
      height: 860,
      minWidth: 1024,
      minHeight: 700,
      backgroundColor: '#141824',
      show: false, // Show once ready to avoid white flash
      webPreferences: {
        preload: path.join(__dirname, 'preload.cjs'),
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true,
      },
    });

    // Determine load target (dev server or production build dist/index.html)
    const devUrl = process.env.ELECTRON_START_URL;

    if (devUrl) {
      mainWindow.loadURL(devUrl);
    } else {
      const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
      mainWindow.loadFile(indexPath).catch(() => {
        // Fallback to localhost:3000 if dist is not yet built
        mainWindow.loadURL('http://localhost:3000');
      });
    }

    mainWindow.once('ready-to-show', () => {
      mainWindow.show();
    });

    // Open external links in default system browser
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith('http:') || url.startsWith('https:') || url.startsWith('mailto:') || url.startsWith('tel:')) {
        shell.openExternal(url);
        return { action: 'deny' };
      }
      return { action: 'allow' };
    });

    mainWindow.on('closed', () => {
      mainWindow = null;
    });

    setupAppMenu();
  }

  function setupAppMenu() {
    const isMac = process.platform === 'darwin';

    const template = [
      ...(isMac
        ? [
            {
              label: app.name,
              submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideOthers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' },
              ],
            },
          ]
        : []),
      {
        label: 'File',
        submenu: [
          {
            label: 'Print Active Invoice / Bill',
            accelerator: 'CmdOrCtrl+P',
            click: () => {
              if (mainWindow) {
                mainWindow.webContents.print({ silent: false, printBackground: true });
              }
            },
          },
          { type: 'separator' },
          isMac ? { role: 'close' } : { role: 'quit' },
        ],
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'selectAll' },
        ],
      },
      {
        label: 'View',
        submenu: [
          { role: 'reload' },
          { role: 'forceReload' },
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' },
        ],
      },
      {
        label: 'Window',
        submenu: [
          { role: 'minimize' },
          { role: 'zoom' },
          ...(isMac
            ? [{ type: 'separator' }, { role: 'front' }, { type: 'separator' }, { role: 'window' }]
            : [{ role: 'close' }]),
        ],
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'About House of Hairs',
            click: () => {
              shell.openExternal('https://houseofhairs.com');
            },
          },
        ],
      },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  // Handle IPC for native receipt/bill printing
  ipcMain.handle('print-current-window', () => {
    if (mainWindow) {
      mainWindow.webContents.print({ silent: false, printBackground: true });
      return { success: true };
    }
    return { success: false, error: 'No active window' };
  });

  // Handle thermal POS receipt printing (58mm / 80mm margin-free)
  ipcMain.handle('print-thermal-receipt', (event, options) => {
    if (mainWindow) {
      mainWindow.webContents.print({
        silent: options?.silent || false,
        printBackground: true,
        margins: { marginType: 'none' },
      });
      return { success: true };
    }
    return { success: false, error: 'No active window' };
  });

  // Offline Local Database Backup: Save directly to .json file on local hard drive
  ipcMain.handle('save-backup-file', async (event, jsonData, defaultFilename) => {
    if (!mainWindow) return { success: false, error: 'No active window' };
    const dateStr = new Date().toISOString().split('T')[0];
    const result = await dialog.showSaveDialog(mainWindow, {
      title: 'Save House of Hairs Salon Offline Backup',
      defaultPath: defaultFilename || `HouseOfHairs-OfflineBackup-${dateStr}.json`,
      filters: [{ name: 'JSON Backup (*.json)', extensions: ['json'] }],
    });

    if (result.canceled || !result.filePath) {
      return { success: false, canceled: true };
    }

    try {
      fs.writeFileSync(result.filePath, jsonData, 'utf-8');
      return { success: true, filePath: result.filePath };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  // Offline Local Database Restore: Open and load .json file from local hard drive
  ipcMain.handle('read-backup-file', async () => {
    if (!mainWindow) return { success: false, error: 'No active window' };
    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Select Salon Offline Backup File to Restore',
      filters: [{ name: 'JSON Backup (*.json)', extensions: ['json'] }],
      properties: ['openFile'],
    });

    if (result.canceled || !result.filePaths || result.filePaths.length === 0) {
      return { success: false, canceled: true };
    }

    try {
      const content = fs.readFileSync(result.filePaths[0], 'utf-8');
      return { success: true, data: content, filePath: result.filePaths[0] };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('get-app-info', () => {
    return {
      name: 'House of Hairs Saloon',
      version: app.getVersion(),
      platform: process.platform,
      isElectron: true,
    };
  });

  app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}
