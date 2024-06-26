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
    const userId = localStorage.getItem('userId');

    const namePattern = /^[A-Za-z0-9\s]{1,100}$/;
    const pricePattern = /^\d+(\.\d{1,2})?$/;
    const descriptionPattern = /^.{1,500}$/;
    const urlPattern = /^https?:\/\/.+/;

    if (!namePattern.test(itemName)) {
        alert('Item Name should be 1-100 characters long and can contain letters, numbers, and spaces.');
        return;
    }

    if (!pricePattern.test(itemPrice)) {
        alert('Price should be a positive number with up to 2 decimal places.');
        return;
    }

    if (!pricePattern.test(itemBidPrice)) {
        alert('Minimum Price should be a positive number with up to 2 decimal places.');
        return;
    }

    if (!descriptionPattern.test(itemDescription)) {
        alert('Description should be 1-500 characters long.');
        return;
    }

    if (!urlPattern.test(itemImageLink)) {
        alert('Image Link should be a valid URL.');
        return;
    }


    try {
        const userNameResponse = await fetch(`/getUserName?userId=${userId}`);
        if (userNameResponse.status === 200) {
            const sellerUserName = await userNameResponse.text();
            const createInfo = {
                roomId: roomSelect,
                name: itemName,
                price: itemPrice,
                bid_price: itemBidPrice,
                description: itemDescription,
                imageLink: itemImageLink,
                sellerUserName: sellerUserName,
                highestBidder: null // Assuming it's null when the item is created
            };
            console.log(createInfo);
            const response = await fetch('/createItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(createInfo)
            });
            if (response.status === 201) {
                // Handle successful item creation
                alert("Create item success");
                window.location.href = `index.html?id=${userId}`;
            } else {
                const data = await response.json();
                console.log(data);
                console.log(response);
                // Handle other error cases
                alert(data.message || 'An unknown error occurred.');
            }
        } else {
            throw new Error('Failed to get user name');
        }
    } catch (error) {
        console.error('Error during create request:', error);
        alert('An error occurred. Please try again.');
    }
}