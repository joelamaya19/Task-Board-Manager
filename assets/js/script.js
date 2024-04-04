// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
const taskTitleInput = $('#taskTitle');
const taskDateInput = $('#taskDueDate');
const taskDescInput = $('#taskDesc');

// Todo: create a function to generate a unique task id
function generateTaskId() {
    let nextId = JSON.parse(localStorage.getItem("nextId"));
    if (!nextId) {
        nextId = crypto.randomUUID();
        localStorage.setItem('nextId', JSON.stringify(nextId));
    }
    return nextId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = $('<div>').addClass('card task-card draggable my-3').attr('data-task-id', task.id);
    const cardHeader = $('<div>').addClass('card-header h4').text('Task: ' + task.title);
    const cardBody = $('<div>').addClass('card-body');
    const cardDesc = $('<p>').addClass('card-text').text('Description: ' + task.description);
    const cardDueDate = $('<p>').addClass('card-text').text('Due Date: ' + task.dueDate);
    const cardDeleteBtn = $('<button>').addClass('btn btn-danger delete').text('Delete').attr('data-task-id', task.id);

    taskCard.append(cardHeader, cardBody.append(cardDesc, cardDueDate), cardDeleteBtn);
    return taskCard;

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $('to-do-list').empty();
    $('in-progress-list').empty();
    $('done-list').empty();
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    const taskTitle = taskTitleInput.val();
    const taskDate = taskDateInput.val();
    const taskDesc = taskDescInput.val();

    const newTask = {
        id: crypto.randomUUID(),
        title: taskTitle,
        description: taskDesc,
        dueDate: taskDate,
        status: 'to-do',
    };
 


}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    $(function() {
        $("#taskDueDate").datepicker();
      });

    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });

});
