const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    fetch: (url: string) => ipcRenderer.invoke('fetch', url),
});
