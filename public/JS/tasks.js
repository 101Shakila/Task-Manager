document.getElementById('taskContainer').addEventListener('submit', addUpTask);

let tasksCollection = [];

async function fetchTasks() {
    const response = await fetch('/tasks');
    const tasks = await response.json();
    return tasks;
}

async function addUpTask(e) {
    e.preventDefault();

    const taskDescription = document.getElementById('description').value;
    const assignedTo = document.getElementById('assignedTo').value;
    const dueDate = document.getElementById('dueDate').value;
    const priority = document.getElementById('priority').value;
    const status = document.getElementById('status').value;

    const newTask = {
        description: taskDescription,
        assignedTo: assignedTo,
        dueDate: dueDate,
        priority: priority,
        status: status
    };

    const response = await fetch('/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
    });

    if (response.ok) {
        const addedTask = await response.json();
        tasksCollection.push(addedTask);
        showResults();
        clearInput();
    }
}

function clearInput() {
    document.getElementById('taskContainer').reset();
}

async function showResults(inputSearch = '') {
    const list = document.getElementById('taskList');
    list.innerHTML = '';

    let tasks = await fetchTasks();
    tasksCollection = tasks;

    let filterTask = tasksCollection;
    if (inputSearch.trim() !== '') {
        const lowCaseSearch = inputSearch.toLowerCase();
        filterTask = tasksCollection.filter(task => {
            return (
                task.description.toLowerCase().includes(lowCaseSearch) ||
                task.assignedTo.toLowerCase().includes(lowCaseSearch) ||
                task.dueDate.includes(inputSearch) ||
                task.priority.toLowerCase().includes(lowCaseSearch) ||
                task.status.toLowerCase().includes(lowCaseSearch)
            );
        });
    }

    const colors = ['lightblue', 'lightgreen', 'lightcoral', 'lightsalmon', 'lightseagreen'];
    let index = 0;

    filterTask.forEach(task => {
        const li = document.createElement('li');
        li.setAttribute('data-id', task.id);
        li.style.backgroundColor = colors[index % colors.length];

        li.innerHTML = `
        <strong>Description:</strong> ${task.description}<br>
        <strong>Assigned:</strong> ${task.assignedTo}<br>
        <strong>Due Date:</strong> ${task.dueDate}<br>
        <strong>Priority:</strong> ${task.priority}<br>
        <strong>Status:</strong> ${task.status}<br>
        <button class="task-button edit-button" onclick="editTask(${task.id})">Edit</button>
        <button class="task-button delete-button" onclick="deleteTask(${task.id})">Delete</button>`;
        list.appendChild(li);

        index++;
    });
}

async function deleteTask(id) {
    const response = await fetch(`/tasks/${id}`, { method: 'DELETE' });
    if (response.ok) {
        tasksCollection = tasksCollection.filter(task => task.id !== id);
        showResults();
    }
}

function editTask(id) {
    const task = tasksCollection.find(task => task.id === id);
    document.getElementById('description').value = task.description;
    document.getElementById('assignedTo').value = task.assignedTo;
    document.getElementById('dueDate').value = task.dueDate;
    document.getElementById('priority').value = task.priority;
    document.getElementById('status').value = task.status;

    deleteTask(id);
}

document.getElementById('searchInput').addEventListener('input', (event) => {
    const inputSearch = event.target.value.trim();
    showResults(inputSearch);
});

function init() {
    showResults();
}

init();