/*!
* Start Bootstrap - Simple Sidebar v6.0.6 (https://startbootstrap.com/template/simple-sidebar)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-simple-sidebar/blob/master/LICENSE)
*/
// 
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
            document.body.classList.toggle('sb-sidenav-toggled');
        }

        const updateButtonText = () => {
            if (document.body.classList.contains('sb-sidenav-toggled')) {
                sidebarToggle.innerHTML = '<i class="fa fa-angle-double-right" aria-hidden="true"></i>';
            } else {
                sidebarToggle.innerHTML = '<i class="fa fa-angle-double-left" aria-hidden="true"></i>';
            }
        };

        // Initial button text update
        updateButtonText();

        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled').toString());
            updateButtonText();
        });
    }

});
