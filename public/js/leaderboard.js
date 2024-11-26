function initLeaderboard() {
    let tg = window.Telegram?.WebApp || { initDataUnsafe: { user: { id: 'test-user' } } };
    let currentUserId = tg?.initDataUnsafe?.user?.id || 'test-user';

    async function updateLeaderboardDisplay() {
        const response = await fetch('/getLeaderboard');
        const topUsers = await response.json();

        const leaderboardList = document.getElementById('leaderboardList');
        leaderboardList.innerHTML = '';

        for (let i = 0; i < topUsers.length; i++) {
            const user = topUsers[i];
            let userName = 'Unknown User';

            if (user.userId === 'test-user') {
                userName = 'Test User';
            } else {
                try {
                    const response = await fetch(`/getTelegramUser?userId=${user.userId}`);
                    const userData = await response.json();
                    userName = userData.first_name;
                    if (userData.last_name) {
                        userName += ` ${userData.last_name}`;
                    }
                } catch (error) {
                    userName = `User ${user.userId}`;
                }
            }

            const item = document.createElement('div');
            item.className = 'leaderboard-item';
            
            if (i === 0) item.classList.add('gold');
            if (i === 1) item.classList.add('silver');
            if (i === 2) item.classList.add('bronze');
            
            if (user.userId === currentUserId) {
                item.classList.add('current-user');
            }

            item.innerHTML = `
                <div class="leader-info">
                    <span class="leader-position">${i + 1}</span>
                    <span class="leader-name">${userName}</span>
                </div>
                <span class="leader-balance">💰 ${user.balance.toLocaleString()}</span>
            `;
            leaderboardList.appendChild(item);
        }
    }

    // Initial update
    updateLeaderboardDisplay();

    // Update every 5 minutes
    setInterval(updateLeaderboardDisplay, 5 * 60 * 1000);
}

document.addEventListener('DOMContentLoaded', initLeaderboard);
