// https://www.pexels.com/api/documentation/
const API_KEY_IMAGE = "563492ad6f91700001000001d53d7f62576d44149d3aa90dec0b218e";

const imageUrl = "https://api.pexels.com/v1/search?query=nature"
fetch(imageUrl, { headers: { 'Authorization': API_KEY_IMAGE, }, })
    .then(response => response.json())
    .then(data => {
        let url;
        if (data.photos == null) {
            url = "https://images.pexels.com/photos/624015/pexels-photo-624015.jpeg"
        } else {
            const index = Math.floor(Math.random() * data.photos.length);
            url = data.photos[index].src.original;
        }
        document.body.style.background = `no-repeat center/100% url("${url}")`;
    });