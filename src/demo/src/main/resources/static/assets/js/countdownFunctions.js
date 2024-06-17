// tbh, i created this from copilot lol, just some function for the homepage :D
'use strict';

export function countdownFunctions(endTime, element) {
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

export function startOpenCountdown(openTime, element) {
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
            // Gọi hàm để đưa item lên bảng lớn ở đây
            moveItem(countdownContainer.closest('.showcase').getAttribute('data-item-id'));
        }
    }, 1000);
}

export function startBigCountdown(endTime, countdownContainer) {
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
                    <div class="showcase-container" data-item-id="${item.id}" onclick="openItem(${item.id})">
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

// Delete item function - under construction
function deleteItem(itemId) {
    console.log('Deleting item with ID:', itemId);
    // Add logic here
}