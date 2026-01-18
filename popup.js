// Управление popup меню
document.addEventListener('DOMContentLoaded', function() {
    const userMenuTrigger = document.getElementById('userMenuTrigger');
    const popupMenu = document.getElementById('popupMenu');
    
    if (userMenuTrigger && popupMenu) {
        // Открытие/закрытие меню
        userMenuTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            userMenuTrigger.classList.toggle('active');
            popupMenu.classList.toggle('show');
        });
        
        // Закрытие меню при клике вне его
        document.addEventListener('click', function(e) {
            if (!userMenuTrigger.contains(e.target) && !popupMenu.contains(e.target)) {
                userMenuTrigger.classList.remove('active');
                popupMenu.classList.remove('show');
            }
        });
        
        // Закрытие меню при нажатии Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                userMenuTrigger.classList.remove('active');
                popupMenu.classList.remove('show');
            }
        });
    }
});