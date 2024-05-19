$(document).ready(function () {
    $(".container").fadeIn(1000);
    $(".s2class").css({ "color": "#EE9BA3" });
    $(".s1class").css({ "color": "#748194" });
    $("#left").removeClass("left_hover");
    $("#right").addClass("right_hover");
    $(".signin").css({ "display": "none" });
    $(".signup").css({ "display": "" });
});
$("#right").click(function () {
    $("#left").removeClass("left_hover");
    $(".s2class").css({ "color": "#EE9BA3" });
    $(".s1class").css({ "color": "#748194" });
    $("#right").addClass("right_hover");
    $(".signin").css({ "display": "none" });
    $(".signup").css({ "display": "" });
});
$("#left").click(function () {
    $(".s1class").css({ "color": "#EE9BA3" });
    $(".s2class").css({ "color": "#748194" });
    $("#right").removeClass("right_hover");
    $("#left").addClass("left_hover");
    $(".signup").css({ "display": "none" });
    $(".signin").css({ "display": "" });
});

function submitForm() {
    var username = document.getElementsByClassName("username")[0].value;
    var password = document.getElementsByClassName("password")[0].value;
    console.log(username + password);
    const loginInfo = {
        username: username,
        password: password
    };

    console.log(loginInfo);

    fetch('/login.app', {
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