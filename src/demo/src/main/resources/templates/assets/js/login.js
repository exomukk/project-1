async function submitForm() {
    const username = document.getElementsByClassName("username")[0].value;
    const password = document.getElementsByClassName("password")[0].value;
    console.log(username + password);

    const response = await fetch('/login.app', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
    });

    if (response.status === 200) {
        const data = await response.json();
        // Login thành công, redirect sang homepage.html
        console.log(data.message); // In ra thông báo từ server
        window.location.href = 'homepage.html';
    } else {
        const data = await response.json();
        // Login thất bại, hiển thị thông báo lỗi
        alert(data.message);
    }

    console.log(response.status);
    console.log(response);
}