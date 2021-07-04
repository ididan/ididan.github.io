// <⚠️ DONT DELETE THIS ⚠️>
//import "./styles.css";
const colors = ["#1abc9c", "#3498db", "#9b59b6", "#f39c12", "#e74c3c"];
// <⚠️ /DONT DELETE THIS ⚠️>

/*
✅ The text of the title should change when the mouse is on top of it.
✅ The text of the title should change when the mouse is leaves it.
✅ When the window is resized the title should change.
✅ On right click the title should also change.
✅ The colors of the title should come from a color from the colors array.
✅ DO NOT CHANGE .css, or .html files.
✅ ALL function handlers should be INSIDE of "superEventHandler"
*/
let index = 0
const text = document.querySelector("body h2");
const updateColor = () => { text.style.color = colors[index++ % 5] }
const superEventHandler = {
    onMouseOver: () => { text.innerText = "Mouse over"; updateColor(); },
    onMouseLeave: () => { text.innerText = "Mouse leave"; updateColor(); },
    onWindowResize: () => { text.innerText = "Window resize as " + window.innerWidth; updateColor(); },
    onWindowContextMenu: () => { text.innerText = "Context menu was clicked"; updateColor(); }
};

window.addEventListener("resize", superEventHandler.onWindowResize)
window.addEventListener("contextmenu", superEventHandler.onWindowContextMenu)

text.addEventListener("mouseover", superEventHandler.onMouseOver)
text.addEventListener("mouseleave", superEventHandler.onMouseLeave)
text.addEventListener("click", superEventHandler.onMouseOver)

console.dir(document);


const background = (color) => {
    console.log(color);
    document.body.style.backgroundColor = color;
  };
  
  const onWindowResized = () => {
    console.log(window.innerWidth);
    if (window.innerWidth > "700") {
      background("blue");
    } else if (window.innerWidth > "600") {
      background("purple");
    } else if (window.innerWidth > "500") {
      background("yellow");
    }
  };
  
  window.onresize = onWindowResized;