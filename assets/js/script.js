// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || []; // Retrieve tasks from local storage or initialize an empty array
const taskTitleInput = $('#taskTitle'); // Reference to task title input field
const taskDateInput = $('#taskDueDate'); // Reference to task due date input field
const taskDescInput = $('#taskDesc'); // Reference to task description input field

// Function to create a task card
function createTaskCard(task) {
    // Create task card element with appropriate classes and data attributes
    const taskCard = $('<div>').addClass('card task-card draggable m-2').attr('data-task-id', task.id);
    const cardHeader = $('<div>').addClass('card-header h4').text('Task: ' + task.title); // Create card header with task title
    const cardBody = $('<div>').addClass('card-body');
    const cardDesc = $('<p>').addClass('card-text').text('Description: ' + task.description); // Create card description
    const cardDueDate = $('<p>').addClass('card-text').text('Due Date: ' + task.dueDate); // Create card due date
    const cardDeleteBtn = $('<button>').addClass('btn btn-danger delete').text('Delete').attr('data-task-id', task.id); // Create delete button

    // Apply styling based on task due date and status
    if (task.dueDate && task.status !== 'done') {
        const now = dayjs();
        const taskDueDate = dayjs(task.dueDate, 'MM/DD/YYYY');
        
        if (now.isSame(taskDueDate, 'day')){
            taskCard.addClass('bg-warning text-white');
        } else if (now.isAfter(taskDueDate)){
            taskCard.addClass('bg-danger text-white');
            cardDeleteBtn.addClass('border-light');
        }
    }

    // Append card elements to card body and task card
    cardBody.append(cardDesc, cardDueDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);

    return taskCard; // Return the created task card
}


// Function to render the task list and make cards draggable
function renderTaskList() {
    const tasks = taskList;

    // Empty task lists for different status lanes
    const todoList = $('#to-do-list');
    todoList.empty();
    const inProgressList = $('#in-progress-list');
    inProgressList.empty();
    const doneList = $('#done-list');
    doneList.empty();

    // Loop through tasks and append them to appropriate status lanes
    for (let task of tasks) {
        if (task.status === 'to-do'){
            todoList.append(createTaskCard(task));
        } else if (task.status === 'in-progress'){
            inProgressList.append(createTaskCard(task));
        } else if (task.status === 'done'){
            doneList.append(createTaskCard(task));
        }
    }

    // Make task cards draggable within lanes using JQuery UI
    $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
        helper: function (e) {
            const original = $(e.target).hasClass('ui-draggable')
                ? $(e.target)
                : $(e.target).closest('.ui-draggable');
            return original.clone().css({
                width: original.outerWidth(),
            });
        },
    });
}

// Function to handle the addition of a new task:
function handleAddTask(event){
    event.preventDefault();

    // Extract task details from input fields
    const taskTitle = taskTitleInput.val().trim();
    const taskDate = taskDateInput.val();
    const taskDesc = taskDescInput.val();

    // Create a new task object with extracted details
    const newTask = {
        id: crypto.randomUUID(),
        title: taskTitle,
        description: taskDesc,
        dueDate: taskDate,
        status: 'to-do',
    };

    // Add the new task to the task list array
    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList)); // Save the updated task list to local storage

    // Render the updated task list on the UI
    renderTaskList();

    // Clear input fields after adding the task
    taskTitleInput.val('');
    taskDateInput.val('');
    taskDescInput.val('');
    
    // Hide the modal after adding the task
    $('#formModal').modal('hide');
}

// Function to handle the deletion of a task:
function handleDeleteTask(event){
    // Extract the task ID from the clicked element's data attribute
    const taskId = $(this).attr('data-task-id');
    
    // Filter out the task with the extracted ID from the task list
    taskList = taskList.filter(task => task.id != taskId);
    localStorage.setItem('tasks', JSON.stringify(taskList)); // Update the tasks stored in local storage with the filtered task list
     
     // Render the updated task list on the UI
    renderTaskList();
}

// Function to handle dropping a task into a new status lane:
function handleDrop(event, ui) {
    const taskId = ui.draggable.attr('data-task-id'); // Extract the task ID from the dragged element
    const newStatus = event.target.id; // Identify the new status lane where the task is dropped
    const taskIndex = taskList.findIndex(task => task.id == taskId); // Find the index of the task with the extracted ID in the task list

    // Update the status of the task with the new status lane
    taskList[taskIndex].status = newStatus;
    localStorage.setItem("tasks", JSON.stringify(taskList)); // Update the tasks stored in local storage with the modified task list

    // Render the updated task list on the UI
    renderTaskList();
}


// When the document is ready, set up necessary functionalities
$(document).ready(function () {
    renderTaskList(); // Render the task list
    $(function() {
        $("#taskDueDate").datepicker(); // Initialize date picker for due date input
    });

    // Make status lanes droppable for task cards
    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });

    // Assign event handlers for task deletion and addition
    $(document).on('click', '.delete', handleDeleteTask);
    $('#addTaskForm').submit(handleAddTask);
});
