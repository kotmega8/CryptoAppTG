let isLeaderboardLoading = false;

async function initLeaderboard() {
    // If already loading, don't start another request
    if (isLeaderboardLoading) {
        return;
    }

    let tg = window.Telegram?.WebApp || { initDataUnsafe: { user: { id: 'test-user' } } };
    let currentUserId = tg?.initDataUnsafe?.user?.id || 'test-user';

    async function updateLeaderboardDisplay() {
        isLeaderboardLoading = true;
        const leaderboardList = document.getElementById('leaderboardList');
        leaderboardList.innerHTML = 'Loading...'; // Show loading state

        try {
            const response = await fetch('/getLeaderboard');
            const users = await response.json();

            // Ensure server-side sorting
            const topUsers = users.sort((a, b) => Number(b.balance) - Number(a.balance));
            
            leaderboardList.innerHTML = '';

            for (let i = 0; i < topUsers.length; i++) {
                const user = topUsers[i];
                let userName = 'Unknown User';

                if (user.userId === 'test-user') {
                    userName = 'Test User';
                } else {
                    const response = await fetch(`/getTelegramUser?userId=${user.userId}`);
                    const userData = await response.json();
                    userName = userData.first_name;
                    if (userData.last_name) {
                        userName += ` ${userData.last_name}`;
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
                    <span class="leader-balance">💰 ${Number(user.balance).toLocaleString()}</span>
                `;
                leaderboardList.appendChild(item);
            }
        } catch (error) {
            leaderboardList.innerHTML = 'Failed to load leaderboard';
        } finally {
            isLeaderboardLoading = false;
        }
    }

    updateLeaderboardDisplay();
    setInterval(updateLeaderboardDisplay, 5 * 60 * 1000);
}

document.addEventListener('DOMContentLoaded', initLeaderboard);
