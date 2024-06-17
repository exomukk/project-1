'use strict';

// Fetch room for the dropdown to choose rooms
async function fetchRooms() {
    console.log("trying to get room data");
    const userId = localStorage.getItem('userId');
    console.log(userId);

    try {
        const response = await fetch(`/user/${userId}/addItems`);
        if (response.ok) {
            const rooms = await response.json();
            const roomSelect = document.getElementById('roomSelect');
            roomSelect.innerHTML = '<option value="">Select Room*</option>'; // reset dropdown
            rooms.forEach(room => {
                const optionHTML = `
                    <option value="${room.id}">${room.name}</option>
                `;
                roomSelect.insertAdjacentHTML('beforeend', optionHTML);
            });
        } else {
            console.error('Error fetching rooms:', response.status);
        }
    } catch (error) {
        console.error('Error during fetch request:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchRooms);






// create item functions
async function createItem() {
    const roomSelect = document.getElementById('roomSelect').value;
    const itemName = document.getElementById('itemName').value;
    const itemPrice = document.getElementById('itemPrice').value;
    const itemBidPrice = document.getElementById('itemBidPrice').value;
    const itemDescription = document.getElementById('itemDescription').value;
    const itemImageLink = document.getElementById('itemImageLink').value;

    const createInfo = {
        roomId: roomSelect,
        name: itemName,
        price: itemPrice,
        bid_price: itemBidPrice,
        description: itemDescription,
        imageLink: itemImageLink
    };

    console.log(createInfo)
    try {
        const response = await fetch('/createItem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(createInfo)
        });

        if (response.status === 200) {

        } else {
            const data = await response.json();
            console.log(data);
            console.log(response);
            // Xử lý các trường hợp lỗi khác
            alert(data.message || 'An unknown error occurred.');
        }
    } catch (error) {
        console.error('Error during create request:', error);
        alert('An error occurred. Please try again.');
    }
}
