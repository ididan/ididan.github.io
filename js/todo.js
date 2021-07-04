const todoForm = document.getElementById("todo-form");
const todoInput = todoForm.querySelector("#todo-form input");
const todoList = document.getElementById("todo-list");

const TODO_KEY = "todos";

let todos = [];
const saveTodos = () => {
    localStorage.setItem(TODO_KEY, JSON.stringify(todos));
};
const updateTodo = (newTodo) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.innerText = newTodo.text;
    li.id = newTodo.id;
    li.appendChild(span);

    const button = document.createElement("button");
    button.innerText = "❌";
    button.onclick = (event) => {
        const li = event.target.parentElement;
        todos = todos.filter(item => item.id !== parseInt(li.id));
        saveTodos();
        li.remove();
    };
    li.appendChild(button);

    todoList.appendChild(li);
}

todoForm.onsubmit = (event) => {
    event.preventDefault();
    const newTodo = {
        id: Date.now(),
        text: todoInput.value,
    };
    updateTodo(newTodo);
    todoInput.value = "";

    todos.push(newTodo);
    saveTodos();
}

const savedTodos = localStorage.getItem(TODO_KEY);
if (savedTodos != null) {
    todos = JSON.parse(savedTodos);
    todos.forEach(element => {
        updateTodo(element);
    });
};