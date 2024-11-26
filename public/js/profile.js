const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');

// Initialize profile function
window.initProfile = function() {
    console.log('Profile init called');
    loadProfileData();
};

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
