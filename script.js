let addButton = document.querySelector('.add-btn');
let textInput = document.querySelector('.text-input');
let list = document.querySelector('.list');

addButton.onclick = function() {
    if(textInput.value)
    {
        let newListElement = document.createElement("li");
        let content = document.createTextNode(textInput.value);
        newListElement.appendChild(content);
        list.appendChild(newListElement);

        textInput.value = "";
    }
}