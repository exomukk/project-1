async function submitForm() {
    const username = document.getElementsByClassName("username")[0].value;
    const password = document.getElementsByClassName("password")[0].value;
    const phone = document.getElementsByClassName("phone")[0].value;
    const address = document.getElementsByClassName("address")[0].value;
    // const avatar = document.getElementsByClassName("avatar")[0].value;

    try {
        const response = await fetch('/register.app', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username, password: password, phone: phone, address: address})
        });

        if (response.status === 200) {
            const data = await response.json();
            alert(data.message);
            // Register thành công, redirect sang homepage.html
            console.log(data.message); // In ra thông báo từ server
            window.location.href = 'homepage.html';
        } else if (response.status === 401) {
            const data = await response.json();
            // Register thất bại, hiển thị thông báo lỗi
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