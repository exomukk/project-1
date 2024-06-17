'use strict';

async function createRoom() {
    const userId = localStorage.getItem('userId');
    const roomName = document.getElementById('roomName').value;

    try {
        const response = await fetch('/auction-rooms/create?ownerId=' + userId, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify ({
                ownerId: userId,
                name: roomName
            })
        })

        if (response.status === 200) {
            const data = await response.json();
            const roomId = data.message;
            console.log(roomId);
            window.location.href = `room.html?id=${roomId}`;
            alert(`Room created:, ${roomId}`);
        } else {
            const data = await response.json();
            console.log(data);
            alert(data.message || 'Unknown error ?')
        }
    } catch (error) {
        console.error('Error during create room request:', error);
        alert('An error occurred. Please try again.');
    }
}