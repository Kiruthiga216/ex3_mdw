
// GET HTML ELEMENTS
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");

// LOAD TASKS FROM LOCAL STORAGE
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// SAVE TASKS
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ADD TASK
function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        id: Date.now(),
        text: text,
        completed: false
    });

    taskInput.value = "";

    saveTasks();
    displayTasks();
}

// ADD TASK USING ENTER KEY
taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// DISPLAY TASKS
function displayTasks() {
    taskList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();

    let filteredTasks = tasks.filter(function(task) {

        const matchesSearch = task.text.toLowerCase().includes(searchText);

        const matchesFilter =
            currentFilter === "all" ||
            (currentFilter === "pending" && !task.completed) ||
            (currentFilter === "completed" && task.completed);

        return matchesSearch && matchesFilter;
    });

    if (filteredTasks.length === 0) {
        taskList.innerHTML =
            '<li class="empty">No tasks found!</li>';
    }

    filteredTasks.forEach(function(task) {

        const li = document.createElement("li");

        const text = document.createElement("span");
        text.className = "task-text";
        text.textContent = task.text;

        if (task.completed) {
            text.classList.add("completed");
        }

        // COMPLETE BUTTON
        const completeBtn = document.createElement("button");
        completeBtn.textContent = task.completed ? "Undo" : "Done";

        completeBtn.onclick = function() {
            toggleTask(task.id);
        };

        // EDIT BUTTON
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit-btn";

        editBtn.onclick = function() {
            editTask(task.id);
        };

        // DELETE BUTTON
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";

        deleteBtn.onclick = function() {
            deleteTask(task.id);
        };

        const actions = document.createElement("div");
        actions.className = "actions";

        actions.appendChild(completeBtn);
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(text);
        li.appendChild(actions);

        taskList.appendChild(li);
    });

    updateCounts();
}

// COMPLETE OR UNDO TASK
function toggleTask(id) {
    tasks = tasks.map(function(task) {
        if (task.id === id) {
            task.completed = !task.completed;
        }
        return task;
    });

    saveTasks();
    displayTasks();
}

// EDIT TASK
function editTask(id) {
    const task = tasks.find(function(task) {
        return task.id === id;
    });

    const newText = prompt("Edit your task:", task.text);

    if (newText === null) {
        return;
    }

    if (newText.trim() === "") {
        alert("Task cannot be empty!");
        return;
    }

    task.text = newText.trim();

    saveTasks();
    displayTasks();
}

// DELETE TASK
function deleteTask(id) {
    if (confirm("Are you sure you want to delete this task?")) {
        tasks = tasks.filter(function(task) {
            return task.id !== id;
        });

        saveTasks();
        displayTasks();
    }
}

// FILTER TASKS
function setFilter(filter) {
    currentFilter = filter;
    displayTasks();
}

// CLEAR COMPLETED TASKS
function clearCompleted() {
    if (confirm("Delete all completed tasks?")) {
        tasks = tasks.filter(function(task) {
            return !task.completed;
        });

        saveTasks();
        displayTasks();
    }
}

// UPDATE TASK COUNTS
function updateCounts() {
    document.getElementById("totalCount").textContent = tasks.length;

    document.getElementById("pendingCount").textContent =
        tasks.filter(task => !task.completed).length;

    document.getElementById("completedCount").textContent =
        tasks.filter(task => task.completed).length;
}

// INITIAL DISPLAY
displayTasks();
