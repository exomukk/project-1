'use strict';

// Fetch items for the dropdown to choose items
async function fetchItems() {
    const userId = localStorage.getItem('userId');

    try {
        const response = await fetch(`/delItem/${userId}`);
        if (response.ok) {
            const items = await response.json();
            const itemSelect = document.getElementById('itemSelect');
            itemSelect.innerHTML = '<option value="">Select Item*</option>';
            items.forEach(item => {
                const optionHTML = `
                    <option value="${item.id}">${item.name}</option>
                `;
                itemSelect.insertAdjacentHTML('beforeend', optionHTML);
            });
        } else {
            console.error('Error fetching items:', response.status);
        }
    } catch (error) {
        console.error('Error during fetch request:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchItems);







// Function to delete an item
async function deleteItem() {
    const itemSelect = document.getElementById('itemSelect');
    const itemId = itemSelect.value;

    if (!itemId) {
        alert('Please select an item to delete');
        return;
    }

    try {
        const response = await fetch(`/delItem/${itemId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Item deleted successfully');
            // Remove the deleted item from the dropdown
            const optionToRemove = itemSelect.querySelector(`option[value="${itemId}"]`);
            optionToRemove.remove();
        } else {
            const data = await response.json();
            alert(data.message || 'Failed to delete item');
            console.error('Error deleting item:', response.status);
        }
    } catch (error) {
        console.error('Error during delete request:', error);
    }
}