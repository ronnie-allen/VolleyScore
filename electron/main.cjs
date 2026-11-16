const { app, BrowserWindow, protocol, net } = require('electron');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const OUT_ROOT = path.join(__dirname, '..', 'out');

// Resolve a URL path to a static file inside out/. Falls back to index.html
// so client-side routes (Next app router) work under a custom scheme.
function resolveOutFile(pathname) {
  const relative = decodeURIComponent(pathname.replace(/^\/+/, ''));
  const base = path.join(OUT_ROOT, relative);
  const candidates = [
    base,
    `${base}.html`,
    path.join(base, 'index.html'),
    path.join(OUT_ROOT, 'index.html'),
  ];
  for (const candidate of candidates) {
    // Block path traversal outside OUT_ROOT.
    if (!candidate.startsWith(OUT_ROOT)) continue;
    try {
      if (fs.statSync(candidate).isFile()) return candidate;
    } catch {
      // try next candidate
    }
  }
  return path.join(OUT_ROOT, 'index.html');
}

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'volleytracker',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
    },
  },
]);

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 640,
    title: 'VolleyTracker',
    backgroundColor: '#070B18',
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.loadURL('volleytracker://app/');
}

app.whenReady().then(() => {
  protocol.handle('volleytracker', (request) => {
    const url = new URL(request.url);
    return net.fetch(pathToFileURL(resolveOutFile(url.pathname)).toString());
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
