import anime from 'animejs/lib/anime.es.js';

export const animateSidebar = () => {
    const sidebar = document.getElementById('sidebar');

    anime({
        targets: sidebar,
        translateX: [-200, 0],
        duration: 500,
        easing: 'easeInOutQuad'
    });
};

export const hideSidebar = () => {
    const sidebar = document.getElementById('sidebar');

    anime({
        targets: sidebar,
        translateX: [0, -200],
        duration: 500,
        easing: 'easeInOutQuad'
    });
};
