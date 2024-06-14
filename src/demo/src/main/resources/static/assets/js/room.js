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
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + days*24;
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

function startOpenCountdown(openTime, element) {
    // Chuyển đổi openTime từ chuỗi sang đối tượng Date
    const open = new Date(openTime);

    // Cập nhật bộ đếm ngược mỗi giây
    const intervalId = setInterval(() => {
        const now = new Date();
        const distance = open - now;

        // Tính toán ngày, giờ, phút và giây
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + days*24;
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Hiển thị bộ đếm ngược
        element.textContent = hours + "h " + minutes + "m " + seconds + "s ";

        // Khi bộ đếm ngược kết thúc
        if (distance < 0) {
            clearInterval(intervalId);
            element.textContent = "NOW";
        }
    }, 1000);
}

// Hàm để xóa item, bạn cần thêm logic để gọi API hoặc xử lý xóa
function deleteItem(itemId) {
    console.log('Deleting item with ID:', itemId);
    // Thêm logic để gọi API xóa item ở đây
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

document.addEventListener('DOMContentLoaded', getRoomID);
document.addEventListener('DOMContentLoaded', fetchItems);
