const apiBaseUrl = 'http://localhost:3001';

async function makeTransfer(recipient_email, amount, message) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('No hay sesión activa. Por favor, inicie sesión.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/transactions/transfers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ recipient_email, amount, message })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Network response was not ok: ${response.statusText}, ${errorText}`);
        }

        const result = await response.json();
        console.log('Transferencia realizada:', result);
        alert('Transferencia realizada exitosamente');
    } catch (error) {
        console.error('Error al realizar transferencia:', error);
        alert(`Error en el servidor: ${error.message}`);
    }
}

// Manejar el evento de envío del formulario de transferencia
document.getElementById('transferForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const recipientEmail = document.getElementById('recipientEmail').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const message = document.getElementById('message').value;

    makeTransfer(recipientEmail, amount, message).then(() => {
        document.getElementById('recipientEmail').value = '';
        document.getElementById('amount').value = '';
        document.getElementById('message').value = '';
    });
});
