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
    const indexPath = path.join(__dirname, '..', 'dist', 'index.html');

    if (devUrl) {
      mainWindow.loadURL(devUrl).catch(() => {
        mainWindow.loadURL('http://localhost:3000');
      });
    } else if (fs.existsSync(indexPath)) {
      mainWindow.loadFile(indexPath);
    } else {
      // If dist folder is not compiled yet, attempt to connect to Vite dev server, or display a helpful onboarding screen
      mainWindow.loadURL('http://localhost:3000').catch(() => {
        const errorHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>House of Hairs Saloon - Quick Setup</title>
              <style>
                body {
                  margin: 0;
                  padding: 40px;
                  background-color: #0f172a;
                  color: #f8fafc;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  min-height: 85vh;
                }
                .card {
                  max-width: 580px;
                  background: #1e293b;
                  border: 1px solid #334155;
                  border-radius: 16px;
                  padding: 32px;
                  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
                }
                h1 { margin: 0 0 12px; font-size: 22px; color: #a855f7; }
                p { margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #cbd5e1; }
                code {
                  background: #090d16;
                  padding: 3px 8px;
                  border-radius: 6px;
                  color: #38bdf8;
                  font-family: monospace;
                  font-size: 13px;
                }
                .cmd-box {
                  background: #090d16;
                  border: 1px solid #1e293b;
                  border-radius: 8px;
                  padding: 14px;
                  margin: 16px 0;
                  font-family: monospace;
                  font-size: 13px;
                  color: #4ade80;
                }
                .btn {
                  display: inline-block;
                  background: #9333ea;
                  color: #fff;
                  border: none;
                  padding: 10px 18px;
                  border-radius: 8px;
                  font-weight: 600;
                  cursor: pointer;
                  margin-top: 10px;
                }
              </style>
            </head>
            <body>
              <div class="card">
                <h1>Salon Files Need Building First</h1>
                <p>The desktop app couldn't find the compiled <code>dist/index.html</code> file on your computer.</p>
                <p>Please run the following command in your terminal inside the project folder:</p>
                <div class="cmd-box">
                  npm run build<br>
                  npm run electron
                </div>
                <p>Or if you want to run with live hot-reloading development server:</p>
                <div class="cmd-box">
                  npm run dev:desktop
                </div>
                <button class="btn" onclick="location.reload()">Reload App</button>
              </div>
            </body>
          </html>
        `;
        mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(errorHtml)}`);
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
