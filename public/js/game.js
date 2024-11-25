let tg = window.Telegram.WebApp;
let userId = tg.initDataUnsafe.user.id;
let energy = 100;
let balance = 0;
let circleSize = 1;

const circle = document.getElementById('clickCircle');
const energyFill = document.getElementById('energyFill');
const energyValue = document.getElementById('energyValue');
const balanceValue = document.getElementById('balanceValue');
const shopBtn = document.getElementById('shopBtn');
const farmBtn = document.getElementById('farmBtn');
const profileBtn = document.getElementById('profileBtn');

fetch(`/getData?userId=${userId}`)
    .then(response => response.json())
    .then(data => {
        energy = data.energy;
        balance = data.balance;
        updateUI();
    });

// Простой обработчик клика
circle.addEventListener('click', (e) => {
    e.preventDefault();
    if (energy <= 0) return;

    energy--;
    balance++;
    circleSize = Math.min(circleSize + 0.05, 1.5);
    circle.style.transform = `scale(${circleSize})`;

    updateUI();
    saveData();

    // Запускаем анимацию уменьшения
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
    energyFill.style.width = `${energy}%`;
    energyValue.textContent = energy;
    balanceValue.textContent = balance;
}

function saveData() {
    fetch('/saveData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, energy, balance })
    });
}

setInterval(() => {
    if (energy < 100) {
        energy++;
        updateUI();
        saveData();
    }
}, 2000);

farmBtn.addEventListener('click', () => {
    location.reload();
});

shopBtn.addEventListener('click', () => {
    // Will be implemented later
});

profileBtn.addEventListener('click', () => {
    // Will be implemented later
});
