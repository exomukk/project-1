document.addEventListener('DOMContentLoaded', function () {
    // get userID conditions
    const userId = localStorage.getItem('userId');
    if (userId) {
        document.getElementById('login-link').style.display = 'none';
        document.getElementById('register-link').style.display = 'none';
        document.getElementById('logout-link').style.display = 'block';
        document.getElementById('profile-link').style.display = 'block';
        document.getElementById('room-link').style.display = 'block';
    }
});

function toggleDropdown() {
    const dropdown = document.getElementById('dropdown-content-header');
    dropdown.style.visibility = dropdown.style.visibility === 'hidden' ? 'visible' : 'hidden';
}

function logout() {
    localStorage.removeItem('userId');
    window.location.href = `homepage.html`;
}

function editProfile() {
    const userId = localStorage.getItem('userId');
    window.location.href = `profile.html?id=${userId}`;
}

// slide show
var slideIndex = 1;
showSlides(slideIndex);

// Hàm điều khiển slide tiếp theo/trước
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Hàm hiển thị slide
function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  slides[slideIndex-1].style.display = "block";  
}
