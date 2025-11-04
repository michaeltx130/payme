// URL base de tu API
const apiBaseUrl = 'http://localhost:3001'; // Asegúrate de que esta URL sea correcta

// Función para realizar un pago
async function makePayment(amount, institution, payment_concept) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('No hay sesión activa. Por favor, inicie sesión.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/transactions/payments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ amount, institution, payment_concept })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Network response was not ok: ${response.statusText}, ${errorText}`);
        }

        const result = await response.json();
        console.log('Pago realizado:', result);
        alert('Pago realizado exitosamente');
    } catch (error) {
        console.error('Error al realizar pago:', error);
        alert(`Error en el servidor: ${error.message}`);
    }
}

// Manejar el evento de envío del formulario de pagos
document.getElementById('paymentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const amount = parseFloat(document.getElementById('paymentAmount').value);
    const institution = document.getElementById('payService').value;
    const paymentConcept = document.getElementById('description').value;

    makePayment(amount, institution, paymentConcept).then(() => {
        document.getElementById('paymentAmount').value = ''; // Limpiar campo
        document.getElementById('description').value = ''; // Limpiar campo
        document.getElementById('payService').selectedIndex = 0; // Restablecer el selector
    });
});

// Manejar el evento de cancelar
document.getElementById('cancelButton').addEventListener('click', () => {
    document.getElementById('paymentAmount').value = ''; // Limpiar campo
    document.getElementById('description').value = ''; // Limpiar campo
    document.getElementById('payService').selectedIndex = 0; // Restablecer el selector
});
