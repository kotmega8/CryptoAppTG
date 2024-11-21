const userId = new URLSearchParams(window.location.search).get('id'); // Получаем ID пользователя из URL
const circle = document.getElementById('clickCircle');
const energyBar = document.getElementById('energyBar');
const energyValue = document.getElementById('energyValue');
const balanceText = document.getElementById('balance');
let energy = 100;
let balance = 0;

// Загружаем данные с сервера
const loadGameData = async () => {
    const response = await fetch(`/api/data?id=${userId}`);
    const data = await response.json();
    energy = data.energy;
    balance = data.balance;
    updateUI();
};

// Сохраняем данные на сервер
const saveGameData = async () => {
    await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, energy, balance }),
    });
};

// Обновляем UI
const updateUI = () => {
    energyValue.textContent = energy;
    energyBar.style.width = `${(energy / 100) * 100}%`;
    balanceText.textContent = balance;
};

// Восстановление энергии
setInterval(() => {
    if (energy < 100) {
        energy++;
        updateUI();
        saveGameData();
    }
}, 2000);

// Обработка кликов
circle.addEventListener('click', () => {
    if (energy > 0) {
        energy--;
        balance++;
        updateUI();
        saveGameData();
    }
});

// Загрузка данных при старте
loadGameData();
