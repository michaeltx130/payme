document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.add-card-table form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const cardName = document.getElementById('cardName').value;
        const cardNumber = document.getElementById('cardNumber').value;
        const expirationDate = document.getElementById('expirationDate').value;
        const securityCode = document.getElementById('cvv').value;

        console.log('Datos del formulario:', {
            cardName,
            cardNumber,
            expirationDate,
            securityCode
        });

        let errors = [];

        if (!cardName.trim()) {
            errors.push("El nombre del titular es obligatorio");
        }

        if (!/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/.test(cardNumber)) {
            errors.push("Número de tarjeta inválido. Debe estar en formato 0000 0000 0000 0000");
        }

        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expirationDate)) {
            errors.push("Fecha de expiración inválida. Use formato MM/AA");
        }

        if (!/^\d{3,4}$/.test(securityCode)) {
            errors.push("Código de seguridad debe ser de 3 o 4 dígitos");
        }

        if (errors.length > 0) {
            alert(errors.join('\n'));
            return;
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('No hay sesión activa. Por favor, inicie sesión.');
            window.location.href = 'login.html';
            return;
        }

        try {
            
            const cleanedCardNumber = cardNumber.replace(/\s/g, '');

            const cardData = {
                card_holder: cardName,
                card_number: cleanedCardNumber,
                expiration_date: expirationDate,
                security_code: securityCode
            };

            console.log('Datos a enviar al backend:', cardData);

            const response = await fetch('http://localhost:3001/cards/addCards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(cardData)
            });

            console.log('Respuesta del servidor:', response);

            const result = await response.json();

            console.log('Resultado del servidor:', result);

            if (response.ok) {
                alert('Tarjeta agregada exitosamente');
                form.reset();
            } else {
                const errorMessage = result.message ||
                    result.errors?.map(err => err.msg).join('\n') ||
                    'Error desconocido al agregar tarjeta';
                alert(errorMessage);
                console.error('Detalles del error:', result);
            }

        } catch (error) {
            console.error('Error completo:', error);
            alert(`Error en el servidor: ${error.message}`);
        }
    });

    const cancelButton = form.querySelector('button[type="button"]');
    cancelButton.addEventListener('click', () => {
        form.reset();
    });
});
