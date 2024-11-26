const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const userRank = document.getElementById('userRank');

// Initialize profile function
window.initProfile = function() {
    console.log('Profile init called');
    loadProfileData();
    loadUserRank();
};

async function loadUserRank() {
    const tg = window.Telegram?.WebApp;
    const userId = tg?.initDataUnsafe?.user?.id?.toString() || 'test-user';
    
    console.log('Current userId:', userId); // For debugging
    
    const response = await fetch('/getLeaderboard');
    const leaderboard = await response.json();
    
    console.log('Leaderboard:', leaderboard); // For debugging
    
    const userPosition = leaderboard.findIndex(entry => entry.userId.toString() === userId) + 1;
    
    console.log('Found position:', userPosition); // For debugging
    
    if (userPosition > 0) {
        userRank.textContent = `Место в рейтинге: ${userPosition}#`;
    } else {
        userRank.textContent = 'Место в рейтинге: -';
    }
}

function loadProfileData() {
    console.log('Loading profile data');
    // Get user data from Telegram WebApp
    const user = window.Telegram?.WebApp?.initDataUnsafe?.user || {
        first_name: 'Test User',
        photo_url: 'https://via.placeholder.com/120?text=No+Photo'
    };

    // Update UI with user data
    userName.textContent = user.first_name;
    userAvatar.src = user.photo_url || 'https://via.placeholder.com/120?text=No+Photo';
}

// Initial load
loadProfileData();
