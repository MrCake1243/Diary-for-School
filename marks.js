// marks.js - Объединённая версия с таблицей и карточками статистики

// Функция для расчета среднего балла
function calculateAverage(grades) {
    if (grades.length === 0) return 0;
    const sum = grades.reduce((total, grade) => total + grade, 0);
    return (sum / grades.length).toFixed(2);
}

// Функция для расчета итоговой оценки на основе среднего балла
function calculateFinalGrade(average) {
    const avg = parseFloat(average);
    if (avg >= 4.6) return 5;
    if (avg >= 3.6) return 4;
    if (avg >= 2.6) return 3;
    return 2;
}

// Функция для рисования круговой диаграммы
// Функция для рисования диаграммы-пончика
function drawDonutChart(canvasId, data, colors, centerValue) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outerRadius = Math.min(centerX, centerY) - 5;
    const innerRadius = outerRadius * 0.6; // Внутренний радиус для эффекта пончика
    
    // Очищаем canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const total = data.reduce((sum, value) => sum + value, 0);
    if (total === 0) {
        // Рисуем серый круг если нет данных
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
        ctx.arc(centerX, centerY, innerRadius, 2 * Math.PI, 0, true);
        ctx.closePath();
        ctx.fillStyle = '#e0e0e0';
        ctx.fill();
        return;
    }
    
    let startAngle = -Math.PI / 2; // Начинаем с верха
    
    data.forEach((value, index) => {
        if (value === 0) return; // Пропускаем нулевые значения
        
        const sliceAngle = (value / total) * 2 * Math.PI;
        const endAngle = startAngle + sliceAngle;
        
        // Рисуем сегмент пончика
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
        ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
        ctx.closePath();
        
        ctx.fillStyle = colors[index];
        ctx.fill();
        
        // Добавляем обводку для лучшего визуального разделения
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        startAngle = endAngle;
    });
    
    // Центральный круг (опционально, для чистого пончика)
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
}

// Обновлённая функция для обновления карточки с оценками
function updateGradesCard(grades) {
    const count5 = grades.filter(grade => grade === 5).length;
    const count4 = grades.filter(grade => grade === 4).length;
    const count3 = grades.filter(grade => grade === 3).length;
    const count2 = grades.filter(grade => grade === 2).length;
    
    document.getElementById('count-5').textContent = count5;
    document.getElementById('count-4').textContent = count4;
    document.getElementById('count-3').textContent = count3;
    document.getElementById('count-2').textContent = count2;
    
    const average = calculateAverage(grades);
    document.getElementById('average-grade').textContent = average;
    
    // Рисуем диаграмму-пончик оценок
    drawDonutChart('grades-chart', [count5, count4, count3, count2], 
                  ['#42D94D', '#8EBF4E', '#FFB742', '#FF4E42'], average);
}

// Обновлённая функция для обновления карточки с посещаемостью
function updateAttendanceCard(attendance) {
    const visited = attendance.visited || 0;
    const missed = attendance.missed || 0;
    const sick = attendance.sick || 0;
    const absent = attendance.absent || 0;
    
    document.getElementById('count-visited').textContent = visited;
    document.getElementById('count-missed').textContent = missed;
    document.getElementById('count-sick').textContent = sick;
    document.getElementById('count-absent').textContent = absent;
    
    const total = visited + missed + sick + absent;
    const percent = total > 0 ? Math.round((visited / total) * 100) : 0;
    document.getElementById('attendance-percent').textContent = percent + '%';
    
    // Рисуем диаграмму-пончик посещаемости
    drawDonutChart('attendance-chart', [visited, missed, sick, absent], 
                  ['#3C1FB4', '#951FB4', '#1FAFB4', '#75142C'], percent + '%');
}

// Функция для получения всех оценок из данных четверти
function getAllGradesFromQuarter(subjects) {
    let allGrades = [];
    for (const subject in subjects) {
        allGrades = allGrades.concat(subjects[subject].grades);
    }
    return allGrades;
}

