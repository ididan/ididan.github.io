//const loginForm = document.getElementById("login-form");
const loginForm = document.querySelector("#login-form");
const loginInput = loginForm.querySelector("input");

const login = (event)=>{
    // form 에서 submit 될때 browser 가 refresh 되는 기본 동작을 막아줌
    event.preventDefault();
    console.dir(event);
    // 위에서 막아서 username 을 우리가 처리할수 있도록 함
    const username = loginInput.value
    console.log(username);
}
loginForm.onsubmit = login

//loginForm.addEventListener("submit", login)
const loginButton = loginForm.querySelector("button");

// const loginInput = document.querySelector("#login-form input");
// const loginButton = document.querySelector("#login-form button");

loginButton.onclick = () => {
    const username = loginInput.value
    console.dir(loginInput);
    // if (username === "") {
    //     alert("Please write your name");
    // } else if (username.length > 15) {
    //     alert("Your name is too long");
    // }

    console.log("login clicked " + username);
}