'use strict';

// modal variables
const modal = document.querySelector('[data-modal]');
const modalCloseBtn = document.querySelector('[data-modal-close]');
const modalCloseOverlay = document.querySelector('[data-modal-overlay]');

// modal function
const modalCloseFunc = function () { modal.classList.add('closed') }

// modal eventListener
modalCloseOverlay.addEventListener('click', modalCloseFunc);
modalCloseBtn.addEventListener('click', modalCloseFunc);





// notification toast variables
const notificationToast = document.querySelector('[data-toast]');
const toastCloseBtn = document.querySelector('[data-toast-close]');

// notification toast eventListener
toastCloseBtn.addEventListener('click', function () {
    notificationToast.classList.add('closed');
});





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




document.addEventListener('DOMContentLoaded', function () {
    // get userID conditions
    const userId = localStorage.getItem('userId');
    if (userId) {
        document.getElementById('login-link').style.display = 'none';
        document.getElementById('register-link').style.display = 'none';
        document.getElementById('logout-link').style.display = 'block';
        document.getElementById('profile-link').style.display = 'block';
    }
});

function toggleDropdown() {
    const dropdown = document.getElementById('dropdown-content-header');
    dropdown.style.visibility = dropdown.style.visibility === 'hidden' ? 'visible' : 'hidden';
}

function logout() {
    localStorage.removeItem('userId');
    window.location.href = `homepage.html`;
}

function editProfile() {
    const userId = localStorage.getItem('userId');
    window.location.href = `profile.html?id=${userId}`;
}

// document.addEventListener('DOMContentLoaded', async function fetchItems() {

//     // Fetch data from the backend for showcase items
//     // fetch('items.app')
//     //     .then(response => response.json())
//     //     .then(data => {
//     //         console.log("test");
//     //         const productGrid = document.getElementById('product-grid');
//     //         productGrid.innerHTML = ''; // Clear existing content

//     //         data.forEach(item => {
// const productHTML = `
//     <div class="showcase">
//         <div class="showcase-banner">
//             <img src="https://product.hstatic.net/1000287389/product/ges-container_h36_h7a_9261073006622_razer-blackwidow-v3-1500x1000-0-v3_6a35d09a17404684922fc68ebfe8eb23_master.jpg" alt="" width="300" class="product-img default">
//             <img src="https://product.hstatic.net/1000287389/product/ges-container_h36_h7a_9261073006622_razer-blackwidow-v3-1500x1000-0-v3_6a35d09a17404684922fc68ebfe8eb23_master.jpg" alt="" width="300" class="product-img hover">
//             <div class="showcase-actions">
//                 <button class="btn-action">
//                     <ion-icon name="eye-outline"></ion-icon>
//                 </button>
//             </div>
//         </div>
//         <div class="showcase-content">
//             <a href="#">
//                 <h3 class="showcase-title">${item.name}</h3>
//             </a>
//             <div class="price-box">
//                 <p class="price">$${item.price}</p>
//             </div>
//             <div class="price-box">
//                 <p class="price">Open in: ${item.openTime}</p>
//             </div>
//             <p class="description">${item.description}</p>
//         </div>
//     </div>
// `;
// productGrid.insertAdjacentHTML('beforeend', productHTML);
//     //         });
//     //     })
//     //     .catch(error => {
//     //         console.error('Error fetching items:', error);
//     //     });

//     console.log("trying to get data");

//     try {
//         const response = await fetch('/items');
//         if (response.ok) {
//             const data = await response.json();
//             console.log("Data received:", data);
//             const productGrid = document.getElementById('product-grid');
//             productGrid.innerHTML = ''; // Clear existing content

//             data.forEach(item => {
//                 const productHTML = `
//                     <div class="showcase">
//                         <div class="showcase-banner">
//                             <img src="https://via.placeholder.com/300" alt="${item.name}" width="300" class="product-img default">
//                             <img src="https://via.placeholder.com/300" alt="${item.name}" width="300" class="product-img hover">
//                         </div>
//                         <h3>${item.name}</h3>
//                         <p>Price: $${item.price}</p>
//                         <p>Description: ${item.description}</p>
//                         <p>Open Time: ${item.openTime}</p>
//                     </div>
//                 `;
//                 productGrid.insertAdjacentHTML('beforeend', productHTML);
//             });
//         } else {
//             console.error('Failed to fetch items:', response.statusText);
//             alert('Failed to fetch items. Please try again.');
//         }
//     } catch (error) {
//         console.error('Error fetching items:', error);
//         alert('An error occurred while fetching items. Please try again.');
//     }
// });

async function fetchItems() {
    console.log("trying to get data");

    try {
        const response = await fetch('/items.app');
        if (response.ok) {
            const items = await response.json();
            const productGrid = document.getElementById('product-grid');
            productGrid.innerHTML = ''; // Clear existing content
            items.forEach(item => {
                const productHTML = `
                    <div class="showcase">
                        <div class="showcase-banner">
                            <img src="https://product.hstatic.net/1000287389/product/ges-container_h36_h7a_9261073006622_razer-blackwidow-v3-1500x1000-0-v3_6a35d09a17404684922fc68ebfe8eb23_master.jpg" alt="" width="300" class="product-img default">
                            <img src="https://product.hstatic.net/1000287389/product/ges-container_h36_h7a_9261073006622_razer-blackwidow-v3-1500x1000-0-v3_6a35d09a17404684922fc68ebfe8eb23_master.jpg" alt="" width="300" class="product-img hover">
                            <div class="showcase-actions">
                                <button class="btn-action">
                                    <ion-icon name="eye-outline"></ion-icon>
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
                                <p class="price">Open in: ${item.openTime}</p>
                            </div>
                            <p class="description">${item.description}</p>
                        </div>
                    </div>
                `;
                productGrid.insertAdjacentHTML('beforeend', productHTML);
                productGrid.insertAdjacentHTML('beforeend', productHTML);
            });
        } else {
            console.error('Error fetching items:', response.status);
        }
    } catch (error) {
        console.error('Error during fetch request:', error);
    }
}