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
                    <div class="showcase">
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
                                <p class="price">Open in: ${item.openTime}</p>
                            </div>
                            <!--<p class="description">${item.description}</p>-->
                        </div>
                    </div>
                `;
                productGrid.insertAdjacentHTML('beforeend', productHTML);
            });
        } else {
            console.error('Error fetching items:', response.status);
        }
    } catch (error) {
        console.error('Error during fetch request:', error);
    }
}

document.addEventListener('DOMContentLoaded', getRoomID);
document.addEventListener('DOMContentLoaded', fetchItems);
