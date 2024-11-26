const express = require('express');
const fs = require('fs').promises;
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

const DB_PATH = './database.json';
const BOT_TOKEN = '8133870094:AAHVk73959rVMuFQHQGTxqCavJuQ8dTC0dw';
let cachedLeaderboard = [];
const CACHE_DURATION = 5 * 60 * 1000;

async function readDatabase() {
    try {
        const data = await fs.readFile(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch {
        return {};
    }
}

async function writeDatabase(data) {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

// Функция для обновления энергии всех игроков
async function updateAllPlayersEnergy() {
    const database = await readDatabase();
    const currentTime = Date.now();
    let hasUpdates = false;

    for (const userId in database) {
        const player = database[userId];
        const lastUpdateTime = player.lastUpdate || currentTime;
        const timeDiff = currentTime - lastUpdateTime;
        const energyToAdd = Math.floor(timeDiff / 2000); // 2000мс = 2 секунды

        if (energyToAdd > 0 && player.energy < player.maxEnergy) {
            player.energy = Math.min(player.maxEnergy, player.energy + energyToAdd);
            player.lastUpdate = currentTime;
            hasUpdates = true;
        }
    }

    if (hasUpdates) {
        await writeDatabase(database);
    }
}

// Обработчик создания платежа Stars
app.post('/create-stars-payment', async (req, res) => {
    const { userId, amount } = req.body;
    
    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: "Поддержка Energy Clicker",
                description: "Отправка Stars разработчику",
                payload: `stars_payment_${userId}`,
                currency: "STARS",
                prices: [{
                    label: "Stars",
                    amount: amount * 100
                }]
            })
        });

        const data = await response.json();
        
        if (data.ok) {
            res.json({ payment_link: data.result });
        } else {
            throw new Error(data.description || 'Failed to create payment');
        }
    } catch (error) {
        console.error('Payment creation error:', error);
        res.status(500).json({ error: 'Failed to create payment' });
    }
});

app.get('/getTelegramUser', async (req, res) => {
    const userId = req.query.userId;
    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getChat?chat_id=${userId}`);
        const data = await response.json();
        res.json(data.result);
    } catch (error) {
        res.json({ first_name: `User ${userId}` });
    }
});

app.get('/getData', async (req, res) => {
    const userId = req.query.userId;
    const database = await readDatabase();

    // Обновляем энергию перед отправкой данных
    await updateAllPlayersEnergy();

    if (!database[userId]) {
        database[userId] = {
            energy: 100,
            maxEnergy: 100,
            balance: 0,
            energyUpgrades: 0,
            lastUpdate: Date.now()
        };
        await writeDatabase(database);
    }

    res.json(database[userId]);
});

app.post('/saveData', async (req, res) => {
    const { userId, energy, balance, maxEnergy, energyUpgrades } = req.body;
    const database = await readDatabase();

    if (database[userId]) {
        database[userId] = {
            ...database[userId],
            energy: energy ?? database[userId].energy,
            balance: balance ?? database[userId].balance,
            maxEnergy: maxEnergy ?? database[userId].maxEnergy,
            energyUpgrades: energyUpgrades ?? database[userId].energyUpgrades,
            lastUpdate: Date.now()
        };
    } else {
        database[userId] = {
            energy: energy || 100,
            maxEnergy: maxEnergy || 100,
            balance: balance || 0,
            energyUpgrades: energyUpgrades || 0,
            lastUpdate: Date.now()
        };
    }

    await writeDatabase(database);
    await updateLeaderboardCache(); // Update cache immediately after saving
    res.json({ success: true });
});


async function updateLeaderboardCache() {
    const database = await readDatabase();
    
    // Filter users with balance > 0 and format data
    cachedLeaderboard = Object.entries(database)
        .filter(([_, userData]) => userData.balance > 0)
        .map(([userId, userData]) => ({
            userId,
            balance: userData.balance
        }))
        .sort((a, b) => b.balance - a.balance);
}

app.get('/getLeaderboard', (req, res) => {
    res.json(cachedLeaderboard);
});

updateLeaderboardCache();

setInterval(updateLeaderboardCache, CACHE_DURATION);
setInterval(updateAllPlayersEnergy, 30000);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
