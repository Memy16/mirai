const filters = document.querySelectorAll('.filters h3');
filters.forEach(f => {
    f.addEventListener('click', () => {
        const target = f.dataset.target;
        const boxes = document.querySelectorAll('.text_box');
        boxes.forEach(box => {
            if(box.classList.contains(target)) {
                box.style.display = 'block';
            } else {
                box.style.display = 'none';
            }
        });
    });
});
