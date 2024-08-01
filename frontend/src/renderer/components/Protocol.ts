document.addEventListener('DOMContentLoaded', () => {
    const messages = document.querySelectorAll('.message');
    const darkOverlay = document.getElementById('darkOverlay');

    messages.forEach(message => {
        message.addEventListener('click', () => {
            const messageId = message.getAttribute('data-message');
            const popup = document.getElementById(`popup${messageId}`);
            
            if (popup?.classList.contains('center')) {
                if (darkOverlay !== null) {
                    darkOverlay.style.display = 'block';
                    popup.style.display = 'block';
                }
            } else if (popup !== null) {
                popup.style.display = 'block';
                popup.style.top = `${message.getBoundingClientRect().top}px`;
                popup.style.left = `${message.getBoundingClientRect().left}px`;
            }
        });
    });

    darkOverlay?.addEventListener('click', () => {
        document.querySelectorAll('.popup').forEach(popup => {
            (popup as HTMLElement).style.display = 'none';
        });
        darkOverlay.style.display = 'none';
    });

    document.addEventListener('click', (event) => {
        const target = event.target as Element;
        if (!target.closest('.message') && !target.closest('.popup')) {
            document.querySelectorAll('.popup').forEach(popup => {
                (popup as HTMLElement).style.display = 'none';
            });
            if (darkOverlay !== null) {
                darkOverlay.style.display = 'none';
            }
        }
    });
});
