let tg = window.Telegram.WebApp;
let user = tg.initDataUnsafe.user;

const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const shopBtn = document.getElementById('shopBtn');
const farmBtn = document.getElementById('farmBtn');
const profileBtn = document.getElementById('profileBtn');

// Set user data
userName.textContent = user.first_name;
if (user.photo_url) {
    userAvatar.src = user.photo_url;
} else {
    userAvatar.src = 'https://via.placeholder.com/120?text=No+Photo';
}

// Navigation handlers
shopBtn.addEventListener('click', () => {
    // Will be implemented later
});

farmBtn.addEventListener('click', () => {
    window.location.href = '/';
});

profileBtn.addEventListener('click', () => {
    window.location.href = '/profile.html';
});
