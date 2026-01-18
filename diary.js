// Глобальная переменная для данных
let scheduleData = {};

// Функция для загрузки JSON
async function loadScheduleData() {
    try {
        const response = await fetch('schedule.json');
        if (!response.ok) {
            throw new Error('Ошибка загрузки данных');
        }
        scheduleData = await response.json();
        console.log('Данные успешно загружены', scheduleData);
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        // Запасные данные на случай ошибки
        scheduleData = {
            "2023-09-18": { lessons: [] },
            "2023-09-19": { lessons: [] },
            "2023-09-20": { lessons: [] },
            "2023-09-21": { lessons: [] },
            "2023-09-22": { lessons: [] },
            "2023-09-23": { lessons: [] },
            "2023-09-24": { lessons: [] }
        };
    }
}

// Функционал переключения недель и календаря
document.addEventListener('DOMContentLoaded', async function() {
    // Загружаем данные сначала
    await loadScheduleData();
    
    const prevWeekBtn = document.querySelector('.prev-week');
    const nextWeekBtn = document.querySelector('.next-week');
    const weekDisplay = document.querySelector('.week-display');
    const weekDaysContainer = document.getElementById('weekDays');
    const dateSelector = document.getElementById('dateSelector');
    const dateSelectorBtn = document.querySelector('.date-selector-btn');
    const calendarContainer = document.querySelector('.date-selector-calendar');
    const currentMonthElement = document.querySelector('.current-month');
    const prevMonthBtn = document.querySelector('.prev-month');
    const nextMonthBtn = document.querySelector('.next-month');
    
    // Текущая дата для примера
    let currentDate = new Date(2023, 8, 19); // 19 сентября 2023
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    // Функция для обновления отображения недели
    function updateWeekDisplay() {
        const startOfWeek = new Date(currentDate);
        // Находим понедельник текущей недели
        const dayOfWeek = startOfWeek.getDay();
        const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const startStr = startOfWeek.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
        const endStr = endOfWeek.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
        
        weekDisplay.textContent = `${startStr} - ${endStr}`;
        
        // Очищаем контейнер с днями
        weekDaysContainer.innerHTML = '';
        
        // Генерируем дни недели
        for (let i = 0; i < 7; i++) {
            const dayDate = new Date(startOfWeek);
            dayDate.setDate(startOfWeek.getDate() + i);
            
            const dateString = formatDate(dayDate);
            const dayData = scheduleData[dateString] || { lessons: [] };
            
            const dayCard = createDayCard(dayDate, dayData.lessons);
            weekDaysContainer.appendChild(dayCard);
        }
    }
    
    // Функция для создания карточки дня через DOM API
    function createDayCard(date, lessons) {
        const dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        const dayName = dayNames[date.getDay()];
        const dateString = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
        
        // Создаем основную карточку дня
        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';
        
        // Создаем заголовок дня
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        
        const dayTitle = document.createElement('div');
        dayTitle.className = 'day-title';
        dayTitle.textContent = dayName;
        
        const dayDateElement = document.createElement('div');
        dayDateElement.className = 'day-date';
        dayDateElement.textContent = dateString;
        
        dayHeader.appendChild(dayTitle);
        dayHeader.appendChild(dayDateElement);
        
        // Создаем контейнер для уроков
        const lessonsContainer = document.createElement('div');
        lessonsContainer.className = 'lessons-container';
        
        if (lessons.length > 0) {
            lessons.forEach(lesson => {
                const lessonElement = createLessonElement(lesson);
                lessonsContainer.appendChild(lessonElement);
            });
        } else {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'empty-day';
            
            const coffeeIcon = document.createElement('i');
            coffeeIcon.className = 'fas fa-coffee';
            coffeeIcon.style.fontSize = '4rem';
            
            const emptyText = document.createElement('p');
            emptyText.textContent = 'Выходной день';
            emptyText.style.fontSize = '2rem';
            
            emptyDay.appendChild(coffeeIcon);
            emptyDay.appendChild(emptyText);
            lessonsContainer.appendChild(emptyDay);
        }
        
        // Собираем карточку
        dayCard.appendChild(dayHeader);
        dayCard.appendChild(lessonsContainer);
        
        return dayCard;
    }
    
    // Функция для создания элемента урока через DOM API
    function createLessonElement(lesson) {
        const lessonElement = document.createElement('div');
        lessonElement.className = 'lesson';
        
        // Создаем блок времени и предмета
        const timeSubject = document.createElement('div');
        timeSubject.className = 'lesson-time-subject';
        
        const subject = document.createElement('div');
        subject.className = 'lesson-subject';
        subject.textContent = lesson.subject;
        
        const time = document.createElement('div');
        time.className = 'lesson-time';
        time.textContent = lesson.time;
        
        const teacher = document.createElement('div');
        teacher.className = 'lesson-teacher';
        teacher.textContent = lesson.teacher;
        
        timeSubject.appendChild(subject);
        timeSubject.appendChild(time);
        timeSubject.appendChild(teacher);
        
        // Создаем блок домашнего задания
        const homework = document.createElement('div');
        homework.className = 'lesson-homework';
        if (lesson.homework) {
            homework.textContent = lesson.homework;
        } else {
            homework.textContent = 'Домашнее задание отсутствует';
            homework.classList.add('no-homework');
        }
        
        // Создаем блок оценки
        const gradeContainer = document.createElement('div');
        gradeContainer.className = 'lesson-grade';
        
        if (lesson.grade) {
            const gradeBadge = document.createElement('div');
            gradeBadge.className = `grade-badge grade-${lesson.grade}`;
            gradeBadge.textContent = lesson.grade;
            gradeContainer.appendChild(gradeBadge);
        }
        
        // Собираем урок
        lessonElement.appendChild(timeSubject);
        lessonElement.appendChild(homework);
        lessonElement.appendChild(gradeContainer);
        
        return lessonElement;
    }
    
    // Функция для форматирования даты в YYYY-MM-DD
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    // Функция для генерации календаря
    function generateCalendar(month, year) {
        calendarContainer.innerHTML = '';
        
        // Добавляем дни недели
        const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        weekdays.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-weekday';
            dayElement.textContent = day;
            calendarContainer.appendChild(dayElement);
        });
        
        // Первый день месяца
        const firstDay = new Date(year, month, 1);
        // Последний день месяца
        const lastDay = new Date(year, month + 1, 0);
        
        // Дни предыдущего месяца
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        const firstDayIndex = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
        
        // Обновляем отображение месяца и года
        const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
                           'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        currentMonthElement.textContent = `${monthNames[month]} ${year}`;
        
        // Добавляем дни предыдущего месяца
        for (let i = firstDayIndex; i > 0; i--) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day other-month';
            dayElement.textContent = prevMonthLastDay - i + 1;
            calendarContainer.appendChild(dayElement);
        }
        
        // Добавляем дни текущего месяца
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = i;
            
            // Проверяем, является ли день текущим
            if (month === currentDate.getMonth() && year === currentDate.getFullYear() && i === currentDate.getDate()) {
                dayElement.classList.add('current');
            }
            
            // Обработчик выбора дня
            dayElement.addEventListener('click', function() {
                currentDate = new Date(year, month, i);
                updateWeekDisplay();
                dateSelector.classList.remove('open');
                
                // Снимаем выделение с предыдущего дня
                document.querySelectorAll('.calendar-day.current').forEach(day => {
                    day.classList.remove('current');
                });
                
                // Выделяем новый день
                this.classList.add('current');
            });
            
            calendarContainer.appendChild(dayElement);
        }
        
        // Добавляем дни следующего месяца
        const daysLeft = 42 - (firstDayIndex + lastDay.getDate()); // 6 строк по 7 дней
        for (let i = 1; i <= daysLeft; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day other-month';
            dayElement.textContent = i;
            calendarContainer.appendChild(dayElement);
        }
    }
    
    // Обработчики для кнопок переключения недели
    prevWeekBtn.addEventListener('click', function() {
        currentDate.setDate(currentDate.getDate() - 7);
        updateWeekDisplay();
    });
    
    nextWeekBtn.addEventListener('click', function() {
        currentDate.setDate(currentDate.getDate() + 7);
        updateWeekDisplay();
    });
    
    // Обработчик для открытия/закрытия календаря
    dateSelectorBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        dateSelector.classList.toggle('open');
    });
    
    // Закрытие календаря при клике вне его
    document.addEventListener('click', function(e) {
        if (!dateSelector.contains(e.target)) {
            dateSelector.classList.remove('open');
        }
    });
    
    // Обработчики для переключения месяцев в календаре
    prevMonthBtn.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentMonth, currentYear);
    });
    
    nextMonthBtn.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
    });
    
    // Инициализация
    updateWeekDisplay();
    generateCalendar(currentMonth, currentYear);
});