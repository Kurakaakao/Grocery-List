// ****** SELECT ITEMS **********
const _alert = document.querySelector(".alert");
const _form = document.querySelector(".grocery-form");
const _grocery = document.getElementById("grocery");
const _submitBtn = document.querySelector(".submit-btn");
const _container = document.querySelector(".grocery-container");
const _list = document.querySelector(".grocery-list");
const _clearBtn = document.querySelector(".clear-btn");

// edit option
let editElement;
let editFlag = false;
let editID = "";

// ****** EVENT LISTENERS **********
_form.addEventListener("submit", addItem);
// Clear items
_clearBtn.addEventListener("click", clearItems)
// Load items
window.addEventListener("DOMContentLoaded", setupItems);

// ****** FUNCTIONS **********
function addItem(event) {
    event.preventDefault();
    const value = grocery.value; // Gets value inserted into the form
    const id = new Date().getTime().toString();
    // If edit mode isnt on, form is being added 
    if (value !== "" && !editFlag) {
        createListItem(id, value);
        displayAlert("Item added to the list", "success");
        // Show container
        _container.classList.add("show-container");
        // Add to local storage
        addToLocalStorage(id,value);
        // Set back to default
        setBackToDefault();

    // If editing mode is on, form edits instead of adds 
    } else if (value !== "" && editFlag) {
        editElement.innerHTML = value;
        displayAlert("value changed", "success"); 
        editLocalStorage(editID, value);
        setBackToDefault();
    // Nothing added
    } else {
        displayAlert("Please enter value", "danger")
    }
}
// Alert the user of their inserted empty value
function displayAlert(text,action) {
    _alert.textContent = text;
    _alert.classList.add(`alert-${action}`);
    setTimeout(() => {
        _alert.textContent = "";
        _alert.classList.remove(`alert-${action}`);
    }, 1000);
}
function clearItems() {
    const groceryArray = document.querySelectorAll(".grocery-item");
    if (groceryArray.length > 0) {
        groceryArray.forEach((item) => {
            _list.removeChild(item);
        });
    }
    _container.classList.remove("show-container");
    displayAlert("All items removed from list", "danger");
    setBackToDefault();
    // Remove the entire list of local storage items when you clear all items from the grocery list
    localStorage.removeItem("list");    
}
function deleteItem(event) {
    const element = event.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    _list.removeChild(element);

    if (_list.children.length === 0) {
        _container.classList.remove("show-container");
    }
    displayAlert("item removed", "danger");
    setBackToDefault();
    removeFromLocalStorage(id);
}
function editItem(event) {
    const element = event.currentTarget.parentElement.parentElement;
    // set Edit item
    editElement = event.currentTarget.parentElement.previousElementSibling;
    // Set form value
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    _submitBtn.textContent = "edit";
}
// Set back to default
function setBackToDefault() {
    grocery.value = "";
    editFlag = false;
    editID = "";
    _submitBtn.textContent = "Submit";
}
// ****** LOCAL STORAGE **********
function addToLocalStorage(id,value) {  
    const grocery = {id, value};                                // id = created objects unique ID, value = objects name {id:id, value:value} = {id,value}
    let groceryArray = localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))                  // IF   Ternary operator 
    : [];                                                       // ELSE
    /*Alternative way of typing the ternary operator:

    if (JSON.parse(localStorage.getItem("list"))) {
        groceryArray.push(grocery)
    } else {
        localStorage.setItem("list", JSON.stringify(groceryArray));
    }*/
    groceryArray.push(grocery);                                 // If local storage has an object in it, the next object being added in it is pushed to the end of the array(storage)             
    localStorage.setItem("list",JSON.stringify(groceryArray));  // If there is nothing yet, we'll set up an initial value to act as the first object in the storage
    //console.log(groceryArray);
}
function getLocalStorage() {
    return localStorage.getItem("list")
        ? JSON.parse(localStorage.getItem("list"))
        : [];
}
function removeFromLocalStorage(id) {
    let groceryArray = getLocalStorage();
    groceryArray = groceryArray.filter((item) => {
        if (item.id !==id) {
            return item;
        }       
    });
    localStorage.setItem("list", JSON.stringify(groceryArray));
}
function editLocalStorage(id, value) {
    let groceryArray = getLocalStorage();
    groceryArray = groceryArray.map((item) => {
        if (item.id === id) {
            item.value = value;                                 // Adjust items value to the edited value if the ID of the item and the item that is being edited match
        }
        return item;                                            // If they dont, return the item as normal
    });
    localStorage.setItem("list", JSON.stringify(groceryArray));
}
// ****** SETUP ITEMS **********
function setupItems() {
    let groceryArray = getLocalStorage();
    if (groceryArray.length > 0) {
        groceryArray.forEach((item) => {
            createListItem(item.id, item.value);
        })
    _container.classList.add("show-container");
    }
}

function createListItem(id, value) {
    const element = document.createElement("article");  
    const attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add("grocery-item");

    element.innerHTML = `<p class="title">${value}</p>
    <div class="btn-container">
        <button type="button" class="edit-btn">
            <i class="fas fa-edit"></i>
        </button>
        <button type="button" class="delete-btn">
            <i class="fas fa-trash"></i>
        </button>
    </div>`;

    const _deleteBtn = element.querySelector(".delete-btn");
    _deleteBtn.addEventListener("click", deleteItem);
    const _editBtn = element.querySelector(".edit-btn");
    _editBtn.addEventListener("click", editItem);

    // Append child
    _list.appendChild(element);
}
