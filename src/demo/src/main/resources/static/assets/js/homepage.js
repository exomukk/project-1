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
        document.getElementById('room-link').style.display = 'block';
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
                    <div class="showcase" data-item-id="${item.id}">
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
                            <!--<p class="description">${item.description}</p>-->
                        </div>
                    </div>
                `;
                productGrid.insertAdjacentHTML('beforeend', productHTML);

                const countdownElements = productGrid.querySelectorAll('.countdown');
                countdownElements.forEach(el => {
                    const endTime = el.getAttribute('data-end-time');
                    startCountdown(endTime, el);
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

function startCountdown(endTime, element) {
    // Chuyển đổi endTime từ chuỗi sang đối tượng Date
    const end = new Date(endTime);

    // Cập nhật bộ đếm ngược mỗi giây
    const intervalId = setInterval(() => {
        const now = new Date();
        const distance = end - now;

        // Tính toán ngày, giờ, phút và giây
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + days * 24;
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Hiển thị bộ đếm ngược
        element.textContent = hours + "h " + minutes + "m " + seconds + "s ";

        // Khi bộ đếm ngược kết thúc
        if (distance < 0) {
            clearInterval(intervalId);
            element.textContent = "EXPIRED";
            // Gọi hàm để xóa item ở đây
            deleteItem(element.closest('.showcase').getAttribute('data-item-id'));
        }
    }, 1000);
}

function startBigCountdown(endTime, countdownContainer) {
    const end = new Date(endTime);

    const intervalId = setInterval(() => {
        const now = new Date();
        const distance = end - now;

        // Tính toán ngày, giờ, phút và giây
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Cập nhật HTML
        countdownContainer.querySelector('.countdown-content:nth-child(1) .display-number').textContent = days;
        countdownContainer.querySelector('.countdown-content:nth-child(2) .display-number').textContent = hours;
        countdownContainer.querySelector('.countdown-content:nth-child(3) .display-number').textContent = minutes;
        countdownContainer.querySelector('.countdown-content:nth-child(4) .display-number').textContent = seconds;

        if (distance < 0) {
            clearInterval(intervalId);
            countdownContainer.innerHTML = '<p class="expired">EXPIRED</p>';
            // Gọi hàm để xóa item ở đây
            deleteItem(countdownContainer.closest('.showcase').getAttribute('data-item-id'));
        }
    }, 1000);
}

function startOpenCountdown(openTime, element) {
    // Chuyển đổi endTime từ chuỗi sang đối tượng Date
    const open = new Date(openTime);

    // Cập nhật bộ đếm ngược mỗi giây
    const intervalId = setInterval(() => {
        const now = new Date();
        const distance = open - now;

        // Tính toán ngày, giờ, phút và giây
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + days * 24;
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Hiển thị bộ đếm ngược
        element.textContent = hours + "h " + minutes + "m " + seconds + "s ";

        // Khi bộ đếm ngược kết thúc
        if (distance < 0) {
            clearInterval(intervalId);
            element.textContent = "NOW";
            // Gọi hàm để xóa item ở đây
            moveItem(element.closest('.showcase').getAttribute('data-item-id'));
        }
    }, 1000);
}

// Hàm để xóa item, bạn cần thêm logic để gọi API hoặc xử lý xóa
function deleteItem(itemId) {
    console.log('Deleting item with ID:', itemId);
    // Thêm logic để gọi API xóa item ở đây
}

// Hàm di chuyển item lên phần đầu web
async function moveItem(itemId) {
    console.log('Moving item with ID:', itemId);

    try {
        const response = await fetch('/items');
        if (response.ok) {
            const items = await response.json();
            const productGrid = document.getElementById('showcase-big-thingy');
            productGrid.innerHTML = ''; // Clear existing content

            // Lọc item đang bán
            const filteredItem = items.filter(item => item.id === itemId);

            filteredItem.forEach(item => {
                const productHTML = `
                    <div class="showcase-container" data-item-id="${item.id}">
                        <div class="showcase">
                            <div class="showcase-banner">
                                <img src="${item.imageLink}"
                                    alt="" class="showcase-img">
                            </div>

                            <div class="showcase-content">

                                <div class="showcase-rating">
                                    <ion-icon name="star"></ion-icon>
                                    <ion-icon name="star"></ion-icon>
                                    <ion-icon name="star"></ion-icon>
                                    <ion-icon name="star"></ion-icon>
                                    <ion-icon name="star"></ion-icon>
                                </div>

                                <a href="#">
                                    <h3 class="showcase-title">${item.name}</h3>
                                </a>

                                <p class="showcase-desc">
                                    ${item.description}
                                </p>

                                <div class="price-box">
                                    <p class="price">$${item.price}</p>
                                </div>

                                <button class="add-cart-btn">go to auction</button>

                                <div class="countdown-box">

                                    <p class="countdown-desc">
                                        Hurry Up! Auction ends in:
                                    </p>

                                    <div class="countdown">

                                        <div class="countdown-content">

                                            <p class="display-number">0</p>

                                            <p class="display-text">Days</p>

                                        </div>

                                        <div class="countdown-content">
                                            <p class="display-number">0</p>
                                            <p class="display-text">Hours</p>
                                        </div>

                                        <div class="countdown-content">
                                            <p class="display-number">0</p>
                                            <p class="display-text">Min</p>
                                        </div>

                                        <div class="countdown-content">
                                            <p class="display-number">0</p>
                                            <p class="display-text">Sec</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                productGrid.insertAdjacentHTML('beforeend', productHTML);

                // Khởi động bộ đếm ngược
                const countdownContainer = productGrid.lastElementChild.querySelector('.countdown');
                startBigCountdown(item.endTime, countdownContainer);
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
                            <!--<p class="description"></p>-->
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
