//We will make a event listener where it will CALL the FUNCTION "addUpTask" when we click on submit BUTTON
document.getElementById('taskContainer').addEventListener('submit', addUpTask);

//Task manager contains mulitple tasks - hence we need to save it into an array
let tasksCollection = [];

// Don't put bad words here!
//Lets create a function where it gathers the users input and pushes it into the tasksCollection array.
function addUpTask(e) {
    e.preventDefault();  //this will prevent the deafult behavior of form submission ( in this case ) and follow our javascript code instead

    //lets store user input into variables
    const taskDescription = document.getElementById('description').value;
    const assignedTo = document.getElementById('assignedTo').value;
    const dueDate = document.getElementById('dueDate').value;
    const priority = document.getElementById('priority').value;
    const status = document.getElementById('status').value;

    //we will store the data into a object - this way we can store key value pairs
    //We want to store mulitple objects into a array so we can use methods such as push, forEach etc..
    const plusTask = {
        id: Date.now(), //we will use this as we need unique IDs and will be easy for us to EDIT/DELETE
        description: taskDescription,
        assignedTo: assignedTo,
        dueDate: dueDate,
        priority: priority,
        status: status
    }

    //Here we will push the stored object into the array
    tasksCollection.push(plusTask);
    localStorageSave(tasksCollection);
    showResults();
    //after you show the results you want to remove the input given by the user so its easier to input another task ( also not accidently input the same task)
    clearInput();
}

function clearInput() {
    //reset into initial values
    document.getElementById('taskContainer').reset();
}

//rendering array!
function showResults(inputSearch = '') {

    const list = document.getElementById('taskList');
    list.innerHTML = ''; //whenever we render the data we want to reset it to the data doesn't overlap ( go on top of each other)


    let filterTask = tasksCollection;
    if (inputSearch.trim() !== '') {
        //we have to make sure the search doesn't go wrong DUE TO CASING
        const lowCaseSearch = inputSearch.toLowerCase();
        filterTask = tasksCollection.filter(task => {
            return (
                task.description.toLowerCase().includes(lowCaseSearch) ||
                task.assignedTo.toLowerCase().includes(lowCaseSearch) ||
                task.dueDate.includes(inputSearch) || //dueDate is a string in format YYYY-MM-DD
                task.priority.toLowerCase().includes(lowCaseSearch) ||
                task.status.toLowerCase().includes(lowCaseSearch)
            );

        });
    }

    // Adding different colours as per the instructions.
    const colors = ['lightblue', 'lightgreen', 'lightcoral', 'lightsalmon', 'lightseagreen'];
    // Making sure it starts from the index which is 0 in the array.
    let index = 0;

    // Creating a for loop for every task that is supposed to be displayed
    filterTask.forEach(task => {
        const li = document.createElement('li');
        li.setAttribute('data-id', task.id);
        // The backgroundColour property will be applied to the task and will start from index which is (0) and will go upto the length of the colours array. 
        li.style.backgroundColor = colors[index % colors.length];

        li.innerHTML = `
        <strong>Description:</strong> ${task.description}<br>
        <strong>Assigned:</strong> ${task.assignedTo}<br>
        <strong>Due Date:</strong> ${task.dueDate}<br>
        <strong>Priority:</strong> ${task.priority}<br>
        <strong>Status:</strong> ${task.status}<br>
        <button class="task-button edit-button" onclick="editTask(${task.id})">Edit</button>
        <button class="task-button edit-button" onclick="deleteTask(${task.id})">Delete</button>`;
        list.appendChild(li); //the newly created li element will be added as a child to the list element

        // The array will keep iterating everytime user enters a new task.
        index++;
    });
}

function deleteTask(id) {
    //we are going to delete tasks based on unique ID
    //filter method will create a new array with all the elements passed into
    //We will remove any object that returns false and only show the results of the ones that's true.
    tasksCollection = tasksCollection.filter(tasksCollection => tasksCollection.id !== id);
    localStorageSave(tasksCollection);
    showResults();
}

function editTask(id) {
    //we will grab the task based on ID and place it back to the input section to have the user edit it.
    //When we click on edit we will delete the ID as when they edit it will be placed based on a new unique ID
    const task = tasksCollection.find(task => task.id === id);
    document.getElementById('description').value = task.description;
    document.getElementById('assignedTo').value = task.assignedTo;
    document.getElementById('dueDate').value = task.dueDate;
    document.getElementById('priority').value = task.priority;
    document.getElementById('status').value = task.status;

    deleteTask(id);
}


//This is the main function to saves inputted tasks into localStorage
function localStorageSave(tasksCollection) {
    localStorage.setItem('tasksCollection', JSON.stringify(tasksCollection));
}

//Function to retrieve the tasks from the locationStorage
function localStorageGet() {
    const taskStored = localStorage.getItem('tasksCollection');
    return taskStored ? JSON.parse(taskStored) : []; //if there is a task stored we will parse it and return it as an array
}

//This function will handle the search input changes made by user
function handleInput(event) {
    const inputSearch = event.target.value.trim();
    showResults(inputSearch); //this will render the tasks based on what the user has inputted
}

//We need a function to initialize the application
function init() {

    //Here we will retrieve tasks from localStoarge once the page is loaded
    tasksCollection = localStorageGet();
    showResults();

    //event listener for the search input done by the user
    const search = document.getElementById('searchInput');
    search.addEventListener('input', handleInput);

}

//call the init function to load the page
init();