function submitForm() {
    var username = document.getElementsByClassName("username")[0].value;
    var password = document.getElementsByClassName("password")[0].value;
    console.log(username + password);
    const loginInfo = {
        username: username,
        password: password
    };

    console.log(loginInfo);

    fetch('/register.app', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginInfo)
    })
        .then(response => {
            if (response.ok) {
                alert('Đăng nhập thành công! Dữ liệu nhận được: ' + data);
                return response.text();
            } else {
                throw new Error('Error: ' + response.statusText);
            }
        })
        .then(data => {
            alert('Đăng nhập thành công! Dữ liệu nhận được: ' + data);
            console.log(data);
        })
        .catch(error => console.error('Error:', error));
}