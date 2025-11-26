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
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error desconocido en el servidor');
        }

        const result = await response.json();
        alert('Transferencia realizada exitosamente');
    } catch (error) {
        console.error('Error al realizar transferencia:', error);
        alert(error.message);
    }
}



// Manejar el evento de envío del formulario de transferencia
document.getElementById('transferForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const recipientEmail = document.getElementById('recipientEmail').value.trim();
    const amountValue = document.getElementById('amount').value.trim();
    const amount = parseFloat(amountValue);
    const message = document.getElementById('message').value;

    // VALIDACIONES FRONT
    if (!recipientEmail) {
        alert("Debe ingresar un correo del destinatario.");
        return;
    }

    if (!amountValue || isNaN(amount)) {
        alert("Debe ingresar un monto válido.");
        return;
    }

    if (amount <= 0) {
        alert("El monto debe ser mayor que cero.");
        return;
    }

    // Aviso si el monto es grande
    if (amount > 5000) {
        if (!confirm(`¿Seguro que deseas transferir $${amount}?`)) {
            return;
        }
    }

    makeTransfer(recipientEmail, amount, message).then(() => {
        document.getElementById('recipientEmail').value = '';
        document.getElementById('amount').value = '';
        document.getElementById('message').value = '';
    });
});

