// Variables globales
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let currentDate = new Date();

// Elementos DOM
const taskInput = document.getElementById('taskInput');
const taskDateInput = document.getElementById('taskDate');
const addTaskBtn = document.getElementById('addTask');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');
const pendingTasksCount = document.getElementById('pendingTasks');
const completedTasksCount = document.getElementById('completedTasks');

// Elementos del calendario (solo en la página de calendario)
const calendarDays = document.getElementById('calendarDays');
const currentMonthElement = document.getElementById('currentMonth');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const selectedDateElement = document.getElementById('selectedDate');
const tasksForDayElement = document.getElementById('tasksForDay');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Configurar la fecha actual en el input de fecha
    if (taskDateInput) {
        const today = new Date();
        const formattedDate = formatDateForInput(today);
        taskDateInput.value = formattedDate;
    }

    // Cargar tareas
    renderTasks();
    updateTaskStats();

    // Inicializar calendario si estamos en la página de calendario
    if (document.querySelector('.calendar')) {
        renderCalendar();
        setupCalendarControls();
    }

    // Event listeners
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    // Event listener para añadir tarea (solo en la página principal)
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', addTask);
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTask();
        });
    }

    // Event listeners para filtros (solo en la página principal)
    if (filterBtns) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                currentFilter = filter;
                
                // Actualizar botones activos
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                renderTasks();
            });
        });
    }
}

// Configurar controles del calendario
function setupCalendarControls() {
    if (prevMonthBtn && nextMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });

        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }
}

// Añadir una nueva tarea
function addTask() {
    const taskText = taskInput.value.trim();
    const taskDate = taskDateInput.value;

    if (taskText === '') return;

    const newTask = {
        id: Date.now(),
        text: taskText,
        date: taskDate,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    updateTaskStats();

    // Limpiar input
    taskInput.value = '';
    taskInput.focus();
}

// Guardar tareas en localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Renderizar lista de tareas según el filtro actual
function renderTasks() {
    if (!taskList) return;

    taskList.innerHTML = '';

    const filteredTasks = filterTasks(tasks, currentFilter);

    if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'No hay tareas para mostrar';
        taskList.appendChild(emptyMessage);
        return;
    }

    filteredTasks.forEach(task => {
        const taskItem = createTaskElement(task);
        taskList.appendChild(taskItem);
    });
}

// Filtrar tareas según el criterio seleccionado
function filterTasks(tasks, filter) {
    switch (filter) {
        case 'pending':
            return tasks.filter(task => !task.completed);
        case 'completed':
            return tasks.filter(task => task.completed);
        default:
            return [...tasks];
    }
}

// Crear elemento de tarea
function createTaskElement(task) {
    const taskItem = document.createElement('li');
    taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
    taskItem.dataset.id = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTaskStatus(task.id));

    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';

    const taskTitle = document.createElement('div');
    taskTitle.className = 'task-title';
    taskTitle.textContent = task.text;

    const taskDate = document.createElement('div');
    taskDate.className = 'task-date';
    taskDate.textContent = formatDate(task.date);

    taskContent.appendChild(taskTitle);
    taskContent.appendChild(taskDate);

    const taskActions = document.createElement('div');
    taskActions.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'task-btn edit-btn';
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.addEventListener('click', () => editTask(task.id));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'task-btn delete-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    taskActions.appendChild(editBtn);
    taskActions.appendChild(deleteBtn);

    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskContent);
    taskItem.appendChild(taskActions);

    return taskItem;
}

// Cambiar estado de una tarea (completada/pendiente)
function toggleTaskStatus(taskId) {
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });

    saveTasks();
    renderTasks();
    updateTaskStats();

    // Si estamos en la página de calendario, actualizar la vista del día
    if (document.querySelector('.calendar')) {
        renderTasksForSelectedDay();
    }
}

// Editar una tarea
function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newText = prompt('Editar tarea:', task.text);
    if (newText === null) return; // Usuario canceló

    const newDate = prompt('Fecha (YYYY-MM-DD):', task.date);
    if (newDate === null) return; // Usuario canceló

    tasks = tasks.map(t => {
        if (t.id === taskId) {
            return { ...t, text: newText.trim(), date: newDate.trim() };
        }
        return t;
    });

    saveTasks();
    renderTasks();

    // Si estamos en la página de calendario, actualizar
    if (document.querySelector('.calendar')) {
        renderCalendar();
        renderTasksForSelectedDay();
    }
}

