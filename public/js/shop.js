let tg = window.Telegram.WebApp;
let userId = tg.initDataUnsafe.user.id;
let upgradePrice = 100;
let upgradePurchases = 0;

const buyEnergyUpgrade = document.getElementById('buyEnergyUpgrade');
const energyUpgradePrice = document.getElementById('energyUpgradePrice');
const shopBtn = document.getElementById('shopBtn');
const farmBtn = document.getElementById('farmBtn');
const profileBtn = document.getElementById('profileBtn');

// Load user data
fetch(`/getData?userId=${userId}`)
    .then(response => response.json())
    .then(data => {
        upgradePurchases = data.energyUpgrades || 0;
        upgradePrice = Math.floor(100 * Math.pow(2.25, upgradePurchases));
        energyUpgradePrice.textContent = upgradePrice;
        updateShopUI();
    });

function updateShopUI() {
    energyUpgradePrice.textContent = upgradePrice;
    
    if (upgradePurchases >= 10) {
        buyEnergyUpgrade.textContent = 'Продано';
        buyEnergyUpgrade.classList.add('sold');
        buyEnergyUpgrade.disabled = true;
    }
}

buyEnergyUpgrade.addEventListener('click', async () => {
    const response = await fetch(`/getData?userId=${userId}`);
    const userData = await response.json();
    
    if (userData.balance >= upgradePrice && upgradePurchases < 10) {
        userData.balance -= upgradePrice;
        userData.maxEnergy = (userData.maxEnergy || 100) + 100;
        userData.energyUpgrades = (userData.energyUpgrades || 0) + 1;
        
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

        upgradePurchases++;
        upgradePrice = Math.floor(100 * Math.pow(2.25, upgradePurchases));
        updateShopUI();
    }
});

// Navigation
shopBtn.addEventListener('click', () => {
    window.location.href = '/shop.html';
});

farmBtn.addEventListener('click', () => {
    window.location.href = '/';
});

profileBtn.addEventListener('click', () => {
    window.location.href = '/profile.html';
});
