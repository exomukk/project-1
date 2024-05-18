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

// function submitForm() {
//     var name = document.getElementById("name").value;
//     var email = document.getElementById("email").value;
//
//     // Send data to the backend
//     var xhr = new XMLHttpRequest();
//     xhr.open("POST", "http://localhost:8080/api/login", true);
//     xhr.setRequestHeader("Content-Type", "application/json");
//     xhr.onreadystatechange = function () {
//         if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
//             // Handle the response from the backend
//             console.log(xhr.responseText);
//         }
//     };
//     var data = JSON.stringify({ "name": name, "email": email });
//     xhr.send(data);
// }

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