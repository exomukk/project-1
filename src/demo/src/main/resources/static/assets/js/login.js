async function submitForm() {
    const username = document.getElementsByClassName("username")[0].value;
    const password = document.getElementsByClassName("password")[0].value;
    console.log(username + password);
    console.log(username + password);
    console.log(username + password);

    try {
        const response = await fetch('/login.app', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username, password: password })
        });

        if (response.status === 200) {
            const data = await response.json();
            const message = data.message;
            const userIdMatch = message.match(/User ID: (\d+)/); // Lấy ID người dùng

            alert(data.message);
            if (userIdMatch && userIdMatch[1]) {
                const userId = userIdMatch[1];
                localStorage.setItem('userId', userId); // Lưu trữ ID người dùng
                console.log(message); // In ra thông báo từ server
                // Login thành công, redirect sang homepage.html
                window.location.href = `homepage.html?id=${userId}`;
            } else {
                console.error("There's something wrong in login function");
            }
        } else if (response.status === 401) {
            const data = await response.json();
            // Login thất bại, hiển thị thông báo lỗi
            alert(data.message);
            console.log(data);
            console.log(response);
        } else {
            const data = await response.json();
            console.log(data);
            console.log(response);
            // Xử lý các trường hợp lỗi khác
            alert(data.message || 'An unknown error occurred.');
        }
    } catch (error) {
        console.error('Error during login request:', error);
        alert('An error occurred. Please try again.');
    }
}