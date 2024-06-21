'use strict';
import { countdownFunctions, startOpenCountdown } from "./countdownFunctions.js";

// Get Room ID from URL since there are no room ID in local storage
function getRoomIdFromUrl() {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get('id');
}

function getRoomID() {
    const roomId = getRoomIdFromUrl();
    if (roomId) {
        fetchItems(roomId);
    } else {
        console.error('Room ID is missing in the URL');
    }
}

document.addEventListener('DOMContentLoaded', getRoomID);





// Fetching items with specific room ID
async function fetchItems(roomId) {
    console.log("trying to get data");

    try {
        const response = await fetch(`/auction-rooms/${roomId}/items`);
        if (response.ok) {
            const items = await response.json();
            const productGrid = document.getElementById('product-grid');
            productGrid.innerHTML = ''; // Clear existing content
            items.forEach(item => {
                const productHTML = `
                    <div class="showcase" data-item-id="${item.id}" onclick="openItem(${item.id})">
                        <div class="showcase-banner">
                            <img src="${item.imageLink}" alt="" width="300" class="product-img default">
                            <img src="${item.imageLink}" alt="" width="300" class="product-img hover">
                            <div class="showcase-actions">
                                <button class="btn-action">
                                    <ion-icon name="bag-handle-outline"></ion-icon>
                                </button>
                            </div>
                        </div>
                        <div class="showcase-content">
                            <a href="#">
                                <h3 class="showcase-title">${item.name}</h3>
                            </a>
                            <div class="price-box">
                                <p class="price">$${item.price}</p>
                            </div>
                            <div class="price-box">
                                <p class="price">Open in: <p class="price open-countdown" data-open-time="${item.openTime}"></p></p>
                            </div>
                            <div class="price-box">
                                <p class="price">End in: <p class="price countdown" data-end-time="${item.endTime}"></p></p>
                            </div>
                        </div>
                    </div>
                `;
                productGrid.insertAdjacentHTML('beforeend', productHTML);

                // Calling the countdown function
                const countdownElements = productGrid.querySelectorAll('.countdown');
                countdownElements.forEach(el => {
                    const endTime = el.getAttribute('data-end-time');
                    countdownFunctions(endTime, el);
                });

                const countdownOpenElements = productGrid.querySelectorAll('.open-countdown');
                countdownOpenElements.forEach(el => {
                    const openTime = el.getAttribute('data-open-time');
                    startOpenCountdown(openTime, el);
                });
            });
        } else {
            console.error('Error fetching items:', response.status);
        }
    } catch (error) {
        console.error('Error during fetch request:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchItems);






// // Login logout function
// document.addEventListener('DOMContentLoaded', function () {
//     // get userID conditions
//     const userId = localStorage.getItem('userId');
//     if (userId) {
//         document.getElementById('login-link').style.display = 'none';
//         document.getElementById('register-link').style.display = 'none';
//         document.getElementById('logout-link').style.display = 'block';
//         document.getElementById('profile-link').style.display = 'block';
//         document.getElementById('room-link').style.display = 'block';
//     }
// });
//
// function toggleDropdown() {
//     const dropdown = document.getElementById('dropdown-content-header');
//     dropdown.style.visibility = dropdown.style.visibility === 'hidden' ? 'visible' : 'hidden';
// }
//
// function logout() {
//     localStorage.removeItem('userId');
//     window.location.href = `index.html`;
// }
//
// function editProfile() {
//     const userId = localStorage.getItem('userId');
//     window.location.href = `profile.html?id=${userId}`;
// }
//
//
//
//
//
// // Opening chosen item
// function openItem(itemId) {
//     const userId = localStorage.getItem('userId');
//     if (userId) {
//         localStorage.setItem('itemId', itemId);
//         window.location.href = `bidding.html?id=${itemId}`;
//     } else {
//         alert('You must be logged in to bid on items.');
//     }
// }

