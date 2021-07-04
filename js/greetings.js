//const loginForm = document.getElementById("login-form");
const loginForm = document.querySelector("#login-form");
const loginInput = loginForm.querySelector("input");
const greeting = document.querySelector("#greeting");

const HIDDEN_CLASSNAME = "hidden";
const USERNAME_KEY = "username";

const login = (event) => {
    // form 에서 submit 될때 browser 가 refresh 되는 기본 동작을 막아줌
    event.preventDefault();
    console.dir(event);
    // 위에서 막아서 username 을 우리가 처리할수 있도록 함
    const username = loginInput.value;
    console.log(username);

    loginForm.classList.add(HIDDEN_CLASSNAME);

    localStorage.setItem(USERNAME_KEY, username);
    showGreetings(username);
}

const link = document.querySelector("a")
link.onclick = (event) => {
    event.preventDefault();
    console.log(event);

    //alert("clicked!");
}

const username = localStorage.getItem(USERNAME_KEY);
console.log(username);

const showGreetings = (username)=>{
    greeting.classList.remove(HIDDEN_CLASSNAME);
    greeting.innerText = `Hello ${username}`;
}

if (username === null) {
    loginForm.classList.remove(HIDDEN_CLASSNAME);
    loginForm.onsubmit = login
} else {
    showGreetings(username);
}
