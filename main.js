let slideIndex = 0;
let slideInterval;

// Функция для перехода к определенному слайду
function currentSlide(n) {
  clearInterval(slideInterval);
  showSlides(slideIndex = n);
  startCarousel();
}

// Функция для перехода к следующему/предыдущему слайду
function moveSlide(n) {
  clearInterval(slideInterval);
  showSlides(slideIndex += n);
  startCarousel();
}

// Основная функция отображения слайдов
function showSlides(n) {
  const slides = document.getElementsByClassName("carousel-slide");
  const indicators = document.getElementsByClassName("indicator");
  
  if (n >= slides.length) slideIndex = 0;
  if (n < 0) slideIndex = slides.length - 1;
  
  // Сначала скрываем все слайды
  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.remove("active");
    indicators[i].classList.remove("active");
  }
  
  // Затем показываем нужный слайд
  setTimeout(() => {
    slides[slideIndex].classList.add("active");
    indicators[slideIndex].classList.add("active");
  }, 50);
}

// Функция для автоматической смены слайдов
function startCarousel() {
  slideInterval = setInterval(() => {
    moveSlide(1);
  }, 5000);
}

// Останавливаем карусель при наведении мыши
document.querySelector('.carousel-container').addEventListener('mouseenter', () => {
  clearInterval(slideInterval);
});

// Возобновляем карусель, когда мышь убрали
document.querySelector('.carousel-container').addEventListener('mouseleave', () => {
  startCarousel();
});

// Запускаем карусель при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  // Убедимся, что первый слайд активен
  showSlides(slideIndex);
  startCarousel();
});

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