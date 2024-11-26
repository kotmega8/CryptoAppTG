let tg = window.Telegram?.WebApp || { initDataUnsafe: { user: { id: 'test-user' } } };
let userId = tg?.initDataUnsafe?.user?.id || 'test-user';
let energy = 100;
let maxEnergy = 100;
let balance = 0;
let circleSize = 1;

const circle = document.getElementById('clickCircle');
const energyFill = document.getElementById('energyFill');
const energyValue = document.getElementById('energyValue');
const balanceValue = document.getElementById('balanceValue');
const shopBtn = document.getElementById('shopBtn');
const farmBtn = document.getElementById('farmBtn');
const profileBtn = document.getElementById('profileBtn');
const leaderboardBtn = document.getElementById('leaderbordBtn');

// Добавляем новый код для переключения страниц
const pages = {
    farm: document.getElementById('farm-page'),
    shop: document.getElementById('shop-page'),
    profile: document.getElementById('profile-page'),
    leaderboard: document.getElementById('leaderboard-page')
};

function switchPage(pageId) {
    console.log('Switching to page:', pageId);
    Object.values(pages).forEach(page => {
        page.classList.remove('active');
    });
    
    pages[pageId].classList.add('active');
    
    [farmBtn, shopBtn, profileBtn].forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${pageId}Btn`).classList.add('active');

    if (pageId === 'shop') {
        window.initShop && window.initShop();
    } else if (pageId === 'profile') {
        window.initProfile && window.initProfile();
    } else if (pageId === 'leaderboard') {
        window.initLeaderboard && window.initLeaderboard();
    }
}


fetch(`/getData?userId=${userId}`)
    .then(response => response.json())
    .then(data => {
        energy = data.energy;
        balance = data.balance;
        maxEnergy = data.maxEnergy || 100;
        updateUI();
    });

circle.addEventListener('click', (e) => {
    e.preventDefault();
    if (energy <= 0) return;

    energy--;
    balance++;
    circleSize = Math.min(circleSize + 0.05, 1.5);
    circle.style.transform = `scale(${circleSize})`;

    updateUI();
    saveData();

    setTimeout(() => shrinkCircle(), 100);
});

function shrinkCircle() {
    if (circleSize > 1) {
        circleSize = Math.max(1, circleSize - 0.02);
        circle.style.transform = `scale(${circleSize})`;
        requestAnimationFrame(shrinkCircle);
    }
}

function updateUI() {
    const percentage = Math.min((energy / maxEnergy) * 100, 100);
    energyFill.style.width = `${percentage}%`;
    energyValue.textContent = `${energy}/${maxEnergy}`;
    balanceValue.textContent = balance;
}

function saveData() {
    fetch('/saveData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, energy, balance, maxEnergy })
    });
}

setInterval(() => {
    if (energy < maxEnergy) {
        energy++;
        updateUI();
        saveData();
    }
}, 2000);

// Заменяем старые обработчики на новые
farmBtn.addEventListener('click', () => switchPage('farm'));
shopBtn.addEventListener('click', () => switchPage('shop'));
profileBtn.addEventListener('click', () => switchPage('profile'));
leaderboardBtn.addEventListener('click', () => switchPage('leaderboard'));