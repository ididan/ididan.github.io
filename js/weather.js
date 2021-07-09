const API_KEY = "f758a1c5ad3b87686c72f27ef8ca04e0";

const locationPosition = navigator.geolocation.getCurrentPosition(
    (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
        fetch(url)
            .then(response => response.json())
            .then(data => { 
                const weather = document.querySelector("#weather span:first-child");
                const city = document.querySelector("#weather span:last-child");
                city.innerText = data.name;
                weather.innerText = `${data.weather[0].main} / ${data.main.temp}`;
            });
    },
    () => {
        alert("Can't find you. No weather for you.")
    });
