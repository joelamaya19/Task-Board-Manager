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
    cardBody.append(cardDesc, cardDueDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);

    return taskCard;

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
   const tasks = taskList;

   const todoList = $('#to-do-list');
   todoList.empty();

   const inProgressList = $('#in-progress-list');
   inProgressList.empty();

   const doneList = $('#done-list');

   for (let task of tasks) {
    if (task.status === 'to-do'){
        todoList.append(createTaskCard(task));
    } else if (task.status === 'in-progress'){
        inProgressList.append(createTaskCard(task));
    } else if (task.status === 'done'){
        doneList.append(createTaskCard(task));
    }
   }

    // Use JQuery UI to make task cards draggable
  $('.draggable').draggable({
    opacity: 0.7,
    zIndex: 100,
    // This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
    helper: function (e) {
      // Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
      const original = $(e.target).hasClass('ui-draggable')
        ? $(e.target)
        : $(e.target).closest('.ui-draggable');
      // Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    const taskTitle = taskTitleInput.val();
    const taskDate = taskDateInput.val();
    const taskDesc = taskDescInput.val();

    const newTask = {
        id: generateTaskId(),
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
