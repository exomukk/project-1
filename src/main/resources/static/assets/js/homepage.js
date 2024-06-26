'use strict';
import {countdownFunctions, startOpenCountdown} from './countdownFunctions.js';

// modal variables
const modal = document.querySelector('[data-modal]');
const modalCloseBtn = document.querySelector('[data-modal-close]');
const modalCloseOverlay = document.querySelector('[data-modal-overlay]');

// modal function
const modalCloseFunc = function () { modal.classList.add('closed') }

// modal eventListener
modalCloseOverlay.addEventListener('click', modalCloseFunc);
modalCloseBtn.addEventListener('click', modalCloseFunc);






// mobile menu variables
const mobileMenuOpenBtn = document.querySelectorAll('[data-mobile-menu-open-btn]');
const mobileMenu = document.querySelectorAll('[data-mobile-menu]');
const mobileMenuCloseBtn = document.querySelectorAll('[data-mobile-menu-close-btn]');
const overlay = document.querySelector('[data-overlay]');

for (let i = 0; i < mobileMenuOpenBtn.length; i++) {

    // mobile menu function
    const mobileMenuCloseFunc = function () {
        mobileMenu[i].classList.remove('active');
        overlay.classList.remove('active');
    }

    mobileMenuOpenBtn[i].addEventListener('click', function () {
        mobileMenu[i].classList.add('active');
        overlay.classList.add('active');
    });

    mobileMenuCloseBtn[i].addEventListener('click', mobileMenuCloseFunc);
    overlay.addEventListener('click', mobileMenuCloseFunc);

}





// accordion variables
const accordionBtn = document.querySelectorAll('[data-accordion-btn]');
const accordion = document.querySelectorAll('[data-accordion]');

for (let i = 0; i < accordionBtn.length; i++) {

    accordionBtn[i].addEventListener('click', function () {

        const clickedBtn = this.nextElementSibling.classList.contains('active');

        for (let i = 0; i < accordion.length; i++) {

            if (clickedBtn) break;

            if (accordion[i].classList.contains('active')) {

                accordion[i].classList.remove('active');
                accordionBtn[i].classList.remove('active');

            }

        }

        this.nextElementSibling.classList.toggle('active');
        this.classList.toggle('active');

    });

}





// Dropdown function in navbar
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





// Fetching items and rooms
async function fetchItems() {
    console.log("trying to get data");

    try {
        const response = await fetch('/items');
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


async function fetchRooms() {
    console.log("getting rooms");

    try {
        const response = await fetch('/rooms');
        if (response.ok) {
            const rooms = await response.json();
            const productGrid = document.getElementById('room-grid');
            productGrid.innerHTML = ''; // Clear existing content
            rooms.forEach(room => {
                const productHTML = `
                    <div class="showcase">
                        <div class="showcase-banner">
                            <img src="https://cdn3d.iconscout.com/3d/premium/thumb/house-auction-7776734-6184505.png?f=webp" href="room.html?id=${room.id}" alt="" width="300" class="product-img default">
                            <div class="showcase-actions">
                                <button class="btn-action" href="room.html?id=${room.id}">
                                    <ion-icon name="bag-handle-outline"></ion-icon>
                                </button>
                            </div>
                        </div>
                        <div class="showcase-content">
                            <a href="room.html?id=${room.id}">
                                <h3 class="showcase-title">Seller ID: ${room.ownerId}</h3>
                            </a>
                            <div class="price-box">
                                <p class="price" href="room.html?id=${room.id}">${room.name}</p>
                            </div>
                        </div>
                    </div>
                `;
                productGrid.insertAdjacentHTML('beforeend', productHTML);
            });
        } else {
            console.error('Error fetching rooms:', response.status);
        }
    } catch (error) {
        console.error('Error during fetch request:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchItems);
document.addEventListener('DOMContentLoaded', fetchRooms);





// User can open item only when user ID in local storage is defined
// If userId in local storage = undefined means user haven't login yet -> Can't open item to bid
// function openItem(itemId) {
//     const userId = localStorage.getItem('userId');
//     if (userId) {
//         localStorage.setItem('itemId', itemId);
//         window.location.href = `bidding.html?id=${itemId}`;
//     } else {
//         alert('You must be logged in to bid on items.');
//     }
// }