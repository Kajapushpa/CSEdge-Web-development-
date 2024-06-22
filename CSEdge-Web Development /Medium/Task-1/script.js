document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDate');
    const priorityInput = document.getElementById('priority');
    const taskList = document.getElementById('taskList');
    const sortBy = document.getElementById('sortBy');

    let tasks = [];

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask(taskInput.value, dueDateInput.value, priorityInput.value);
        taskInput.value = '';
        dueDateInput.value = '';
        priorityInput.value = 'low';
        renderTasks();
    });

    sortBy.addEventListener('change', renderTasks);

    function addTask(description, dueDate, priority) {
        const task = {
            id: Date.now(),
            description,
            dueDate,
            priority,
            completed: false,
        };
        tasks.push(task);
    }

    function editTask(id, newDescription, newDueDate, newPriority) {
        const task = tasks.find(task => task.id === id);
        task.description = newDescription;
        task.dueDate = newDueDate;
        task.priority = newPriority;
        renderTasks();
    }

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
    }

    function toggleTaskCompletion(id) {
        const task = tasks.find(task => task.id === id);
        task.completed = !task.completed;
        renderTasks();
    }

    function renderTasks() {
        taskList.innerHTML = '';
        const sortedTasks = sortTasks([...tasks], sortBy.value);
        sortedTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = task.completed ? 'completed' : '';
            li.innerHTML = `
                <span>${task.description} (Due: ${task.dueDate}, Priority: ${task.priority})</span>
                <div>
                    <button class="complete" onclick="toggleTaskCompletion(${task.id})">${task.completed ? 'Unmark' : 'Complete'}</button>
                    <button class="edit" onclick="editTaskPrompt(${task.id})">Edit</button>
                    <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
                </div>
            `;
            taskList.appendChild(li);
        });
    }

    function sortTasks(tasks, criterion) {
        switch (criterion) {
            case 'priority':
                return tasks.sort((a, b) => ['low', 'medium', 'high'].indexOf(a.priority) - ['low', 'medium', 'high'].indexOf(b.priority));
            case 'dueDate':
                return tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            case 'status':
                return tasks.sort((a, b) => a.completed - b.completed);
            default:
                return tasks;
        }
    }

    window.editTaskPrompt = function(id) {
        const task = tasks.find(task => task.id === id);
        const newDescription = prompt('Edit task description:', task.description);
        const newDueDate = prompt('Edit due date (YYYY-MM-DD):', task.dueDate);
        const newPriority = prompt('Edit priority (low, medium, high):', task.priority);
        if (newDescription && newDueDate && newPriority) {
            editTask(id, newDescription, newDueDate, newPriority);
        }
    };

    window.deleteTask = deleteTask;
    window.toggleTaskCompletion = toggleTaskCompletion;
});

function toggleTaskCompletion(id) {
    const task = tasks.find(task => task.id === id);
    task.completed = !task.completed;
    renderTasks();
}

function editTaskPrompt(id) {
    const task = tasks.find(task => task.id === id);
    const newDescription = prompt('Edit task description:', task.description);
    const newDueDate = prompt('Edit due date (YYYY-MM-DD):', task.dueDate);
    const newPriority = prompt('Edit priority (low, medium, high):', task.priority);
    if (newDescription && newDueDate && newPriority) {
        editTask(id, newDescription, newDueDate, newPriority);
    }
}
