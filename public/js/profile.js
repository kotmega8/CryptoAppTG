let tg = window.Telegram.WebApp || { initDataUnsafe: { user: { id: 'null' } } };
let user = tg.initDataUnsafe.user;

const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const shopBtn = document.getElementById('shopBtn');
const farmBtn = document.getElementById('farmBtn');
const profileBtn = document.getElementById('profileBtn');

const pages = {
    farm: document.getElementById('farm-page'),
    shop: document.getElementById('shop-page'),
    profile: document.getElementById('profile-page')
};

function switchPage(pageId) {
    Object.values(pages).forEach(page => {
        page.classList.remove('active');
    });
    
    pages[pageId].classList.add('active');
    
    [farmBtn, shopBtn, profileBtn].forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${pageId}Btn`).classList.add('active');
}

// Set user data
userName.textContent = user.first_name;
if (user.photo_url) {
    userAvatar.src = user.photo_url;
} else {
    userAvatar.src = 'https://via.placeholder.com/120?text=No+Photo';
}

// Navigation handlers
farmBtn.addEventListener('click', () => switchPage('farm'));
shopBtn.addEventListener('click', () => switchPage('shop'));
profileBtn.addEventListener('click', () => switchPage('profile'));
