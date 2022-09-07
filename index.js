const groceryItemForm = document.querySelector("#grocery-item-form");
const groceryItemName = document.querySelector("#grocery-item-name");
const groceryItemDescription = document.querySelector(
  "#grocery-item-description"
);
const addItemButton = document.querySelector("#add-item-btn");
const filterItemsInput = document.querySelector("#filter");
const groceryList = document.querySelector(".item-list");
const clearListButton = document.querySelector("#clear-list-btn");
const cancelButton = document.querySelector("#cancel-btn");
const editButton = document.querySelector("#edit-btn");
const groceryModeTitle = document.querySelector("#grocery-mode-title");

let itemIdCounter = 0;

loadEventListeners();

function loadEventListeners() {
  document.addEventListener("DOMContentLoaded",init)
  groceryItemForm.addEventListener("submit", addItemToList);
  clearListButton.addEventListener("click", clearList);

}

function init() {
  groceryItemForm.setAttribute('mode','add');
  retrieveItemsFromLocalStorage()
}

function addItemToList(e) {
  e.preventDefault();

  let itemName = groceryItemName.value;
  let itemDescription = groceryItemDescription.value;

  if (itemName === "" || itemDescription === "") {
    alert("You have to fill all information to add a new item! Try again.");
    return;
  }

  createItem(itemName, itemDescription);

  groceryItemName.value = "";
  groceryItemDescription.value = "";

  saveItemsToLocalStorage({name:itemName, description:itemDescription, id:itemIdCounter})

  itemIdCounter++;
}

function createItem(itemName, itemDescription, itemId=null) {
  const li = document.createElement("li");
  li.className = "collection-item";
  li.id === null? li.id=`item-${itemIdCounter}`:li.id=`item-${itemId}` ;

  li.innerHTML = `
        <div class="item-info">
            <h5 class="item-name">${itemName}</h5>
            <span class="item-description">${itemDescription}</span>
        </div>
    `;
  const removeButton = document.createElement("a");
  removeButton.innerHTML = '<i class="fa fa-remove"></i>';
  removeButton.style = "cursor: pointer";
  removeButton.classList = "delete-item ";

  removeButton.addEventListener("click", removeItemFromList);

  const editButton = document.createElement("a");
  editButton.innerHTML = '<i class="fa fa-edit"></i>';
  editButton.style = "cursor: pointer;";
  editButton.classList = "edit-item ";
  editButton.addEventListener("click", editItemFromList);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList = "button-container";
  buttonContainer.appendChild(removeButton);
  buttonContainer.appendChild(editButton);

  li.appendChild(buttonContainer);

  groceryList.appendChild(li);
}

function removeItemFromList(e) {
  if (e.target.parentElement.classList.contains("delete-item")) {
    if (confirm("Are you sure?")) {
      let groceryItem = e.target.parentElement.parentElement.parentElement;
      groceryItem.remove();
      removeItemFromLocalStorage(groceryItem.id.split('-')[1]);
    }
  }
  e.preventDefault();
}

function editItemFromList(e) {
  e.preventDefault();
  let itemElement = e.target.parentElement.parentElement.parentElement;
  let itemNameToEdit = itemElement.children[0].children[0].innerText;
  let itemDescriptionToEdit = itemElement.children[0].children[1].innerText;
  // console.log(itemNameToEdit,itemDescriptionToEdit);
  groceryItemName.value = itemNameToEdit;
  groceryItemDescription.value = itemDescriptionToEdit;
  itemElement.remove();
}

function clearList(e) {
  e.preventDefault();
  while (groceryList.firstChild) {
    groceryList.firstChild.remove();
  }
  clearItemsFromLocalStorage();
}

const filterItem = (e) => {
  e.preventDefault();
  let filterValue = filterItemsInput.value;
  groceryList.querySelectorAll(".collection-item").forEach((indItem) => {
    const itemName = indItem
      .querySelector(".item-name")
      .innerHTML.toLowerCase();
    if (itemName.indexOf(filterValue) != -1) {
      indItem.style.display = "flex";
    } else {
      indItem.style.display = "none";
    }
  });
};
filterItemsInput.addEventListener("input", filterItem);



// save items to localstorage 

function saveItemsToLocalStorage(item) {
  let groceryItems = localStorage.getItem("grocery-items");
  if(groceryItems!== null){
    groceryItems= JSON.parse(groceryItems);
  }else{
    groceryItems = {};
  }
  groceryItems[item.id]={name:item.name, description:item.description,id:item.id};
  localStorage.setItem("groceryItems", JSON.stringify(groceryItems));
}

// remove item from local storage
function removeItemFromLocalStorage(id){
  let groceryItems = localStorage.getItem("groceryItems");
  if(groceryItems!==null){
    groceryItems=JSON.parse(groceryItems)
  }
  else{
    groceryItems={};
  }
  if(groceryItems[id]){
    delete groceryItems[id];
    localStorage.setItem("groceryItems", JSON.stringify(groceryItems))
  }
}


// clear items from local storage
function clearItemsFromLocalStorage() {
  localStorage.clear();
}

//retrieve items from local storage

function retrieveItemsFromLocalStorage() {
  let groceryItems = localStorage.getItem("groceryItems");
  if(groceryItems!==null){
    groceryItems=JSON.parse(groceryItems)
  }
  else{
    groceryItems={};
  }
  for(let id in groceryItems){
    createItem(groceryItems[id].name, groceryItems[id].description, groceryItems[id].id);
  }
  if(groceryList.children.length>0){
    itemIdCounter=Number(groceryList.lastChild.getAttribute('id').replace('item-',""))+1;
  }
  
}