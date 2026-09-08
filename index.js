const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const counter = document.getElementById("counter");
const clearCompletedBtn = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".filter-btn");
const priorityInput = document.getElementById("priorityInput");
const dueDateInput = document.getElementById("dueDateInput");
const totalCount = document.getElementById("totalCount");
const activeCount = document.getElementById("activeCount");
const completedCount = document.getElementById("completedCount");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let activeFilter = "all";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function displayTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const shouldShow = activeFilter === "all"
            || (activeFilter === "active" && !task.completed)
            || (activeFilter === "completed" && task.completed);

        if (!shouldShow) {
            return;
        }

        const li = document.createElement("li");

        const span = document.createElement("span");
        span.textContent = task.text;

        if (task.completed) {
            span.classList.add("completed");
        }

        span.setAttribute("role", "button");
        span.setAttribute("tabindex", "0");

        const toggleTask = () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            displayTasks();
        };

        span.addEventListener("click", toggleTask);
        span.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggleTask();
            }
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");

        deleteBtn.addEventListener("click", () => {
            tasks.splice(index, 1);
            saveTasks();
            displayTasks();
        });

        li.appendChild(span);

        const details = document.createElement("div");
        details.className = "task-details";

        const priority = document.createElement("small");
        priority.className = `priority priority-${task.priority || "medium"}`;
        priority.textContent = `${task.priority || "medium"} priority`;
        details.appendChild(priority);

        if (task.dueDate) {
            const dueDate = document.createElement("small");
            dueDate.textContent = `Due ${new Date(`${task.dueDate}T00:00:00`).toLocaleDateString(undefined, {
                day: "numeric",
                month: "short",
                year: "numeric"
            })}`;
            details.appendChild(dueDate);
        }

        li.appendChild(details);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });

    const remaining = tasks.filter(task => !task.completed).length;
    counter.textContent = `${remaining} ${remaining === 1 ? "task" : "tasks"} remaining`;
    clearCompletedBtn.disabled = !tasks.some(task => task.completed);
    totalCount.textContent = tasks.length;
    activeCount.textContent = remaining;
    completedCount.textContent = tasks.length - remaining;
}

function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        text: text,
        completed: false,
        priority: priorityInput.value,
        dueDate: dueDateInput.value
    });

    saveTasks();
    taskInput.value = "";
    priorityInput.value = "medium";
    dueDateInput.value = "";
    displayTasks();
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
});

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;
        filterButtons.forEach((filterButton) => {
            filterButton.classList.toggle("active", filterButton === button);
        });
        displayTasks();
    });
});

clearCompletedBtn.addEventListener("click", () => {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    displayTasks();
});

displayTasks();