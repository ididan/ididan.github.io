const url = "https://quotes.rest/qod";
fetch(url)
    .then(response => response.json())
    .then(data => {
        const quote = document.querySelector("#quote span:first-child");
        const author = document.querySelector("#quote span:last-child");
        const q = data.contents.quotes[0];
        quote.innerText = q.quote;
        author.innerText = q.author;
        console.log(data);
    });