// // Функция для получения всех оценок за все четверти (ничего не ссылается на данную функцию)
// function getAllGradesFromAllQuarters(quarters) {
//     let allGrades = [];
//     for (const quarter in quarters) {
//         const quarterGrades = getAllGradesFromQuarter(quarters[quarter].subjects);
//         allGrades = allGrades.concat(quarterGrades);
//     }
//     return allGrades;
// }

// Функция для получения суммарной посещаемости за все четверти
function getTotalAttendance(quarters) {
    const total = { visited: 0, missed: 0, sick: 0, absent: 0 };
    for (const quarter in quarters) {
        const attendance = quarters[quarter].attendance;
        total.visited += attendance.visited || 0;
        total.missed += attendance.missed || 0;
        total.sick += attendance.sick || 0;
        total.absent += attendance.absent || 0;
    }
    return total;
}

// Функция для заполнения таблицы оценками
function fillGradesTable(subjects) {
    const tableBody = document.getElementById('grades-table-body');
    const mobileContainer = document.getElementById('mobile-cards-container');
    
    // Очищаем контейнеры перед заполнением
    tableBody.innerHTML = '';
    if (mobileContainer) {
        mobileContainer.innerHTML = '';
    }
    
    for (const [subject, data] of Object.entries(subjects)) {
        const average = calculateAverage(data.grades);
        const finalGrade = calculateFinalGrade(average);
        
        // Создаем строку для обычной таблицы
        const row = document.createElement('tr');
        
        // Название предмета
        const subjectCell = document.createElement('td');
        subjectCell.textContent = subject;
        row.appendChild(subjectCell);
        
        // Оценки
        const gradesCell = document.createElement('td');
        const gradesContainer = document.createElement('div');
        gradesContainer.className = 'grades-container';
        
        data.grades.forEach(grade => {
            const gradeElement = document.createElement('div');
            gradeElement.className = `grade grade-${grade}`;
            gradeElement.textContent = grade;
            gradesContainer.appendChild(gradeElement);
        });
        
        gradesCell.appendChild(gradesContainer);
        row.appendChild(gradesCell);
        
        // Средний балл
        const averageCell = document.createElement('td');
        averageCell.className = 'average-score';
        averageCell.textContent = average;
        row.appendChild(averageCell);
        
        // Итоговая оценка в таблице
        const finalGradeCell = document.createElement('td');
        finalGradeCell.className = 'final-grade';
        finalGradeCell.textContent = finalGrade;
        row.appendChild(finalGradeCell);
        
        tableBody.appendChild(row);
        
        // Создаем карточку для мобильной версии
        if (mobileContainer) {
            const card = document.createElement('div');
            card.className = 'card';
            
            // Секция "Предмет"
            const subjectSection = document.createElement('div');
            subjectSection.className = 'card-section';
            
            const subjectHeader = document.createElement('div');
            subjectHeader.className = 'card-header';
            subjectHeader.textContent = 'Предмет';
            
            const subjectContent = document.createElement('div');
            subjectContent.className = 'card-content';
            
            const subjectName = document.createElement('div');
            subjectName.className = 'subject-name';
            subjectName.textContent = subject;
            
            subjectContent.appendChild(subjectName);
            subjectSection.appendChild(subjectHeader);
            subjectSection.appendChild(subjectContent);
            
            // Секция "Оценки"
            const gradesSection = document.createElement('div');
            gradesSection.className = 'card-section';
            
            const gradesHeader = document.createElement('div');
            gradesHeader.className = 'card-header';
            gradesHeader.textContent = 'Оценки';
            
            const gradesContent = document.createElement('div');
            gradesContent.className = 'card-content';
            
            const cardGrades = document.createElement('div');
            cardGrades.className = 'card-grades';
            
            data.grades.forEach(grade => {
                const gradeElement = document.createElement('div');
                gradeElement.className = `mobile-grade grade-${grade}`;
                gradeElement.textContent = grade;
                cardGrades.appendChild(gradeElement);
            });
            
            gradesContent.appendChild(cardGrades);
            gradesSection.appendChild(gradesHeader);
            gradesSection.appendChild(gradesContent);
            
            // Секция "Средний балл"
            const averageSection = document.createElement('div');
            averageSection.className = 'card-section';
            
            const averageHeader = document.createElement('div');
            averageHeader.className = 'card-header';
            averageHeader.textContent = 'Средний балл';
            
            const averageContent = document.createElement('div');
            averageContent.className = 'card-content';
            
            const averageMobile = document.createElement('div');
            averageMobile.className = 'average-score-mobile';
            averageMobile.textContent = average;
            
            averageContent.appendChild(averageMobile);
            averageSection.appendChild(averageHeader);
            averageSection.appendChild(averageContent);
            
            // Секция "Итоговая оценка"
            const finalGradeSection = document.createElement('div');
            finalGradeSection.className = 'card-section';
            
            const finalGradeHeader = document.createElement('div');
            finalGradeHeader.className = 'card-header';
            finalGradeHeader.textContent = 'Итоговая оценка';
            
            const finalGradeContent = document.createElement('div');
            finalGradeContent.className = 'card-content';
            
            // Итоговая оценка в мобильной версии
            const finalGradeMobile = document.createElement('div');
            finalGradeMobile.className = 'final-grade-mobile';
            finalGradeMobile.textContent = finalGrade;
            finalGradeContent.appendChild(finalGradeMobile);
            finalGradeSection.appendChild(finalGradeHeader);
            finalGradeSection.appendChild(finalGradeContent);
            
            // Собираем карточку
            card.appendChild(subjectSection);
            card.appendChild(gradesSection);
            card.appendChild(averageSection);
            card.appendChild(finalGradeSection);
            mobileContainer.appendChild(card);
        }
    }
}

