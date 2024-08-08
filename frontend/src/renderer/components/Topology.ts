document.addEventListener('DOMContentLoaded', () => {
    const topologyElements = document.querySelectorAll('.topopopup');
    const popupContainer = document.getElementById('popup-container') as HTMLDivElement;
    const popupCloseButton = document.getElementById('popup-close') as HTMLButtonElement;
    const popupRefreshButton = document.getElementById('popup-refresh') as HTMLButtonElement;
    const popupContent = document.getElementById('popup-content') as Electron.WebviewTag;

    topologyElements.forEach(element => {
        element.addEventListener('click', () => {
            const url = (element as HTMLElement).dataset.url;
            if (url) {
                popupContent.src = url;
                popupContainer.classList.remove('hidden');
            }
        });
    });

    popupCloseButton.addEventListener('click', () => {
        popupContainer.classList.add('hidden');
    });

    popupRefreshButton.addEventListener('click', () => {
        popupContent.reload();
    });
});

