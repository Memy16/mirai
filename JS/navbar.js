// JavaScript para manejar el menú hamburguesa 

document.addEventListener('DOMContentLoaded', () => {
    const navbarToggle = document.getElementById('navbarToggle');
    const navbarMenu = document.getElementById('navbarColor03');
    
    navbarToggle.addEventListener('click', () => {
        navbarMenu.classList.toggle('collapse'); 
    });
});