// Eliminar una tarea
function deleteTask(taskId) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) return;

    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
    updateTaskStats();

    // Si estamos en la página de calendario, actualizar
    if (document.querySelector('.calendar')) {
        renderCalendar();
        renderTasksForSelectedDay();
    }
}

// Actualizar estadísticas de tareas
function updateTaskStats() {
    if (!pendingTasksCount || !completedTasksCount) return;

    const pending = tasks.filter(task => !task.completed).length;
    const completed = tasks.filter(task => task.completed).length;

    pendingTasksCount.textContent = pending;
    completedTasksCount.textContent = completed;
}

// Renderizar calendario
function renderCalendar() {
    if (!calendarDays || !currentMonthElement) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Actualizar título del mes
    currentMonthElement.textContent = `${getMonthName(month)} ${year}`;

    // Limpiar días anteriores
    calendarDays.innerHTML = '';

    // Obtener el primer día del mes y el último día
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Obtener el día de la semana del primer día (0 = Domingo, 6 = Sábado)
    const firstDayOfWeek = firstDay.getDay();

    // Añadir días del mes anterior para completar la primera semana
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const dayNumber = prevMonthLastDay - i;
        const dayDate = new Date(year, month - 1, dayNumber);
        const dayElement = createDayElement(dayNumber, dayDate, 'other-month');
        calendarDays.appendChild(dayElement);
    }

    // Añadir días del mes actual
    const today = new Date();
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const dayDate = new Date(year, month, i);
        let className = '';
        
        // Verificar si es hoy
        if (year === today.getFullYear() && month === today.getMonth() && i === today.getDate()) {
            className = 'today';
        }
        
        const dayElement = createDayElement(i, dayDate, className);
        calendarDays.appendChild(dayElement);
    }

    // Añadir días del mes siguiente para completar la última semana
    const lastDayOfWeek = lastDay.getDay();
    const daysToAdd = 6 - lastDayOfWeek;
    for (let i = 1; i <= daysToAdd; i++) {
        const dayDate = new Date(year, month + 1, i);
        const dayElement = createDayElement(i, dayDate, 'other-month');
        calendarDays.appendChild(dayElement);
    }
}

// Crear elemento de día para el calendario
function createDayElement(dayNumber, date, className) {
    const dayElement = document.createElement('div');
    dayElement.className = `day ${className}`;
    dayElement.dataset.date = formatDateForInput(date);

    const dayNumberElement = document.createElement('div');
    dayNumberElement.className = 'day-number';
    dayNumberElement.textContent = dayNumber;
    dayElement.appendChild(dayNumberElement);

    // Contar tareas para este día
    const tasksForDay = tasks.filter(task => task.date === formatDateForInput(date));
    if (tasksForDay.length > 0) {
        const indicator = document.createElement('div');
        indicator.className = 'day-tasks-indicator';
        indicator.textContent = tasksForDay.length;
        dayElement.appendChild(indicator);
    }

    // Event listener para seleccionar día
    dayElement.addEventListener('click', () => {
        // Quitar selección anterior
        document.querySelectorAll('.day.selected').forEach(day => {
            day.classList.remove('selected');
        });

        // Añadir selección al día actual
        dayElement.classList.add('selected');

        // Mostrar tareas para este día
        selectedDateElement.textContent = formatDate(dayElement.dataset.date);
        renderTasksForDay(dayElement.dataset.date);
    });

    return dayElement;
}

// Renderizar tareas para un día específico
function renderTasksForDay(dateString) {
    if (!tasksForDayElement) return;

    tasksForDayElement.innerHTML = '';

    const tasksForDay = tasks.filter(task => task.date === dateString);

    if (tasksForDay.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'No hay tareas para este día';
        tasksForDayElement.appendChild(emptyMessage);
        return;
    }

    tasksForDay.forEach(task => {
        const taskItem = createTaskElement(task);
        tasksForDayElement.appendChild(taskItem);
    });
}

// Renderizar tareas para el día seleccionado actualmente
function renderTasksForSelectedDay() {
    const selectedDay = document.querySelector('.day.selected');
    if (selectedDay) {
        renderTasksForDay(selectedDay.dataset.date);
    }
}

// Funciones de utilidad para formatear fechas
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getMonthName(month) {
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[month];
}