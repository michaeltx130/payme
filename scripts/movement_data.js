// URL base de tu API
const apiBaseUrl = 'http://localhost:3001'; // Asegúrate de que esta URL sea correcta

// Función para obtener el historial de transacciones
async function getTransactionHistory() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('No hay sesión activa. Por favor, inicie sesión.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/transactions/history`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Network response was not ok: ${response.statusText}, ${errorText}`);
        }

        const result = await response.json();
        return result.transactions;
    } catch (error) {
        console.error('Error al obtener historial de transacciones:', error);
        alert(`Error en el servidor: ${error.message}`);
        return [];
    }
}

// Función para poblar la tabla con las transacciones
async function populateTransactionTable() {
    const transactions = await getTransactionHistory();
    const tableBody = document.querySelector('.transactions-table tbody');

    if (transactions.length > 0) {
        document.querySelector('.empty-state').style.display = 'none';
        transactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(transaction.created_at).toLocaleDateString()}</td>
                <td>${transaction.amount}</td>
                <td>${transaction.transaction_type}</td>
                <td>${transaction.message}</td>
            `;
            tableBody.appendChild(row);
        });
    } else {
        document.querySelector('.empty-state').style.display = 'block';
    }
}

// Ejecutar la función al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    populateTransactionTable();
});
