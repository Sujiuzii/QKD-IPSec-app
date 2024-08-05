const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    // 元素选择
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const ipInput = document.getElementById('ipInput') as HTMLInputElement;
    const ipVersion = document.getElementById('ipVersion') as HTMLSelectElement;
    const transferProgress = document.getElementById('transferProgress');
    const fileList = document.getElementById('fileList') as HTMLElement;

    // 从 localStorage 恢复状态
    if (localStorage.getItem('pageState')) {
        const pageState = JSON.parse(localStorage.getItem('pageState') || '{}');
        
        ipInput.value = pageState.ip || '';
        ipVersion.value = pageState.ipVersion || 'IPv4';
        if (transferProgress) {
            transferProgress.style.width = pageState.transferProgress || '0%';
        }

        // 恢复文件列表
        if (pageState.fileList) {
            fileList.innerHTML = pageState.fileList.map((file: any) => `<li>${file}</li>`).join('');
        }

        // 恢复文件输入
        if (pageState.fileName) {
            const fakeFileInput = document.createElement('input');
            fakeFileInput.type = 'file';
            fakeFileInput.files = pageState.file;
            fileInput.files = fakeFileInput.files;
        }
    }

    // 保存状态到 localStorage
    window.addEventListener('beforeunload', () => {
        const fileName = fileInput.files && fileInput.files[0] ? fileInput.files[0].name : null;
        var pageState;
        if (transferProgress) {
            pageState = {
                ip: ipInput.value,
                ipVersion: ipVersion.value,
                transferProgress: transferProgress.style.width,
                fileList: Array.from(fileList.querySelectorAll('li')).map(li => li.textContent),
                fileName: fileName
            };
        } else {
            pageState = {
                ip: ipInput.value,
                ipVersion: ipVersion.value,
                fileList: Array.from(fileList.querySelectorAll('li')).map(li => li.textContent),
                fileName: fileName
            };
        }
        localStorage.setItem('pageState', JSON.stringify(pageState));
    });

    // 监听主进程的消息并清除 localStorage
    ipcRenderer.on('clear-local-storage', () => {
        localStorage.removeItem('pageState');
    });
});
