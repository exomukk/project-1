'use strict';

// countdown function
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
            deleteItem(localStorage.getItem('itemId'));
        }
    }, 1000);
}

// Delete item function - under construction
async function deleteItem(itemId) {
    console.log('Deleting item with ID:', itemId);
    try {
        const deleteResponse = await fetch(`/items/${itemId}/del`, {
            method: 'DELETE'
        });
        if (deleteResponse.ok) {
            console.log('delete ok');
            alert('This item has EXPIRED');
            window.location.href = `homepage.html?id=${localStorage.getItem('userId')}`;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}





// Loading navbar functions
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

document.addEventListener('DOMContentLoaded', fetchBidItem);

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




// slide show for showing item image / under construction
var slideIndex = 1;
showSlides(slideIndex);

// Hàm điều khiển slide tiếp theo/trước
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Hàm hiển thị slide
function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  slides[slideIndex-1].style.display = "block";
}





// fetching data for current bid item
async function fetchBidItem() {
    const id = localStorage.getItem('itemId');
    const userId = localStorage.getItem('userId');
    alert("cooking");

    try {
        const response = await fetch(`/bid/${id}`);
        if (response.ok) {
            const items = await response.json();
            const productGrid = document.getElementById('showcase-big-thingy');
            productGrid.innerHTML = '';
            items.forEach(item => {
                const biddingHTML = `
                    <div class="showcase-container" data-item-id="${item.id}">
                        <div class="showcase">
                            <div class="showcase-banner">
                                <div class="mySlides fade">
                                    <img src="${item.imageLink}" class="showcase-img">
                                </div>
                                <div class="mySlides fade">
                                    <img src="${item.imageLink}" class="showcase-img">
                                </div>
                                <div class="mySlides fade">
                                    <img src="${item.imageLink}" class="showcase-img">
                                </div>
                                <!-- Thêm nút điều hướng -->
                                <div class="navigation-container">
                                    <a class="prev" onclick="plusSlides(-1)">❮</a>
                                    <a class="next" onclick="plusSlides(1)">❯</a>
                                </div>
                            </div>
                            

                            <div class="showcase-content">
                                <div class="showcase-rating">
                                    <ion-icon name="star"></ion-icon>
                                    <ion-icon name="star"></ion-icon>
                                    <ion-icon name="star"></ion-icon>
                                    <ion-icon name="star"></ion-icon>
                                    <ion-icon name="star-outline"></ion-icon>
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

                                <div class="button-container">
                                    <button class="add-cart-btn" onclick="bidMore(${item.bid_price})">Bid more</button>
                                    <button class="add-cart-btn" onclick="buyInstance(${id}, ${userId})">Buy instance</button>
                                </div>

                                <div class="showcase-status">
                                    <div class="wrapper">
                                        <p>
                                            minimum bid: <b>$${item.bid_price}</b>
                                        </p>
                                    </div>

                                    <!-- <div class="showcase-status-bar"></div> -->
                                </div>

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
                productGrid.insertAdjacentHTML('beforeend', biddingHTML);

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






// Bid more button
async function bidMore(bidPrice) {
    const userBid = prompt('Please enter your bid amount: ');
    if (userBid > bidPrice) {
        // alert('Bid placed successfully');
        // const id = localStorage.getItem('itemId');
        // window.location.href = `bidding.html?id=${id}`;
        try {
            const id = localStorage.getItem('itemId');
            const response = await fetch(`/bid/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ bidPrice: userBid })
            });
            if (response.ok) {
                alert('Bid placed successfully');
                window.location.href = `bidding.html?id=${id}`;
            } else {
                alert('Error: You must bid higher than minimum price');
                window.location.href = `bidding.html?id=${id}`;
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        alert('Error: You must bid higher than minimum price');
        window.location.href = `bidding.html?id=${id}`;
    }
}






// Function for 'Buy instance' button, the function for backend worked, but somehow the fetch function for alert is keep getting errors
async function buyInstance(itemId, userId) {
    try {
        const deleteResponse = await fetch(`/items/${itemId}/del`, {
            method: 'DELETE'
        });
        if (deleteResponse.ok) {
            console.log('delete ok, getting userid');
            try {
                const buyerResponse = await fetch(`/users/${userId}/del`);
                if (buyerResponse.ok) {
                    const userInfo = await buyerResponse.json();
                    console.log(userInfo);
                    userInfo.forEach(name => {
                        console.log(`${name.username}`);
                        alert('User "' + `${name.username}` + '" buy success, thank you for your purchase');
                        window.location.href = `homepage.html?id=${userId}`;
                    });
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

    } catch (error) {
        console.error('Error:', error);
    }
}
