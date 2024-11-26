console.log('Shop.js initialized with userId:', userId);

const buyEnergyUpgrade = document.getElementById('buyEnergyUpgrade');
const energyUpgradePrice = document.getElementById('energyUpgradePrice');

console.log('Shop elements found:', {
    buyButton: !!buyEnergyUpgrade,
    priceSpan: !!energyUpgradePrice
});

window.initShop = async function() {
    console.log('Shop init function called');
    await loadUserData();
};

function calculateUpgradePrice(purchases) {
    const price = Math.floor(100 * Math.pow(2.25, purchases));
    console.log('Calculated price for', purchases, 'purchases:', price);
    return price;
}

async function loadUserData() {
    console.log('Loading user data...');
    try {
        const response = await fetch(`/getData?userId=${userId}`);
        const data = await response.json();
        console.log('Received user data:', data);
        updateShopUI(data.energyUpgrades || 0);
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

function updateShopUI(purchases) {
    console.log('Updating shop UI with purchases:', purchases);
    const price = calculateUpgradePrice(purchases);
    
    if (purchases >= 10) {
        console.log('Max purchases reached, disabling button');
        buyEnergyUpgrade.textContent = 'Продано';
        buyEnergyUpgrade.classList.add('sold');
        buyEnergyUpgrade.disabled = true;
    } else {
        console.log('Setting price in UI:', price);
        energyUpgradePrice.textContent = price;
    }
}

buyEnergyUpgrade.addEventListener('click', async () => {
    console.log('Buy button clicked');
    try {
        const response = await fetch(`/getData?userId=${userId}`);
        const userData = await response.json();
        console.log('Current user data:', userData);
        
        const currentUpgrades = userData.energyUpgrades || 0;
        const price = calculateUpgradePrice(currentUpgrades);
        
        console.log('Purchase attempt:', {
            balance: userData.balance,
            price: price,
            currentUpgrades: currentUpgrades
        });
        
        if (userData.balance >= price && currentUpgrades < 10) {
            console.log('Purchase successful');
            userData.balance -= price;
            userData.maxEnergy = (userData.maxEnergy || 100) + 100;
            userData.energyUpgrades = currentUpgrades + 1;
            
            const saveResponse = await fetch('/saveData', {
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
            console.log('Save response:', await saveResponse.json());
            
            // Update shop UI
            updateShopUI(userData.energyUpgrades);
            
            // Update main game UI
            energy = userData.energy;
            maxEnergy = userData.maxEnergy;
            balance = userData.balance;
            updateUI();
        } else {
            console.log('Purchase failed:', {
                insufficientFunds: userData.balance < price,
                maxUpgradesReached: currentUpgrades >= 10
            });
        }
    } catch (error) {
        console.error('Error during purchase:', error);
    }
});


// Initial load
console.log('Running initial shop load');
loadUserData();