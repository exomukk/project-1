'use strict';

// Fetch room for the dropdown to choose rooms
async function fetchRooms() {
    console.log("trying to get room data");
    const userId = localStorage.getItem('userId');
    console.log(userId);

    try {
        const response = await fetch(`/user/${userId}/addItems`);
        if (response.ok) {
            const rooms = await response.json();
            const roomSelect = document.getElementById('roomSelect');
            roomSelect.innerHTML = '<option value="">Select Room*</option>'; // reset dropdown
            rooms.forEach(room => {
                const optionHTML = `
                    <option value="${room.id}">${room.name}</option>
                `;
                roomSelect.insertAdjacentHTML('beforeend', optionHTML);
            });
        } else {
            console.error('Error fetching rooms:', response.status);
        }
    } catch (error) {
        console.error('Error during fetch request:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchRooms);





// function xóa phòng
async function deleteRoom() {
    const roomSelect = document.getElementById('roomSelect');
    const roomId = roomSelect.value;

    if (!roomId) {
        alert('Please select a room to delete');
        return;
    }

    try {
        const response = await fetch(`/rooms/${roomId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Room and its items deleted successfully');
            // Remove the deleted room from the dropdown
            const optionToRemove = roomSelect.querySelector(`option[value="${roomId}"]`);
            optionToRemove.remove();
        } else {
            alert('Failed to delete room');
            console.error('Error deleting room:', response.status);
        }
    } catch (error) {
        console.error('Error during delete request:', error);
    }
}