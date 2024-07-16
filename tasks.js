//We will make a event listener where it will CALL the FUNCTION "addUpTask" when we click on submit BUTTON
document.getElementbyID('taskContainer').addEventListener('submit', addUpTask);

//Task manager contains mulitple tasks - hence we need to save it into an array
let tasksCollection = [];

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

}



function showResults() {

    const list = document.getElementById('taskList');
    list.innerHTML = ''; //whenever we render the data we want to reset it to the data doesn't overlap ( go on top of each other)

    tasksCollection.forEach(task => {
        li.setAttribute('date-id', task.id);
        li.innerHTML = `
        <strong>Description:</strong> ${task.description}<br>
        <strong>Assigned:</strong> ${task.assignedTo}<br>
        <strong>Due Date:</strong> ${task.dueDate}<br>
        <strong>Priority:</strong> ${task.priority}<br>
        <strong>Status:</strong> ${task.status}<br>`;
        list.appendChild(li); //the newly created li element will be added as a child to the list element
    })



}