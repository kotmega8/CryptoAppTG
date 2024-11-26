function initLeaderboard() {
    // First, fetch all users' data from your database
    fetch('/getLeaderboard')
        .then(response => response.json())
        .then(async users => {
            const leaderboardList = document.getElementById('leaderboardList');
            leaderboardList.innerHTML = '';

            // Sort users by balance and get top 10
            const topUsers = users
                .sort((a, b) => b.balance - a.balance)
                .slice(0, 10);

            // Get Telegram user info for each user
            for (let user of topUsers) {
                try {
                    const response = await fetch(`/getTelegramUserInfo?userId=${user.userId}`);
                    const telegramInfo = await response.json();
                    user.name = telegramInfo.first_name;
                    if (telegramInfo.last_name) {
                        user.name += ` ${telegramInfo.last_name}`;
                    }
                } catch (error) {
                    user.name = `Player ${user.userId}`;
                }
            }

            // Create and display leaderboard items
            topUsers.forEach((user, index) => {
                const item = document.createElement('div');
                item.className = 'leaderboard-item';
                
                // Add special styling for current user
                if (user.userId === window.tg.initDataUnsafe.user.id) {
                    item.classList.add('current-user');
                }

                item.innerHTML = `
                    <span class="leader-position">#${index + 1}</span>
                    <span class="leader-name">${user.name}</span>
                    <span class="leader-balance">💰 ${user.balance}</span>
                `;
                leaderboardList.appendChild(item);
            });
        });
}
