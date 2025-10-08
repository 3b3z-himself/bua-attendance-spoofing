const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const ProxyServer = require('./proxy-server');

let mainWindow;
let proxyServer;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    resizable: false,
    icon: path.join(__dirname, '../icon.png')
  });

  mainWindow.loadFile('src/renderer/index.html');
  
  // Open DevTools in development
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (proxyServer) {
    proxyServer.stop();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers
ipcMain.handle('start-proxy', async (event, settings) => {
  try {
    if (proxyServer) {
      proxyServer.stop();
    }
    
    proxyServer = new ProxyServer(settings);
    await proxyServer.start();
    
    return { success: true, port: settings.port };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('stop-proxy', async () => {
  try {
    if (proxyServer) {
      proxyServer.stop();
      proxyServer = null;
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-status', async () => {
  return {
    running: proxyServer ? proxyServer.isRunning() : false
  };
});
