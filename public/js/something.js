function initSomething() {
    const payStarsBtn = document.getElementById('payStarsBtn');
    
    payStarsBtn.addEventListener('click', async () => {
        try {
            // Запрос к серверу для создания платежа
            const response = await fetch('/create-stars-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: tg.initDataUnsafe.user.id,
                    amount: 5
                })
            });
            
            const data = await response.json();
            
            // Открываем платеж через Telegram Web App
            if (data.payment_link) {
                window.Telegram.WebApp.openInvoice(data.payment_link, {
                    callback: (status) => {
                        if (status === 'paid') {
                            console.log('Stars payment successful!');
                            // Здесь можно добавить логику после успешной оплаты
                        }
                    }
                });
            }
        } catch (error) {
            console.log('Error creating payment:', error);
        }
    });
}
