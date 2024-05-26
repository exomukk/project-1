// notification toast variables
const notificationToast = document.querySelector('[data-toast]');
const toastCloseBtn = document.querySelector('[data-toast-close]');

// notification toast eventListener
toastCloseBtn.addEventListener('click', function () {
  notificationToast.classList.add('closed');
});

async function submitForm() {
  const username = document.getElementsByClassName("username")[0].value;
  const password = document.getElementsByClassName("password")[0].value;
  const address = document.getElementsByClassName("address")[0].value;
  const phone = document.getElementsByClassName("phone")[0].value;
  console.log(username + password);
  const editProfileInfo = {
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

    if (response === 200) {
      const data = await response.json();
      alert(data.message);
      // Edit thành công, redirect sang homepage.html
      console.log(data.message); // In ra thông báo từ server
    } else {
      const data = await response.json();
      console.log(data);
      console.log(response);
      // Xử lý các trường hợp lỗi khác
      alert(data.message || 'An unknown error occurred.');
    }

  } catch (error) {
    console.error('Error during edit request:', error);
    alert('An error occurred. Please try again.');
  }
}