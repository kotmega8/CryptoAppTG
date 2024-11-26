function initLeaderboard() {
    // Get Telegram instance or use test user
    let tg = window.Telegram?.WebApp || { initDataUnsafe: { user: { id: 'test-user' } } };
    let currentUserId = tg?.initDataUnsafe?.user?.id || 'test-user';

    fetch('/getData')
        .then(response => response.json())
        .then(data => {
            const leaderboardList = document.getElementById('leaderboardList');
            leaderboardList.innerHTML = '';

            const users = Object.entries(data)
                .map(([userId, userData]) => ({
                    userId,
                    name: userData.name || `Player ${userId}`,
                    balance: userData.balance || 0
                }))
                .sort((a, b) => b.balance - a.balance)
                .slice(0, 10);

            users.forEach((user, index) => {
                const item = document.createElement('div');
                item.className = 'leaderboard-item';
                
                if (user.userId === currentUserId) {
                    item.classList.add('current-user');
                }

                item.innerHTML = `
                    <div class="leader-info">
                        <span class="leader-position">${index + 1}</span>
                        <span class="leader-name">${user.name}</span>
                    </div>
                    <span class="leader-balance">💰 ${user.balance.toLocaleString()}</span>
                `;
                leaderboardList.appendChild(item);
            });
        });
}

document.addEventListener('DOMContentLoaded', initLeaderboard);
