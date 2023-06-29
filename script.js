const textForm = document.querySelector(".text-form")
const sortForm = document.querySelector(".sort-form")

textForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const textInput = this.querySelector(".text-input");
  const inputValue = textInput.value.trim();

  // Очищаем поле ввода
  textInput.value = "";

  // Валидация текста
  if (!inputValue) {
    textInput.classList.add("is-invalid");
    return;
  }

  addElement(inputValue);

  // Убираем ошибку валидации, если она была
  textInput.classList.remove("is-invalid");
});

sortForm.addEventListener("change", function () {
  sortList();
})

function addElement(text) {
  const list = document.querySelector(".list");

  list.appendChild(createElement(text));

  sortList();
}

function createElement(text) {
  const elementContainer = createElementContainer(text);

  const editForm = createEditForm();
  editForm.hidden = true;
  const elementID = createElementID(getFreeID());

  const element = document.createElement("li");

  element.classList.add("list-group-item");

  element.appendChild(elementID);
  element.appendChild(elementContainer);
  element.appendChild(editForm);

  return element;
}

function getFreeID() {
  const list = document.querySelector(".list");
  const elements = list.querySelectorAll("li");
  let lastID = -1;

  // Ищем максимальный ID среди элементов
  elements.forEach(function (element) {
    const elementID = Number(element.querySelector(".element-id").textContent);
    if (lastID < elementID) {
      lastID = elementID;
    }
  });

  return lastID + 1;
}

function createElementID(id) {
  const elementID = document.createElement("div");
  elementID.classList.add("element-id");
  elementID.innerText = id;

  return elementID;
}

function createEditForm() {
  const editForm = document.createElement("form");
  editForm.classList.add("edit-controls-form");

  const input = document.createElement("input");
  input.classList.add("form-control", "edit-input");
  input.type = "text";

  const invalidFeedback = document.createElement("div");
  const invalidFeedbackText = document.createTextNode("Введите непустую строку");
  invalidFeedback.classList.add("invalid-feedback");
  invalidFeedback.appendChild(invalidFeedbackText);

  const cancelButton = createCancelButton();
  const confirmButton = createConfirmButton();

  editForm.appendChild(input);
  editForm.appendChild(invalidFeedback);
  editForm.appendChild(document.createElement("hr"));
  editForm.appendChild(confirmButton);
  editForm.appendChild(cancelButton);

  return editForm;
}

function createCancelButton() {
  const cancelButton = document.createElement("button");
  const cancelButtonText = document.createTextNode("Отмена");

  cancelButton.classList.add("btn", "btn-danger", "btn-cancel");
  cancelButton.appendChild(cancelButtonText);

  cancelButton.addEventListener("click", function (event) {
    event.preventDefault();

    const editForm = this.parentElement;
    const editInput = editForm.querySelector("input");
    const element = editForm.parentElement.querySelector(".element-container");

    // Скрыть форму редактирования и показать элемент
    editForm.hidden = true;
    element.hidden = false;

    // Убираем ошибку валидации, если она была
    editInput.classList.remove("is-invalid");
  });

  return cancelButton;
}

function createConfirmButton() {
  const confirmButton = document.createElement("button");
  const confirmButtonText = document.createTextNode("Ок");

  confirmButton.classList.add("btn", "btn-success", "confirm-btn");
  confirmButton.type = "submit";
  confirmButton.appendChild(confirmButtonText);

  confirmButton.addEventListener("click", function (event) {
    event.preventDefault();

    const editForm = this.parentElement;
    const element = editForm.parentElement.querySelector(".element-container");
    const editInput = editForm.querySelector("input");
    const editValue = editInput.value.trim();

    // Валидация отредактированного текста
    if (!editValue) {
      editInput.classList.add("is-invalid");
      return;
    }

    // Скрыть форму редактирования и показать элемент
    editForm.hidden = true;
    element.hidden = false;

    // Меняем текст
    element.firstChild.textContent = editValue;

    // Убираем ошибку валидации, если она была
    editInput.classList.remove("is-invalid");

    sortList();
  });

  return confirmButton;
}

function createElementContainer(text) {
  const elementContainer = document.createElement("div");
  const content = document.createTextNode(text);
  const p = document.createElement("p");
  p.appendChild(content);

  elementContainer.classList.add("element-container");

  elementContainer.appendChild(p);
  elementContainer.appendChild(document.createElement("hr"));
  elementContainer.appendChild(createEditButton());
  elementContainer.appendChild(createRemoveButton());

  return elementContainer;
}

function createRemoveButton() {
  const closeButton = document.createElement("button");
  closeButton.classList.add("btn-close", "remove-btn");
  closeButton.addEventListener("click", function () {
    this.parentElement.parentElement.remove();
  });

  return closeButton;
}

function createEditButton() {
  const editButton = document.createElement("button");
  const editButtonText = document.createTextNode("Редактировать");

  editButton.classList.add("btn", "btn-secondary", "edit-btn")
  editButton.appendChild(editButtonText);
  editButton.addEventListener("click", function () {
    const element = this.parentElement;
    const editForm = element.parentElement.querySelector(".edit-controls-form");
    const input = editForm.querySelector("input");

    // Скрыть элемент и показать форму редактирования
    element.hidden = true;
    editForm.hidden = false;

    // Меняем текст поля на текст элемента
    input.value = element.firstChild.textContent;
  });

  return editButton;
}

function getSelectedSort() {
  const form = document.querySelector(".sort-form");
  const radios = form.querySelectorAll("input");

  // Находим выбранную сортировку
  let selectedSort;
  for (const radio of radios) {
    if (radio.checked) {
      selectedSort = radio.id;
      break;
    }
  }

  return selectedSort;
}

function sortList() {
  const list = document.querySelector(".list");
  const elements = list.querySelectorAll("li");

  const selectedSort = getSelectedSort();

  let compareFunction;
  switch (selectedSort) {
    case "incNumRadio":
      compareFunction = sortIncNum;
      break;
    case "decNumRadio":
      compareFunction = sortDecNum;
      break;
    case "alphabetRadio":
      compareFunction = sortAlphabet;
      break;
    case "invAlphabetRadio":
      compareFunction = sortInvAlphabet;
      break;
    default:
      break;
  }

  const sortedElements = [].slice.call(elements).sort(compareFunction);

  for (const element of sortedElements) {
    list.appendChild(element);
  }
}

function sortDecNum(a, b) {
  return !sortIncNum(a, b);
}

function sortIncNum(a, b) {
  const aID = Number(a.querySelector(".element-id").textContent);
  const bID = Number(b.querySelector(".element-id").textContent);
  return aID > bID;
}

function sortInvAlphabet(a, b) {
  return !sortAlphabet(a, b);
}

function sortAlphabet(a, b) {
  const aID = a.querySelector("p").textContent;
  const bID = b.querySelector("p").textContent;
  return aID > bID;
}
