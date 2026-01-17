import { app, BrowserWindow, Menu, Tray } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

let mainWindow: BrowserWindow | null;
let tray;
let isQuitting = false;
let trayIconPath = "";

function createWindow() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  mainWindow.loadFile(path.join(__dirname, '../../build/index.html'));
  trayIconPath = path.join(__dirname, '../../build/TrayIcon.png');
  
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });
}

app.whenReady().then(() => {

  createWindow();

  tray = new Tray(path.join(trayIconPath));

  const trayMenu = Menu.buildFromTemplate([
    {
      label: "Show app",
      click: () => {
        mainWindow?.show();
      },
    },
    {
      label: "Quit",
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip("Moja aplikacja Electron");
  tray.setContextMenu(trayMenu);

  // Kliknięcie ikony → pokaż okno
  tray.on("click", () => {
    mainWindow?.isVisible() ? mainWindow.hide() : mainWindow?.show();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});