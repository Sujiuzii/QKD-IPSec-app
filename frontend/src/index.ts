import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
const axios = require('axios');

let mainWindow: BrowserWindow | null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1600,
        height: 1020,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            webviewTag: true // 启用 webview 标签
        },
    });

    mainWindow.loadFile(path.join(__dirname, '../pages/index.html'));

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

//     mainWindow.on('close', async (e) => {
//     e.preventDefault();
//     mainWindow?.webContents.send('clear-local-storage');
//     app.quit();
//   });
}

app.on('ready', createWindow);
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.handle('fetch', async (event, url: string) => {
    const response = await fetch(url);
    return response.json();
});

ipcMain.on('fetch-darkstat-data', async (event) => {
  try {
    const response = await axios.get('http://localhost:11511/'); // darkstat URL
    console.log('Darkstat response data:', response.data); // 添加日志
    event.reply('darkstat-data', response.data);
  } catch (error: any) {
    console.error('Error fetching darkstat data:', error);
    event.reply('darkstat-data-error', error.message);
  }
});