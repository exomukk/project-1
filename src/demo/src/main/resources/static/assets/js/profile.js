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
  console.log(username + password);
  const editProfileInfo = {
    username: username,
    password: password
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

    if (!response.ok) {
      throw new Error('Something went wrong');
    }

    const data = await response.json();

    console.log('Đăng nhập thành công! Dữ liệu nhận được: ', data);
    // Chuyển hướng đến trang homepage.html
    window.location.href = "homepage.html";
  } catch (error) {
    console.error('There has been a problem with your fetch operation: ', error);
  }
}