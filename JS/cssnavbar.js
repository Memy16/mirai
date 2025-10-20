// navbar.js - Efecto de transparencia al hacer scroll
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('mainNavbar');
    
    if (!navbar) {
        console.error('Navbar con ID "mainNavbar" no encontrado');
        return;
    }
    
    let scrollTimeout;
    function handleScroll() {
        // Usar throttling para mejor rendimiento
        if (scrollTimeout) return;
        
        scrollTimeout = setTimeout(() => {
            if (window.scrollY > 50) {
                navbar.classList.add('solid');
            } else {
                navbar.classList.remove('solid');
            }
            scrollTimeout = null;
        }, 10);
    }
    
    // Inicializar
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Establecer estado inicial
    
    console.log('Navbar scroll handler inicializado correctamente');
});