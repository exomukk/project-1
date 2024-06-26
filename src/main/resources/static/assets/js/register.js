// 'use strict';
//
// async function submitForm() {
//     const username = document.getElementsByClassName("username")[0].value;
//     const password = document.getElementsByClassName("password")[0].value;
//     const phone = document.getElementsByClassName("phone")[0].value;
//     const address = document.getElementsByClassName("address")[0].value;
//
//     try {
//         const response = await fetch('/register', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 username: username,
//                 password: password,
//                 phone: phone,
//                 address: address
//             }),
//             credentials: 'include' // Ensure cookies are included in the request
//         });
//
//         if (response.status === 200) {
//             const data = await response.json();
//
//             alert(data.message);
//             window.location.href = `index.html`;
//         } else {
//             const data = await response.json();
//             alert(data.message || 'An unknown error occurred.');
//         }
//     } catch (error) {
//         console.error('Error during login request:', error);
//         alert('An error occurred. Please try again.');
//     }
// }

'use strict';

async function submitForm() {
    const username = document.getElementsByClassName("username")[0].value;
    const password = document.getElementsByClassName("password")[0].value;
    const phone = document.getElementsByClassName("phone")[0].value;
    const address = document.getElementsByClassName("address")[0].value;

    try {
        const response = await fetch('/register.app', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
                phone: phone,
                address: address
            })
        });

        if (response.status === 200) {
            const data = await response.json();

            alert(data.message);
            localStorage.setItem('userId', `${data.userId}`); // Add user ID to local storage for future usage
            window.location.href = `index.html?id=${data.userId}`;
        } else {
            const data = await response.json();
            alert(data.message || 'An unknown error occurred.');
        }
    } catch (error) {
        console.error('Error during login request:', error);
        alert('An error occurred. Please try again.');
    }
}