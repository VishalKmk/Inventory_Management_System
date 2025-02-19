// script.js
const API_URL = 'http://localhost:8080/items';

// Form handling
const itemForm = document.getElementById('itemForm');
const itemId = document.getElementById('itemId');
const nameInput = document.getElementById('name');
const descriptionInput = document.getElementById('description');
const quantityInput = document.getElementById('quantity');
const priceInput = document.getElementById('price');
const minimumQuantityInput = document.getElementById('minimumQuantity');
const reorderQuantityInput = document.getElementById('reorderQuantity');

// Edit Popup
const editPopup = document.getElementById('editPopup');
const editForm = document.getElementById('editForm');
const editItemId = document.getElementById('editItemId');
const editName = document.getElementById('editName');
const editDescription = document.getElementById('editDescription');
const editQuantity = document.getElementById('editQuantity');
const editPrice = document.getElementById('editPrice');
const editMinimumQuantity = document.getElementById('editMinimumQuantity');
const editReorderQuantity = document.getElementById('editReorderQuantity');

// Load items on page load
document.addEventListener('DOMContentLoaded', loadItems);

// Form submit handler
itemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const item = {
        name: nameInput.value,
        description: descriptionInput.value,
        quantity: parseInt(quantityInput.value),
        price: parseFloat(priceInput.value),
        minimumQuantity: parseInt(minimumQuantityInput.value),
        reorderQuantity: parseInt(reorderQuantityInput.value)
    };

    try {
        if (itemId.value) {
            await updateItem(itemId.value, item);
        } else {
            await createItem(item);
        }
        
        resetForm();
        await loadItems();
    } catch (error) {
        console.error('Error saving item:', error);
        alert('Error saving item: ' + error.message);
    }
});

// Load all items
async function loadItems() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const items = await response.json();
        displayItems(items);
    } catch (error) {
        console.error('Error loading items:', error);
        alert('Error loading items: ' + error.message);
    }
}

// Create new item
async function createItem(item) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        });

        if (!response.ok) throw new Error('Failed to create item');
        return await response.json();
    } catch (error) {
        console.error('Error creating item:', error);
        throw error;
    }
}

// Update existing item
async function updateItem(id, item) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        });

        if (!response.ok) throw new Error('Failed to update item');
        return await response.json();
    } catch (error) {
        console.error('Error updating item:', error);
        throw error;
    }
}

// Delete item
async function deleteItem(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete item');
        await loadItems();
    } catch (error) {
        console.error('Error deleting item:', error);
        alert('Error deleting item: ' + error.message);
    }
}

// Display items in table
function displayItems(items) {
    const tbody = document.getElementById('itemsList');
    tbody.innerHTML = '';

    items.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.name}</td>
            <td>${item.description}</td>
            <td>${item.quantity}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.minimumQuantity}</td>
            <td>${item.reorderQuantity}</td>
            <td>
                <button onclick='openPopup(${JSON.stringify(item)})' class='action-btn edit-btn'>Edit</button>
                <button onclick='deleteItem(${item.id})' class='action-btn delete-btn'>Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Open the popup and fill form with item data
function openPopup(item) {
    document.getElementById("editPopup").style.display = "block";

    // Fill form fields with existing item data
    document.getElementById("name").value = item.name;
    document.getElementById("description").value = item.description;
    document.getElementById("quantity").value = item.quantity;
    document.getElementById("price").value = item.price;
    document.getElementById("minQuantity").value = item.minQuantity;
    document.getElementById("reorderQuantity").value = item.reorderQuantity;
}

// Close the popup
function closePopup() {
    document.getElementById("editPopup").style.display = "none";
}

// Add event listener to close popup when clicking outside it
window.onclick = function(event) {
    let popup = document.getElementById("editPopup");
    if (event.target === popup) {
        closePopup();
    }
};

// Handle edit form submission
editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const updatedItem = {
        name: editName.value,
        description: editDescription.value,
        quantity: parseInt(editQuantity.value),
        price: parseFloat(editPrice.value),
        minimumQuantity: parseInt(editMinimumQuantity.value),
        reorderQuantity: parseInt(editReorderQuantity.value)
    };

    await updateItem(editItemId.value, updatedItem);
    closePopup();
    await loadItems();
});

// Reset form
function resetForm() {
    itemId.value = '';
    itemForm.reset();
}
