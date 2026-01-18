// burger.js
document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.getElementById('burgerMenu');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;
    
    // Создаем overlay для затемнения фона
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
    
    // Функция открытия/закрытия меню
    function toggleMenu() {
        const isOpening = !navLinks.classList.contains('active');
        
        burgerMenu.classList.toggle('active');
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');
        body.classList.toggle('menu-open', isOpening);
    }
    
    // Обработчик клика по бургеру
    burgerMenu.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });
    
    // Закрытие меню при клике на overlay
    overlay.addEventListener('click', function() {
        toggleMenu();
    });
    
    // Закрытие меню при клике на крестик внутри меню
    const closeButton = document.querySelector('.close-button');
    if (closeButton) {
        closeButton.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });
    }
    
    // Закрытие меню при клике на ссылку (кроме крестика)
    const navLinksItems = navLinks.querySelectorAll('a:not(.close-button)');
    navLinksItems.forEach(link => {
        link.addEventListener('click', function() {
            toggleMenu();
        });
    });
    
    // Закрытие меню при клике вне меню
    document.addEventListener('click', function(e) {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !burgerMenu.contains(e.target)) {
            toggleMenu();
        }
    });
    
    // Закрытие меню при ресайзе окна (на десктоп)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            toggleMenu();
        }
    });
    
    // Закрытие меню при нажатии Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            toggleMenu();
        }
    });
});