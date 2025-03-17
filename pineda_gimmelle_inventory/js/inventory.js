let inventoryOptions = [
    { id: "101", name: "gloves", quantity: 10, price: 80 },
    { id: "102", name: "onion", quantity: 25, price: 20 },
    { id: "103", name: "pepper", quantity: 15, price: 50 },
    { id: "104", name: "Msg", quantity: 8, price: 150 },
    { id: "105", name: "sugar", quantity: 5, price: 200 },
    { id: "106", name: "brown sugar", quantity: 12, price: 80 },
    { id: "107", name: "salt", quantity: 18, price: 40 },
    { id: "108", name: "cofee", quantity: 20, price: 60 },
    { id: "109", name: "milk", quantity: 50, price: 10 },
    { id: "110", name: "rice", quantity: 7, price: 500 }
];

let inventory = [];

function loadDropdown() {
    let select = document.getElementById("search");
    inventoryOptions.forEach(item => {
        let option = document.createElement("option");
        option.value = item.id;
        option.textContent = `${item.name}`;
        select.appendChild(option);
    });
}

function renderInventory() {
    let tbody = document.getElementById("inventory-body");
    tbody.innerHTML = "";
    inventory.forEach((item) => {
        let row = `<tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>$${item.price}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editProduct('${item.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct('${item.id}')">Delete</button>
            </td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function addProduct() {
    let select = document.getElementById("search");
    let productId = select.value;
    if (!productId) {
        alert("Please select a product.");
        return;
    }

    let selectedProduct = inventoryOptions.find(item => item.id === productId);
    if (inventory.some(item => item.id === productId)) {
        alert("Product already added.");
        return;
    }

    inventory.push({ ...selectedProduct });
    renderInventory();
}

function editProduct(id) {
    let product = inventory.find(item => item.id === id);
    let newQuantity = prompt(`Edit quantity for ${product.name}:`, product.quantity);
    if (newQuantity !== null && !isNaN(newQuantity) && newQuantity > 0) {
        product.quantity = parseInt(newQuantity);
        renderInventory();
    } else {
        alert("Invalid quantity. Please enter a number.");
    }
}

function deleteProduct(id) {
    inventory = inventory.filter(item => item.id !== id);
    renderInventory();
}

document.addEventListener("DOMContentLoaded", () => {
    loadDropdown();
    renderInventory();
});