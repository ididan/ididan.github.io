// https://www.pexels.com/api/documentation/
const API_KEY = "563492ad6f91700001000001d53d7f62576d44149d3aa90dec0b218e";

const imageUrl = "https://api.pexels.com/v1/search?query=nature&per_page=1"
fetch(imageUrl)
    .then(response => response.json())
    .then(data => {
        const url = data.photos[0].src.original;
        
        const bgImage = document.createElement("img");
        bgImage.src = url;

        document.body.appendChild(bgImage);
    });