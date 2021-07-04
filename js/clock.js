const clock = document.querySelector("#clock")
const timeString = (numString) => (numString.toString().padStart(2, "0"));
const updateClock = () => {
    const date = new Date();
    clock.innerText = `${timeString(date.getHours())}`
        + `:${timeString(date.getMinutes())}`
        + `:${timeString(date.getSeconds())}`;
}
setInterval(updateClock, 1_000);
updateClock();