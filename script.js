const form = document.querySelector(".needs-validation")
const textInput = document.querySelector(".text-input");
const list = document.querySelector(".list");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const inputValue = textInput.value.trim();
  textInput.value = "";

  if (!inputValue) {
    form.classList.add("was-validated");
    return 0;
  }

  const newListElement = document.createElement("li");
  const content = document.createTextNode(inputValue);
  newListElement.appendChild(content);
  list.appendChild(newListElement);

  form.classList.remove("was-validated");
});