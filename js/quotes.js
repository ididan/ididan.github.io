const quotes = [
    {
        qoute: "q 1",
        author: "a 1",
    },
    {
        qoute: "q 2",
        author: "a 2",
    },
    {
        qoute: "q 3",
        author: "a 3",
    },
    {
        qoute: "q 4",
        author: "a 4",
    },
    {
        qoute: "q 5",
        author: "a 5",
    },
]

const quote = document.querySelector("#quote span:first-child");
const author = document.querySelector("#quote span:last-child");

const random = Math.floor(Math.random() * quotes.length)
const todayQuote = quotes[random];
quote.innerText = todayQuote.qoute;
author.innerText = todayQuote.author;
