const express = require('express');
const fs = require('fs').promises;
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

const DB_PATH = './database.json';

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

    // Если пользователь уже есть в базе, обновляем только изменённые поля
    if (database[userId]) {
        database[userId] = {
            ...database[userId], // Существующие данные
            energy: energy ?? database[userId].energy, // Обновляем только если значение есть
            balance: balance ?? database[userId].balance,
            maxEnergy: maxEnergy ?? database[userId].maxEnergy,
            energyUpgrades: energyUpgrades ?? database[userId].energyUpgrades,
            lastUpdate: Date.now() // Обновляем метку времени
        };
    } else {
        // Если пользователя нет, создаём нового
        database[userId] = {
            energy: energy || 100,
            maxEnergy: maxEnergy || 100,
            balance: balance || 0,
            energyUpgrades: energyUpgrades || 0,
            lastUpdate: Date.now()
        };
    }

    await writeDatabase(database);
    res.json({ success: true });
});

setInterval(updateAllPlayersEnergy, 30000);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
