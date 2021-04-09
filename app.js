// ****** SELECT ITEMS **********
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.querySelector("#grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");
grocery.focus();

// edit option
let editElement;
let editFlag = false;
let editID = "";

// ****** EVENT LISTENERS **********
//submit form
form.addEventListener("submit", addItem);

//clear items
clearBtn.addEventListener("click", clearItems);

//load items on page load
window.addEventListener("DOMContentLoaded", loadItems);

// ****** FUNCTIONS **********
function addItem(e) {
  e.preventDefault();
  const value = grocery.value.toString();
  const id = new Date().getTime().toString();
  if (value && !editFlag) {
    createItem(id, value);
    //making it visible
    container.classList.add("show-container");
    // set local storage
    addToLocalStorage(id, value);
    //set to preventDefault
    setBackToDefault();
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert("edited element", "success");
    //edit local storage
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert("pleaser eneter a value", "danger");
  }
  grocery.focus();
}

function clearItems() {
  //getting all grocery items and removing them from their parent
  const items = document.querySelectorAll(".grocery-item");
  items.forEach(function (item) {
    list.removeChild(item);
  });
  container.classList.remove("show-container");
  displayAlert("list cleared", "success");
  setBackToDefault();
  localStorage.removeItem("list");
}

//display alert
function displayAlert(text, action) {
  alert.innerHTML = text;
  alert.classList.add(`alert-${action}`);

  //remove alert
  setTimeout(function () {
    alert.innerHTML = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

//editing item
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  //grab edit element
  editElement = e.currentTarget.parentElement.previousElementSibling;
  //set input value
  grocery.value = editElement.innerText;

  editFlag = true;
  editID = id;
  submitBtn.innerHTML = "edit";

  grocery.focus();
}

//deleting item
function deleteItem(e) {
  const element = e.target.parentElement.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);
  if (list.children.length === 0) {
    container.classList.remove("show-container");
    displayAlert("no more items left", "danger");
  }
  setBackToDefault();
  //remove from local storage
  removeFromLocalStorage(id);
}

//setting default global values;
function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.innerHTML = "submit";
}

// ****** LOCAL STORAGE **********
function getLocalStorage() {
  return localStorage.getItem("list") === null
    ? []
    : JSON.parse(localStorage.getItem("list"));
}

function addToLocalStorage(id, value) {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();

  items = items.filter(function (item) {
    return item.id != id;
  });

  localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
  let items = getLocalStorage();

  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

//Local storage API
//setItem
//getItem
//removeItem
//save as string with stringify
//parse back into original values with parse
//Example:
// localStorage.setItem("orange", JSON.stringify(["item1", "item2", "item3"]));
// const data = JSON.parse(localStorage.getItem("orange"));
// console.log(data);
// localStorage.removeItem("orange");
// ****** SETUP ITEMS **********
function createItem(id, value) {
  //creating element and attribute dynamically
  const element = document.createElement("article");
  let attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.classList.add("grocery-item");
  element.innerHTML = `
            <p class="title">${value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>`;
  //deleting and editing items
  const deleteBtn = element.querySelector(".delete-btn");
  const editBtn = element.querySelector(".edit-btn");
  deleteBtn.addEventListener("click", deleteItem);
  editBtn.addEventListener("click", editItem);
  //appending the element to groceries container
  list.appendChild(element);
}

function loadItems() {
  let items = getLocalStorage();
  items.forEach(function (item) {
    createItem(item.id, item.value);
  });
  if (items.length > 0) container.classList.add("show-container");
}
