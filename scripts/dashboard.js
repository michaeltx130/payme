const apiBaseUrl = 'http://localhost:3001';

async function getUserName() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('No hay sesión activa. Por favor, inicie sesión.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/users/getName`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const result = await response.json();
        console.log('Nombre del usuario:', result);
        return result.user;
    } catch (error) {
        console.error('Error al obtener nombre de usuario:', error);
        alert(`Error en el servidor: ${error.message}`);
        return null;
    }
}

async function updateUserGreeting() {
    const user = await getUserName();
    if (user) {
        const greetingElement = document.getElementById('user-greeting');
        greetingElement.textContent = `Hola ${user.first_name}`;
    }
}

async function getAccountBalance() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('No hay sesión activa. Por favor, inicie sesión.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/users/balance`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const result = await response.json();
        console.log('Saldo de la cuenta:', result);
        return result.balance;
    } catch (error) {
        console.error('Error al obtener el saldo de la cuenta:', error);
        alert(`Error en el servidor: ${error.message}`);
        return null;
    }
}

async function updateAccountBalance() {
    const balance = await getAccountBalance();
    if (balance !== null) {
        const balanceElement = document.getElementById('current-balance');
        balanceElement.textContent = `$${balance.toFixed(2)}`;
    }
}

async function getUserCards() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('No hay sesión activa. Por favor, inicie sesión.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/cards/getCards`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const result = await response.json();
        console.log('Tarjetas del usuario:', result);
        return result.cards;
    } catch (error) {
        console.error('Error al obtener tarjetas del usuario:', error);
        alert(`Error en el servidor: ${error.message}`);
        return [];
    }
}

async function updateUserCards() {
    const cards = await getUserCards();
    const selectElements = document.querySelectorAll('select');

    if (cards.length > 0) {
        selectElements.forEach(selectElement => {
            selectElement.innerHTML = '';
            cards.forEach(card => {
                const option = document.createElement('option');
                option.value = card.card_id;
                option.textContent = `${card.card_holder} - **** ${card.last_four_digits}`;
                selectElement.appendChild(option);
            });
        });
    } else {
        const option = document.createElement('option');
        option.textContent = 'No se encontraron tarjetas';
        selectElements.forEach(selectElement => selectElement.appendChild(option));
    }
}


async function addFunds(card_id, amount) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('No hay sesión activa. Por favor, inicie sesión.');
        window.location.href = 'login.html';
        return;
    }

    console.log('Enviando datos al servidor:', { card_id, amount });

    try {
        const response = await fetch(`${apiBaseUrl}/cards/withdrawFromCard`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ card_id, amount })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Network response was not ok: ${response.statusText}, ${errorText}`);
        }

        const result = await response.json();
        console.log('Resultado de añadir saldo:', result);
        alert('Saldo añadido exitosamente');
        updateAccountBalance();
    } catch (error) {
        console.error('Error al añadir saldo:', error);
        alert(`Error en el servidor: ${error.message}`);
    }
}

document.getElementById('showWindowBtn').addEventListener('click', () => {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('floatingWindow').style.display = 'block';
    updateUserCards();
});

document.getElementById('closeWindowBtn').addEventListener('click', () => {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('floatingWindow').style.display = 'none';
});

// Manejo del envío del formulario
document.getElementById('addBalanceForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const cardSelect = document.getElementById('select-target');
    const card_id = cardSelect.value;
    const amountInput = document.getElementById('paymentAmount');
    const amount = parseFloat(amountInput.value);

    // Llama a la función para añadir fondos
    addFunds(card_id, amount).then(() => {
        amountInput.value = '';
        cardSelect.selectedIndex = 0;
    });

    // Cierra la ventana
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('floatingWindow').style.display = 'none';
});


async function getIncomeSummary() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('No hay sesión activa. Por favor, inicie sesión.');
        window.location.href = 'login.html'; return;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/cards/getIncome`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const result = await response.json();
        console.log('Ingresos del usuario:', result);
        return result.accountSummary.income;
    } catch (error) {
        console.error('Error al obtener ingresos del usuario:', error);
        alert(`Error en el servidor: ${error.message}`);
        return null;
    }
}


async function updateIncomeSummary() {
    const income = await getIncomeSummary();
    if (income !== null) {
        const incomeElement = document.getElementById('income-summary');
        if (incomeElement) {
            incomeElement.textContent = `$${income.toFixed(2)}`;
        } else {
            console.error('Elemento para ingresos no encontrado');
        }
    }
}


async function getExpenseSummary() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('No hay sesión activa. Por favor, inicie sesión.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/cards/getExpense`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const result = await response.json();
        console.log('Gastos del usuario:', result);
        return result.accountSummary.expense;
    } catch (error) {
        console.error('Error al obtener gastos del usuario:', error);
        alert(`Error en el servidor: ${error.message}`);
        return null;
    }
}


async function updateExpenseSummary() {
    const expense = await getExpenseSummary();
    if (expense !== null) {
        const expenseElement = document.getElementById('expense-summary');
        if (expenseElement) {
            expenseElement.textContent = `$${expense.toFixed(2)}`;
        } else {
            console.error('Elemento para gastos no encontrado');
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("addCardForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const cardName = document.getElementById('cardName').value;
        const cardNumber = document.getElementById('cardNumber').value;
        const expirationDate = document.getElementById('expirationDate').value;
        const securityCode = document.getElementById('cvv').value;

        let errors = [];

        if (!cardName.trim()) errors.push("El nombre del titular es obligatorio");
        if (!/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/.test(cardNumber))
            errors.push("Número de tarjeta inválido");
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expirationDate))
            errors.push("Fecha inválida, use MM/AA");
        if (!/^\d{3,4}$/.test(securityCode))
            errors.push("CVV inválido");

        if (errors.length > 0) {
            alert(errors.join("\n"));
            return;
        }

        const token = localStorage.getItem("authToken");
        if (!token) {
            alert("No hay sesión activa");
            window.location.href = "login.html";
            return;
        }

        const cleanedCardNumber = cardNumber.replace(/\s/g, "");

        const cardData = {
            card_holder: cardName,
            card_number: cleanedCardNumber,
            expiration_date: expirationDate,
            security_code: securityCode
        };

        try {
            const response = await fetch("http://localhost:3001/cards/addCards", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(cardData)
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.message || "Error al agregar tarjeta");
                return;
            }

            alert("Tarjeta agregada exitosamente");
            form.reset();

        } catch (err) {
            alert("Error del servidor: " + err.message);
        }
    });

});



document.addEventListener('DOMContentLoaded', () => {
    updateUserGreeting();
    updateAccountBalance();
    updateIncomeSummary();
    updateExpenseSummary();
    updateUserCards();
});