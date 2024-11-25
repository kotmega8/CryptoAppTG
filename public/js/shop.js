let tg = window.Telegram?.WebApp || { initDataUnsafe: { user: { id: 'test-user' } } };
let userId = tg?.initDataUnsafe?.user?.id || 'test-user';

const buyEnergyUpgrade = document.getElementById('buyEnergyUpgrade');
const energyUpgradePrice = document.getElementById('energyUpgradePrice');
const shopBtn = document.getElementById('shopBtn');
const farmBtn = document.getElementById('farmBtn');
const profileBtn = document.getElementById('profileBtn');

function calculateUpgradePrice(purchases) {
    return Math.floor(100 * Math.pow(2.25, purchases));
}

// Load and display initial data
async function loadUserData() {
    const response = await fetch(`/getData?userId=${userId}`);
    const data = await response.json();
    updateShopUI(data.energyUpgrades || 0);
}

function updateShopUI(purchases) {
    const price = calculateUpgradePrice(purchases);
    
    if (purchases >= 10) {
        buyEnergyUpgrade.textContent = 'Продано';
        buyEnergyUpgrade.classList.add('sold');
        buyEnergyUpgrade.disabled = true;
    } else {
        energyUpgradePrice.textContent = price;
    }
}

buyEnergyUpgrade.addEventListener('click', async () => {
    const response = await fetch(`/getData?userId=${userId}`);
    const userData = await response.json();
    
    const currentUpgrades = userData.energyUpgrades || 0;
    const price = calculateUpgradePrice(currentUpgrades);
    
    if (userData.balance >= price && currentUpgrades < 10) {
        userData.balance -= price;
        userData.maxEnergy = (userData.maxEnergy || 100) + 100;
        userData.energyUpgrades = currentUpgrades + 1;
        
        await fetch('/saveData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId,
                energy: userData.energy,
                balance: userData.balance,
                maxEnergy: userData.maxEnergy,
                energyUpgrades: userData.energyUpgrades
            })
        });

        updateShopUI(userData.energyUpgrades);
    }
});

// Navigation
shopBtn.addEventListener('click', () => window.location.href = '/shop.html');
farmBtn.addEventListener('click', () => window.location.href = '/');
profileBtn.addEventListener('click', () => window.location.href = '/profile.html');

// Initialize
loadUserData();