// Функция для загрузки данных и отображения статистики
async function loadStudentData() {
    let studentData;
    
    try {
        const response = await fetch('marks.json');
        if (!response.ok) throw new Error('Ошибка загрузки данных');
        studentData = await response.json();
        console.log('Данные успешно загружены', studentData);
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        // Используем запасные данные в старой структуре
        studentData = {
  "studentId": 12345,
  "quarters": {
    "1": {
      "subjects": {
        "Математика": {
          "grades": [
            3,
            3,
            3,
            3,
            3,
            3,
            4,
            5,
            5,
            5
          ],
          "dates": [
            "2023-09-01",
            "2023-09-08",
            "2023-09-15",
            "2023-09-22",
            "2023-09-29",
            "2023-10-06",
            "2023-10-13",
            "2023-10-14",
            "2023-11-05",
            "2023-11-07"
          ]
        },
        "Русский язык": {
          "grades": [
            3,
            3,
            3,
            3,
            3,
            3,
            4
          ],
          "dates": [
            "2023-09-02",
            "2023-09-09",
            "2023-09-16",
            "2023-09-23",
            "2023-09-30",
            "2023-10-07",
            "2023-10-14"
          ]
        },
        "Физика": {
          "grades": [
            3,
            3,
            3,
            3,
            3,
            3
          ],
          "dates": [
            "2023-09-03",
            "2023-09-10",
            "2023-09-17",
            "2023-09-24",
            "2023-10-01",
            "2023-10-08"
          ]
        },
        "Информатика": {
          "grades": [
            3,
            3,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4
          ],
          "dates": [
            "2023-09-04",
            "2023-09-11",
            "2023-09-18",
            "2023-09-04",
            "2023-09-11",
            "2023-09-18",
            "2023-09-04",
            "2023-09-11",
            "2023-09-18",
            "2023-09-04",
            "2023-09-11",
            "2023-09-18"
          ]
        },
        "Иностранный язык": {
          "grades": [
            4,
            2,
            4,
            4,
            2,
            3
          ],
          "dates": [
            "2023-09-05",
            "2023-09-12",
            "2023-09-19",
            "2023-09-26",
            "2023-10-03",
            "2023-10-10"
          ]
        },
        "Физическая культура": {
          "grades": [
            3,
            3,
            3,
            3,
            3,
            4
          ],
          "dates": [
            "2023-09-06",
            "2023-09-13",
            "2023-09-20",
            "2023-09-27",
            "2023-10-04",
            "2023-10-11"
          ]
        },
        "История": {
          "grades": [
            3,
            3,
            3,
            3,
            3,
            3,
            4,
            5,
            5,
            5
          ],
          "dates": [
            "2023-09-01",
            "2023-09-08",
            "2023-09-15",
            "2023-09-22",
            "2023-09-29",
            "2023-10-06",
            "2023-10-13",
            "2023-10-14",
            "2023-11-05",
            "2023-11-07"
          ]
        },
        "Химия": {
          "grades": [
            5,
            3,
            5,
            3,
            5,
            4
          ],
          "dates": [
            "2023-09-05",
            "2023-09-12",
            "2023-09-19",
            "2023-09-26",
            "2023-10-03",
            "2023-10-10"
          ]
        }
      },
      "attendance": {
        "visited": 45,
        "missed": 2,
        "sick": 3,
        "absent": 1
      }
    },
    "2": {
      "subjects": {
        "Математика": {
          "grades": [
            3,
            3,
            3,
            3,
            3,
            3,
            4,
            5,
            5,
            5
          ],
          "dates": [
            "2023-09-01",
            "2023-09-08",
            "2023-09-15",
            "2023-09-22",
            "2023-09-29",
            "2023-10-06",
            "2023-10-13",
            "2023-10-14",
            "2023-11-05",
            "2023-11-07"
          ]
        },
        "Русский язык": {
          "grades": [
            3,
            3,
            3,
            3,
            3,
            3,
            4
          ],
          "dates": [
            "2023-09-02",
            "2023-09-09",
            "2023-09-16",
            "2023-09-23",
            "2023-09-30",
            "2023-10-07",
            "2023-10-14"
          ]
        },
        "Физика": {
          "grades": [
            3,
            3,
            3,
            3,
            3,
            3
          ],
          "dates": [
            "2023-09-03",
            "2023-09-10",
            "2023-09-17",
            "2023-09-24",
            "2023-10-01",
            "2023-10-08"
          ]
        },
        "Информатика": {
          "grades": [
            3,
            3,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4
          ],
          "dates": [
            "2023-09-04",
            "2023-09-11",
            "2023-09-18",
            "2023-09-04",
            "2023-09-11",
            "2023-09-18",
            "2023-09-04",
            "2023-09-11",
            "2023-09-18",
            "2023-09-04",
            "2023-09-11",
            "2023-09-18"
          ]
        },
        "Иностранный язык": {
          "grades": [
            4,
            2,
            4,
            4,
            2,
            3
          ],
          "dates": [
            "2023-09-05",
            "2023-09-12",
            "2023-09-19",
            "2023-09-26",
            "2023-10-03",
            "2023-10-10"
          ]
        },
        "Физическая культура": {
          "grades": [
            3,
            3,
            3,
            3,
            3,
            4
          ],
          "dates": [
            "2023-09-06",
            "2023-09-13",
            "2023-09-20",
            "2023-09-27",
            "2023-10-04",
            "2023-10-11"
          ]
        },
        "История": {
          "grades": [
            3,
            3,
            3,
            3,
            3,
            3,
            4,
            5,
            5,
            5
          ],
          "dates": [
            "2023-09-01",
            "2023-09-08",
            "2023-09-15",
            "2023-09-22",
            "2023-09-29",
            "2023-10-06",
            "2023-10-13",
            "2023-10-14",
            "2023-11-05",
            "2023-11-07"
          ]
        },
        "Химия": {
          "grades": [
            5,
            3,
            5,
            3,
            5,
            4
          ],
          "dates": [
            "2023-09-05",
            "2023-09-12",
            "2023-09-19",
            "2023-09-26",
            "2023-10-03",
            "2023-10-10"
          ]
        }
      },
      "attendance": {
        "visited": 48,
        "missed": 1,
        "sick": 4,
        "absent": 0
      }
    },
    "3": {
      "subjects": {
        "Математика": {
          "grades": [
            3,
            3,
            3,
            3,
            3,
            3,
            4,
            5,
            5,
            5
          ],
          "dates": [
            "2023-09-01",
            "2023-09-08",
            "2023-09-15",
            "2023-09-22",
            "2023-09-29",
            "2023-10-06",
            "2023-10-13",
            "2023-10-14",
            "2023-11-05",
            "2023-11-07"
          ]
        },
        "Русский язык": {
          "grades": [
            3,
            3,
            3,
            3,
            3,
            3,
            4
          ],
          "dates": [
            "2023-09-02",
            "2023-09-09",
            "2023-09-16",
            "2023-09-23",
            "2023-09-30",
            "2023-10-07",
            "2023-10-14"
          ]
        },
        "Физика": {
          "grades": [
            3,
            3,
            3,
            3,
            3,
            3
          ],
          "dates": [
            "2023-09-03",
            "2023-09-10",
            "2023-09-17",
            "2023-09-24",
            "2023-10-01",
            "2023-10-08"
          ]
        },
        "Информатика": {
          "grades": [
            3,
            3,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4
          ],
          "dates": [
            "2023-09-04",
            "2023-09-11",
            "2023-09-18",
            "2023-09-04",
            "2023-09-11",
            "2023-09-18",
            "2023-09-04",
            "2023-09-11",
            "2023-09-18",
            "2023-09-04",
            "2023-09-11",
            "2023-09-18"
          ]
        },
        "Иностранный язык": {
          "grades": [
            4,
            2,
            4,
            4,
            2,
            3
          ],
          "dates": [
            "2023-09-05",
            "2023-09-12",
            "2023-09-19",
            "2023-09-26",
            "2023-10-03",
            "2023-10-10"
          ]
        },
        "Физическая культура": {
          "grades": [
            3,
            3,
            3,
            3,
            3,
            4
          ],
          "dates": [
            "2023-09-06",
            "2023-09-13",
            "2023-09-20",
            "2023-09-27",
            "2023-10-04",
            "2023-10-11"
          ]
        },
        "История": {
          "grades": [
            3,
            3,
            3,
            3,
            3,
            3,
            4,
            5,
            5,
            5
          ],
          "dates": [
            "2023-09-01",
            "2023-09-08",
            "2023-09-15",
            "2023-09-22",
            "2023-09-29",
            "2023-10-06",
            "2023-10-13",
            "2023-10-14",
            "2023-11-05",
            "2023-11-07"
          ]
        },
        "Химия": {
          "grades": [
            5,
            3,
            5,
            3,
            5,
            4
          ],
          "dates": [
            "2023-09-05",
            "2023-09-12",
            "2023-09-19",
            "2023-09-26",
            "2023-10-03",
            "2023-10-10"
          ]
        }
      },
      "attendance": {
        "visited": 42,
        "missed": 3,
        "sick": 2,
        "absent": 1
      }
    },
    "4": {
      "subjects": {
        "Математика": {
          "grades": [
            3,
            3,
            3,
            3,
            3,
            3,
            4,
            5,
            5,
            5
          ],
          "dates": [
            "2023-09-01",
            "2023-09-08",
            "2023-09-15",
            "2023-09-22",
            "2023-09-29",
            "2023-10-06",
            "2023-10-13",
            "2023-10-14",
            "2023-11-05",
            "2023-11-07"
          ]
        },
        "Русский язык": {
          "grades": [
            3,
            3,
            3,
            3,
            3,
            3,
            4
          ],
          "dates": [
            "2023-09-02",
            "2023-09-09",
            "2023-09-16",
            "2023-09-23",
            "2023-09-30",
            "2023-10-07",
            "2023-10-14"
          ]
        },
        "Физика": {
          "grades": [
            3,
            3,
            3,
            3,
            3,
            3
          ],
          "dates": [
            "2023-09-03",
            "2023-09-10",
            "2023-09-17",
            "2023-09-24",
            "2023-10-01",
            "2023-10-08"
          ]
        },
        "Информатика": {
          "grades": [
            3,
            3,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4,
            4
          ],
          "dates": [
            "2023-09-04",
            "2023-09-11",
            "2023-09-18",
            "2023-09-04",
            "2023-09-11",
            "2023-09-18",
            "2023-09-04",
            "2023-09-11",
            "2023-09-18",
            "2023-09-04",
            "2023-09-11",
            "2023-09-18"
          ]
        },
        "Иностранный язык": {
          "grades": [
            4,
            2,
            4,
            4,
            2,
            3
          ],
          "dates": [
            "2023-09-05",
            "2023-09-12",
            "2023-09-19",
            "2023-09-26",
            "2023-10-03",
            "2023-10-10"
          ]
        },
        "Физическая культура": {
          "grades": [
            3,
            3,
            3,
            3,
            3,
            4
          ],
          "dates": [
            "2023-09-06",
            "2023-09-13",
            "2023-09-20",
            "2023-09-27",
            "2023-10-04",
            "2023-10-11"
          ]
        },
        "История": {
          "grades": [
            3,
            3,
            3,
            3,
            3,
            3,
            4,
            5,
            5,
            5
          ],
          "dates": [
            "2023-09-01",
            "2023-09-08",
            "2023-09-15",
            "2023-09-22",
            "2023-09-29",
            "2023-10-06",
            "2023-10-13",
            "2023-10-14",
            "2023-11-05",
            "2023-11-07"
          ]
        },
        "Химия": {
          "grades": [
            5,
            3,
            5,
            3,
            5,
            4
          ],
          "dates": [
            "2023-09-05",
            "2023-09-12",
            "2023-09-19",
            "2023-09-26",
            "2023-10-03",
            "2023-10-10"
          ]
        }
      },
      "attendance": {
        "visited": 42,
        "missed": 3,
        "sick": 2,
        "absent": 1
      }
    }
  }
};
    }

    // Инициализация переключения четвертей
    initQuarterSwitcher(studentData);
    
    // Устанавливаем активную четверть (итоговая оценка по умолчанию)
    switchQuarter('1', studentData);
}

