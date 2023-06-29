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
    const editInput = editForm.querySelector("input");

    // Скрыть элемент и показать форму редактирования
    elementContainer.hidden = true;
    editForm.hidden = false;

    // Меняем текст поля на текст элемента
    editInput.value = getElementById(Number(elementNode.id)).text;
  }

  target = e.target.closest(".remove-btn");
  if (target) {
    const elementNode = target.closest("li");
    removeElement(Number(elementNode.id));
  }

  target = e.target.closest(".confirm-btn");
  if (target) {
    e.preventDefault();

    const elementNode = target.closest("li");
    const elementContainer = elementNode.querySelector(".element-container");
    const editForm = target.closest(".edit-form");
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

    const elementNode = target.closest("li");
    const elementContainer = elementNode.querySelector(".element-container");
    const editForm = target.closest(".edit-form");
    const editInput = editForm.querySelector("input");

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
  const elementNode = document.createElement("li");
  
  elementNode.classList.add("list-group-item");

  elementNode.innerHTML = `
  <div class="element-id">${element.id}</div>
  <div class="element-container">
    <p>${element.text}</p>
    <hr>
    <button class="btn btn-secondary edit-btn">Редактировать</button>
    <button class="btn-close remove-btn"></button>
  </div>
  <form class="edit-form" hidden>
    <input class="form-control edit-input" type="text">
    <div class="invalid-feedback">Введите непустую строку</div>
    <hr>
    <button class="btn btn-success confirm-btn" type="submit">Ок</button>
    <button class="btn btn-danger cancel-btn">Отмена</button>
  </form>
  `;

  elementNode.id = element.id;

  return elementNode;
}

function getNewID() {
  return nextID++;
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
