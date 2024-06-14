const headerLogo = document.getElementsByClassName('header-logo');
const userId = localStorage.getItem('userId');

// notification toast variables
const notificationToast = document.querySelector('[data-toast]');
const toastCloseBtn = document.querySelector('[data-toast-close]');

// notification toast eventListener
toastCloseBtn.addEventListener('click', function () {
  notificationToast.classList.add('closed');
});

async function submitForm() {
  const userId = localStorage.getItem('userId');
  const username = document.getElementsByClassName("username")[0].value;
  const password = document.getElementsByClassName("password")[0].value;
  const address = document.getElementsByClassName("address")[0].value;
  const phone = document.getElementsByClassName("phone")[0].value;
  console.log(userId + password);
  const editProfileInfo = {
    id: userId,
    username: username,
    password: password,
    address: address,
    phone: phone
  };

  console.log(editProfileInfo);

  try {
    const response = await fetch('/editprofile.app', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editProfileInfo)
    });

    console.log('Server response: ', response);

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
      // Handle non-200 status codes
      const textData = await response.text();
      console.log(textData);
      alert('An error occurred: ' + textData);
    }
  } catch (networkError) {
    console.error('Network error during edit request:', networkError);
    alert('A network error occurred. Please try again.');
  }
}

function createRoom() {
  window.location.href = `add_room.html?id=${userId}`;
}

function createItem() {
  window.location.href = `add_item.html?id=${userId}`;
}

const returnHomepage = function () {
  const userId = localStorage.getItem('userId');
  window.location.href = `homepage.html?id=${userId}`;
};

let i;
for (i = 0; i < headerLogo.length; i++) {
  headerLogo[i].addEventListener('click', returnHomepage, false);
}

async function fetchItems() {
  console.error('abc');
  const userId = localStorage.getItem('userId'); // Lấy userId từ localStorage
  if (!userId) {
    console.error('UserId not found in localStorage');
    return;
  }

  try {
    const response = await fetch(`/profile?userId=${userId}`); // Gửi userId như một query parameter
    if (response.ok) {
      const user = await response.json();
      const usernameField = document.querySelector('.username');
      usernameField.placeholder = user.username; // Cập nhật placeholder nếu cần
    } else {
      console.error('Error fetching user:', response.status);
    }
  } catch (error) {
    console.error('Error during fetch request:', error);
  }
}


document.addEventListener('DOMContentLoaded', fetchItems);