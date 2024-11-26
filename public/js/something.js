function initSomething() {
    const payStarsBtn = document.getElementById('payStarsBtn');

    payStarsBtn.addEventListener('click', async () => {
        try {
            // Запрос к вашему серверу для получения ссылки на оплату
            const response = await fetch('/generate-invoice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: 5, // Сумма оплаты
                    title: "Поддержка Energy Clicker",
                    description: "Отправить 5 Stars разработчику"
                }),
            });

            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.statusText}`);
            }

            const { invoiceLink } = await response.json();

            // Используем Telegram Web App SDK для открытия инвойса
            Telegram.WebApp.openInvoice(invoiceLink, (status) => {
                if (status === "paid") {
                    console.log("Оплата успешно проведена");
                } else {
                    console.error("Оплата не завершена или отменена");
                }
            });
        } catch (error) {
            console.error('Ошибка при вызове оплаты:', error);
        }
    });
}
