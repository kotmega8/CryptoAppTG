function initLeaderboard() {
    let tg = window.Telegram?.WebApp || { initDataUnsafe: { user: { id: 'test-user' } } };
    let currentUserId = tg?.initDataUnsafe?.user?.id || 'test-user';

    fetch('/getData')
        .then(response => response.json())
        .then(async data => {
            const leaderboardList = document.getElementById('leaderboardList');
            leaderboardList.innerHTML = '';

            // Convert data to proper user array
            const users = Object.entries(data).map(([userId, userData]) => ({
                userId: userId,
                balance: userData.balance || 0
            }));

            // Sort by balance and get top 10
            const topUsers = users
                .sort((a, b) => b.balance - a.balance)
                .slice(0, 10);

            // Process each user
            for (let user of topUsers) {
                if (user.userId === 'test-user') {
                    user.name = 'Test User';
                } else {
                    try {
                        // Fetch Telegram user info
                        const response = await fetch(`/getTelegramUserInfo?userId=${user.userId}`);
                        const telegramInfo = await response.json();
                        user.name = `${telegramInfo.first_name} ${telegramInfo.last_name || ''}`.trim();
                    } catch (error) {
                        user.name = `User ${user.userId}`;
                    }
                }

                const item = document.createElement('div');
                item.className = 'leaderboard-item';
                
                if (user.userId === currentUserId) {
                    item.classList.add('current-user');
                }

                item.innerHTML = `
                    <div class="leader-info">
                        <span class="leader-position">${topUsers.indexOf(user) + 1}</span>
                        <span class="leader-name">${user.name}</span>
                    </div>
                    <span class="leader-balance">💰 ${user.balance.toLocaleString()}</span>
                `;
                leaderboardList.appendChild(item);
            }
        });
}

document.addEventListener('DOMContentLoaded', initLeaderboard);
