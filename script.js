const textForm = document.querySelector(".text-form")
const sortForm = document.querySelector(".sort-form")

const list = new Array();
let nextID = 0;

document.addEventListener("click", function (e) {
  let target = e.target.closest(".edit-btn");
  if (target) {
    const elementContainer = target.closest(".element-container");
    const elementNode = target.closest("li");
    const editForm = elementNode.querySelector(".edit-form");
    const input = editForm.querySelector("input");

    // Скрыть элемент и показать форму редактирования
    elementContainer.hidden = true;
    editForm.hidden = false;

    // Меняем текст поля на текст элемента
    input.value = getElementById(Number(elementNode.id)).text;
  }

  target = e.target.closest(".remove-btn");
  if (target) {
    const elementNode = target.closest("li");
    removeElement(Number(elementNode.id));
  }

  target = e.target.closest(".confirm-btn");
  if (target) {
    e.preventDefault();

    const editForm = target.closest(".edit-form");
    const elementNode = editForm.closest("li")
    const elementContainer = elementNode.querySelector(".element-container");;
    const editInput = editForm.querySelector("input");
    const editValue = editInput.value.trim();

    // Валидация отредактированного текста
    if (!editValue) {
      editInput.classList.add("is-invalid");
      return;
    }

    // Скрыть форму редактирования и показать элемент
    editForm.hidden = true;
    elementContainer.hidden = false;

    // Меняем текст
    getElementById(Number(elementNode.id)).text = editValue;

    // Убираем ошибку валидации, если она была
    editInput.classList.remove("is-invalid");

    sortList();
  }

  target = e.target.closest(".cancel-btn");
  if (target) {
    e.preventDefault();

    const editForm = target.closest(".edit-form");
    const editInput = editForm.querySelector("input");
    const elementNode = editForm.closest("li")
    const elementContainer = elementNode.querySelector(".element-container");;

    // Скрыть форму редактирования и показать элемент
    editForm.hidden = true;
    elementContainer.hidden = false;

    // Убираем ошибку валидации, если она была
    editInput.classList.remove("is-invalid");
  }
});

textForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const textInput = this.querySelector(".text-input");
  const inputValue = textInput.value.trim();

  // Очищаем поле ввода
  textInput.value = "";

  // Валидация текста
  if (!inputValue) {
    textInput.classList.add("is-invalid");
    return;
  }

  addElement({ id: getNewID(), text: inputValue });

  // Убираем ошибку валидации, если она была
  textInput.classList.remove("is-invalid");
});

sortForm.addEventListener("change", sortList);

function renderList() {
  const listNode = document.querySelector(".list");

  // Очищаем список
  listNode.innerHTML = "";

  for (const element of list) {
    listNode.appendChild(createElementNode(element));
  }
}

function addElement(element) {
  list.push(element);
  sortList();
}

function getElementById(id) {
  return list.find(function (element) {
    return element.id === id;
  });
}

function removeElement(id) {
  const index = list.findIndex(function (element) {
    return element.id === id;
  });
  list.splice(index, 1);
  renderList();
}

function createElementNode(element) {
  const elementContainer = createElementContainer(element.text);

  const editForm = createEditForm();
  editForm.hidden = true;
  const elementID = createElementID(element.id);

  const elementNode = document.createElement("li");

  elementNode.classList.add("list-group-item");

  elementNode.appendChild(elementID);
  elementNode.appendChild(elementContainer);
  elementNode.appendChild(editForm);

  elementNode.id = element.id;

  return elementNode;
}

function getNewID() {
  return nextID++;
}

function createElementID(id) {
  const elementID = document.createElement("div");
  elementID.classList.add("element-id");
  elementID.innerText = id;

  return elementID;
}

function createEditForm() {
  const editForm = document.createElement("form");
  editForm.classList.add("edit-form");

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

  cancelButton.classList.add("btn", "btn-danger", "cancel-btn");
  cancelButton.appendChild(cancelButtonText);

  return cancelButton;
}

function createConfirmButton() {
  const confirmButton = document.createElement("button");
  const confirmButtonText = document.createTextNode("Ок");

  confirmButton.classList.add("btn", "btn-success", "confirm-btn");
  confirmButton.type = "submit";
  confirmButton.appendChild(confirmButtonText);

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

  return closeButton;
}

function createEditButton() {
  const editButton = document.createElement("button");
  const editButtonText = document.createTextNode("Редактировать");

  editButton.classList.add("btn", "btn-secondary", "edit-btn")
  editButton.appendChild(editButtonText);

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

  list.sort(compareFunction);
  renderList();
}

function sortDecNum(a, b) {
  return !sortIncNum(a, b);
}

function sortIncNum(a, b) {
  return a.id > b.id;
}

function sortInvAlphabet(a, b) {
  return !sortAlphabet(a, b);
}

function sortAlphabet(a, b) {
  return a.text > b.text;
}
