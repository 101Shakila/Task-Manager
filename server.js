const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
const tasksFilePath = './tasks.json';

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the "public" directory

// Function to read tasks from the JSON file
const readTasks = () => {
    const data = fs.readFileSync(tasksFilePath, 'utf-8');
    return JSON.parse(data || '[]');
};

// Function to write tasks to the JSON file
const writeTasks = (tasks) => {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
};

// Read all tasks
app.get('/api/tasks', (req, res) => {
    const tasks = readTasks();
    res.json(tasks);
});

// Read a single task by id
app.get('/api/tasks/:id', (req, res) => {
    const tasks = readTasks();
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (task) {
        res.json(task);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

// Create a new task
app.post('/api/tasks', (req, res) => {
    const tasks = readTasks();
    const newTask = {
        id: Date.now(),
        ...req.body
    };
    tasks.push(newTask);
    writeTasks(tasks);
    res.status(201).json(newTask);
});

// Update a task by id
app.put('/api/tasks/:id', (req, res) => {
    const tasks = readTasks();
    const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
        writeTasks(tasks);
        res.json(tasks[taskIndex]);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

// Delete a task by id
app.delete('/api/tasks/:id', (req, res) => {
    let tasks = readTasks();
    const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (taskIndex !== -1) {
        tasks = tasks.filter(t => t.id !== parseInt(req.params.id));
        writeTasks(tasks);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});