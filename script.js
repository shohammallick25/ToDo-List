const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

document.addEventListener("DOMContentLoaded", () => {
    getLocalTodos();
    updateDateWidget();
});
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("change", filterTodo);

function addTodo(event) {
    event.preventDefault();
    const text = todoInput.value.trim();
    if(text === "") return;

    // Create todo object with timestamp
    const todoObj = {
        text: text,
        timestamp: new Date().toISOString()
    };

    // Create todo div
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    const newTodo = document.createElement("li");
    newTodo.innerText = todoObj.text;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);

    // Show time added next to todo text
    const timeSpan = document.createElement("span");
    timeSpan.classList.add("todo-time");
    const date = new Date(todoObj.timestamp);
    timeSpan.innerText = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    timeSpan.style.fontSize = "0.8rem";
    timeSpan.style.marginLeft = "10px";
    timeSpan.style.color = "#555";
    todoDiv.appendChild(timeSpan);

    // Buttons
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check-circle"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    todoList.appendChild(todoDiv);
    todoInput.value = "";

    // Save to localStorage
    saveLocalTodos(todoObj);
}

function deleteCheck(e) {
    const item = e.target;

    if(item.classList[0] === "trash-btn") {
        const todo = item.parentElement;
        todo.classList.add("slide");

        removeLocalTodos(todo);
        todo.addEventListener("transitionend", function() {
            todo.remove();
        });
    }

    if(item.classList[0] === "complete-btn") {
        const todo = item.parentElement;
        todo.classList.toggle("completed");
    }
}

function filterTodo(e) {
    const todos = todoList.childNodes;
    todos.forEach(function(todo) {
        switch(e.target.value) {
            case "all":
                todo.style.display = "flex";
                break;
            case "completed":
                if(todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "incomplete":
                if(!todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
        }
    });
}

function saveLocalTodos(todoObj) {
    let todos;
    if(localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.push(todoObj);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getLocalTodos() {
    let todos;
    if(localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.forEach(function(todoObj) {
        // Create todo div
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");

        const newTodo = document.createElement("li");
        newTodo.innerText = todoObj.text;
        newTodo.classList.add("todo-item");
        todoDiv.appendChild(newTodo);

        // Show time added
        const timeSpan = document.createElement("span");
        timeSpan.classList.add("todo-time");
        const date = new Date(todoObj.timestamp);
        timeSpan.innerText = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
        timeSpan.style.fontSize = "0.8rem";
        timeSpan.style.marginLeft = "10px";
        timeSpan.style.color = "#555";
        todoDiv.appendChild(timeSpan);

        // Buttons
        const completedButton = document.createElement("button");
        completedButton.innerHTML = '<i class="fas fa-check-circle"></i>';
        completedButton.classList.add("complete-btn");
        todoDiv.appendChild(completedButton);

        const trashButton = document.createElement("button");
        trashButton.innerHTML = '<i class="fas fa-trash"></i>';
        trashButton.classList.add("trash-btn");
        todoDiv.appendChild(trashButton);

        todoList.appendChild(todoDiv);
    });
}

function removeLocalTodos(todoElement) {
    let todos;
    if(localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }

    const todoText = todoElement.querySelector(".todo-item").innerText;
    const todoTime = todoElement.querySelector(".todo-time").innerText;

    // Filter out todo that matches text and time to avoid deleting wrong duplicates
    todos = todos.filter(t => {
        const tTime = new Date(t.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
        return !(t.text === todoText && tTime === todoTime);
    });

    localStorage.setItem("todos", JSON.stringify(todos));
}

function updateDateWidget() {
  const dateWidget = document.getElementById("date-widget");
  const now = new Date();

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = now.toLocaleDateString(undefined, options);

  if (dateWidget) {
    dateWidget.textContent = formattedDate;
  }
}


function updateClock() {
  const clock = document.getElementById("clock-widget");
  if (!clock) return;

  const now = new Date();

  const options = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };
  const timeString = now.toLocaleTimeString([], options);

  clock.textContent = timeString;
}

setInterval(updateClock, 1000);
document.addEventListener("DOMContentLoaded", updateClock);
