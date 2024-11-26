function initSomething() {
    const payStarsBtn = document.getElementById('payStarsBtn');
    
    payStarsBtn.addEventListener('click', () => {
        window.Telegram.WebApp.requestStars({
            amount: 5,
            title: "Поддержка Energy Clicker",
            description: "Отправить 5 Stars разработчику",
            onSuccess: () => {
                // Здесь можно добавить логику после успешной оплаты
                console.log('Payment successful');
            },
            onError: (error) => {
                console.log('Payment error:', error);
            }
        });
    });
}