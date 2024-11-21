const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const DATABASE_PATH = './database.json';

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Загружаем базу данных
const loadDatabase = () => {
    if (!fs.existsSync(DATABASE_PATH)) {
        fs.writeFileSync(DATABASE_PATH, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(DATABASE_PATH));
};

// Сохраняем базу данных
const saveDatabase = (data) => {
    fs.writeFileSync(DATABASE_PATH, JSON.stringify(data, null, 2));
};

// API: Получение данных игрока
app.get('/api/data', (req, res) => {
    const db = loadDatabase();
    const userId = req.query.id;
    if (!userId) return res.status(400).json({ error: 'Missing user ID' });

    if (!db[userId]) {
        db[userId] = { energy: 100, balance: 0 };
        saveDatabase(db);
    }

    res.json(db[userId]);
});

// API: Сохранение данных игрока
app.post('/api/data', (req, res) => {
    const db = loadDatabase();
    const { id, energy, balance } = req.body;

    if (!id) return res.status(400).json({ error: 'Missing user ID' });

    db[id] = { energy, balance };
    saveDatabase(db);

    res.json({ success: true });
});

// Запуск сервера
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
