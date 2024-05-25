async function submitForm() {
    const username = document.getElementsByClassName("username")[0].value;
    const password = document.getElementsByClassName("password")[0].value;
    console.log(username + password);
    const loginInfo = {
        username: username,
        password: password
    };

    console.log(loginInfo);

    try {
        const response = await fetch('/login.app', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginInfo)
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