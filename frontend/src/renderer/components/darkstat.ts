const loadDarkstat = document.getElementById('load-darkstat');
if (loadDarkstat) {
    loadDarkstat.addEventListener('click', () => {
        const container = document.getElementById('darkstat-container');
        const webview = document.createElement('webview');
        webview.src = 'http://localhost:11511/';
        container?.appendChild(webview);
    });
}