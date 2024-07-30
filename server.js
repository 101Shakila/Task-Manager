const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;
const tasksFilePath = './tasks.json';

app.use(bodyParser.json()); //Parse incoming request bodies as JSON - Middleware functions ( helps with handling JSON Data )
app.use(express.static('public')); // Serve static files from the "public" directory

//function to read data from JSON file and return JS OBJECT / ARRAY.
const readTasks = () => {
    const data = fs.readFileSync(tasksFilePath, 'utf-8');  //Reads it synchronously. Reads in utf-8 FORMAT.
    return JSON.parse(data || '[]'); //It will convert string data into JS Object - if empty it will give [];
};

// Function to write tasks to the JSON file
const writeTasks = (tasks) => {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2)); //JSON.stringify converst tasks into JSON String format.
};

// Read all tasks
app.get('/tasks', (req, res) => {
    const tasks = readTasks();
    res.json(tasks); //sends JSON response back to client
});

// Read a single task by id - which is generated automatically
app.get('/tasks/:id', (req, res) => {
    const tasks = readTasks();
    //iterate over tasks array
    const task = tasks.find(t => t.id === parseInt(req.params.id)); //use parseInt since its from String to Integer to MATCH
    if (task) {
        res.json(task); //IF Found - it sends task object to client
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

// Create a new task
app.post('/tasks', (req, res) => {
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
app.put('/tasks/:id', (req, res) => {
    const tasks = readTasks();
    const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (taskIndex !== -1) { //checks if task exists
        tasks[taskIndex] = { ...tasks[taskIndex], ...req.body }; //creates shallow copy of current task object
        writeTasks(tasks);
        res.json(tasks[taskIndex]);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

// Delete a task by id
app.delete('/tasks/:id', (req, res) => {
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