// Script para el filtrado de eventos
        document.addEventListener('DOMContentLoaded', function() {
            const filterButtons = document.querySelectorAll('.filter-btn');
            const eventItems = document.querySelectorAll('.event-item');
            
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Remover clase activa de todos los botones
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    
                    // Agregar clase activa al botón clickeado
                    this.classList.add('active');
                    
                    const filterValue = this.getAttribute('data-filter');
                    
                    // Filtrar eventos
                    eventItems.forEach(item => {
                        if (filterValue === 'all') {
                            item.classList.remove('hidden');
                        } else {
                            const categories = item.getAttribute('data-categories').split(' ');
                            if (categories.includes(filterValue)) {
                                item.classList.remove('hidden');
                            } else {
                                item.classList.add('hidden');
                            }
                        }
                    });
                });
            });
        });
// cambia cuando das click en mas info
        document.querySelectorAll(".evntosinfo-btn").forEach(btn => {
    btn.addEventListener("click", () => {
    const target = document.getElementById(btn.dataset.target);
    const open = target.classList.toggle("open");
    btn.textContent = open ? "menos info" : "mas info";
  });
});
