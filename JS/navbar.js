// JavaScript para manejar el menú hamburguesa 

document.addEventListener('DOMContentLoaded', () => {
    const navbarToggle = document.getElementById('navbarToggle');
    const navbarMenu = document.getElementById('navbarColor03');
    
    navbarToggle.addEventListener('click', () => {
        navbarMenu.classList.toggle('collapse'); 
    });
});

// Modo claro y oscuro

const lightBtn = document.querySelector('.light_mode');

    lightBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');

      const img = lightBtn.querySelector('img');
      if(document.body.classList.contains('dark-mode')) {
        img.src = './assets/img/modo-claro.png';
      } else {
        img.src = './assets/img/modo-oscuro.png';
      }
    });