// Функция для инициализации переключения четвертей
function initQuarterSwitcher(studentData) {
    const buttons = document.querySelectorAll('.param-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            buttons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            // Переключаем четверть
            switchQuarter(this.dataset.quarter, studentData);
        });
    });
}

// Функция для переключения между четвертями
function switchQuarter(quarter, studentData) {
    let grades = [];
    let attendance = {};
    let tableSubjects = {};
    
    if (quarter === 'final') {
        // Собираем все оценки за все четверти для статистики
        for (const q in studentData.quarters) {
            const quarterGrades = getAllGradesFromQuarter(studentData.quarters[q].subjects);
            grades = grades.concat(quarterGrades);
            
            // Для таблицы используем последнюю четверть
            if (q === '4') {
                tableSubjects = studentData.quarters[q].subjects;
            }
        }
        // Собираем общую посещаемость
        attendance = getTotalAttendance(studentData.quarters);
        
        // Если нет четверти 4, используем первую доступную
        if (!tableSubjects || Object.keys(tableSubjects).length === 0) {
            const firstQuarter = Object.keys(studentData.quarters)[0];
            tableSubjects = studentData.quarters[firstQuarter].subjects;
        }
    } else {
        // Берем данные конкретной четверти
        const quarterData = studentData.quarters[quarter];
        if (quarterData) {
            grades = getAllGradesFromQuarter(quarterData.subjects);
            attendance = quarterData.attendance || {};
            tableSubjects = quarterData.subjects;
        }
    }
    
    // Обновляем карточки статистики
    updateGradesCard(grades);
    updateAttendanceCard(attendance);
    
    // Заполняем таблицу оценками
    fillGradesTable(tableSubjects);
}

// Загрузка данных при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadStudentData();
});

// Экспорт функций для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        calculateAverage, 
        calculateFinalGrade, 
        loadStudentData 
    };
}