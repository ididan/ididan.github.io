const todoForm = document.getElementById("todo-form");
const todoInput = todoForm.querySelector("#todo-form input");
const todoList = document.getElementById("todo-list");

const updateTodo = (newTodo) => {
    console.log(newTodo);
    const li = document.createElement("li");
    
    const span = document.createElement("span");
    span.innerText = newTodo;
    li.appendChild(span);

    const button = document.createElement("button");
    button.innerText = "❌";
    button.onclick = (event) => event.target.parentElement.remove();
    li.appendChild(button);

    todoList.appendChild(li);
}

todoForm.onsubmit = (event) => {
    event.preventDefault();
    const newTodo = todoInput.value;
    updateTodo(newTodo);
    todoInput.value = "";
}