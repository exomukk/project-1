'use strict';

async function submitForm() {
    const username = document.getElementsByClassName("username")[0].value;
    const password = document.getElementsByClassName("password")[0].value;

    try {
        const response = await fetch('/login.app', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (response.status === 200) {
            const data = await response.json();

            alert(data.message);
            localStorage.setItem('userId', `${data.userId}`);
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