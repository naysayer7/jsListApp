const form = document.querySelector(".needs-validation")

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const textInput = this.querySelector(".text-input");
  const list = document.querySelector(".list");
  const inputValue = textInput.value.trim();
  textInput.value = "";

  if (!inputValue) {
    textInput.classList.add("is-invalid");
    return;
  }

  const elementContainer = createElementContainer();
  elementContainer.querySelector("p").textContent = inputValue;

  const editForm = createEditForm();
  editForm.hidden = true;

  const newListElement = document.createElement("li");
  newListElement.classList.add("list-group-item");
  newListElement.appendChild(elementContainer);
  newListElement.appendChild(editForm);
  list.appendChild(newListElement);

  // Убираем ошибку валидации, если она была
  textInput.classList.remove("is-invalid");
});

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

    const editControls = this.parentElement;
    const element = editControls.parentElement.querySelector(".element-container");

    // Скрыть форму редактирования и показать элемент
    editControls.hidden = true;
    element.hidden = false;
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
  });

  return confirmButton;
}

function createElementContainer() {
  const elementContainer = document.createElement("div");
  const content = document.createTextNode("");
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