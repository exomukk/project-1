'use strict';

const headerLogo = document.getElementsByClassName('header-logo');
const userId = localStorage.getItem('userId');

// notification toast variables
const notificationToast = document.querySelector('[data-toast]');
const toastCloseBtn = document.querySelector('[data-toast-close]');

// notification toast eventListener
toastCloseBtn.addEventListener('click', function () {
  notificationToast.classList.add('closed');
});





// Submit form functions
async function submitForm() {
  const userId = localStorage.getItem('userId');
  const username = document.getElementsByClassName("username")[0].value;
  const password = document.getElementsByClassName("password")[0].value;
  const address = document.getElementsByClassName("address")[0].value;
  const phone = document.getElementsByClassName("phone")[0].value;

  try {
    const response = await fetch('/editprofile.app', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: userId,
        username: username,
        password: password,
        address: address,
        phone: phone
      })
    });

    // Check if the response status code is 200 (OK)
    if (response.status === 200) {
      try {
        const data = await response.json();
        alert(data.message);
        console.log(data.message); // Log the message from the server
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
        alert('The server response is not in JSON format.');
      }
    } else {
      const textData = await response.text();
      console.log(textData);
      alert('An error occurred: ' + textData);
    }
  } catch (networkError) {
    console.error('Network error during edit request:', networkError);
    alert('A network error occurred. Please try again.');
  }
}





// Fetch username from database to frontend
async function fetchItems() {
  try {
    const response = await fetch(`/profile?userId=${userId}`);
    if (response.ok) {
      const user = await response.json();
      const usernameField = document.querySelector('.username');
      usernameField.placeholder = user.username; // update placeholder to username
    } else {
      console.error('Error fetching user:', response.status);
    }
  } catch (error) {
    console.error('Error during fetch request:', error);
  }
}

document.addEventListener('DOMContentLoaded', fetchItems);





// btn functions
function createRoom() {
  window.location.href = `add_room.html?id=${userId}`;
}

function createItem() {
  window.location.href = `add_item.html?id=${userId}`;
}

function deleteRoom() {
  // Under construction
}





// Insert url to return to homepage with user ID
const returnHomepage = function () {
  const userId = localStorage.getItem('userId');
  window.location.href = `homepage.html?id=${userId}`;
};

let i;
for (i = 0; i < headerLogo.length; i++) {
  headerLogo[i].addEventListener('click', returnHomepage, false);
}





// Dropdown function for login logout
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