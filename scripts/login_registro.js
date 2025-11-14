const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

// URL base de tu API
const apiBaseUrl = 'http://localhost:3001';// Asegúrate de que esta URL sea correcta

// Evento para abrir form de registro
signUpButton.addEventListener('click', () =>
  container.classList.add('right-panel-active')
);

// Evento para regresar al form de iniciar sesión
signInButton.addEventListener('click', () =>
  container.classList.remove('right-panel-active')
);

// Función para manejar el registro
function registerUser(data) {
  fetch(`${apiBaseUrl}/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      alert('Registro exitoso!');
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Hubo un problema con el registro.');
    });
}

// Función para manejar el inicio de sesión
function loginUser(data) {
  fetch(`${apiBaseUrl}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      alert('Inicio de sesión exitoso!');
      // Guarda el token en localStorage o en cookies
      localStorage.setItem('authToken', data.token);
      // Redirige al dashboard
      window.location.href = '/views/dashboard.html';
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Hubo un problema con el inicio de sesión.');
    });
}

// Añadir eventos a los formularios
document.querySelector('.sign-up-container form').addEventListener('submit', function(event) {
  event.preventDefault();

  const nombre = document.querySelector('.sign-up-container input[placeholder="Nombre"]').value;
  const apellido = document.querySelector('.sign-up-container input[placeholder="Apellido"]').value;
  const correo = document.querySelector('.sign-up-container input[placeholder="Correo electrónico"]').value;
  const contrasena = document.querySelector('.sign-up-container input[placeholder="Contraseña"]').value;

  const data = {
    first_name: nombre,
    last_name: apellido,
    email: correo,
    password: contrasena
  };

  registerUser(data);
});

document.querySelector('.sign-in-container form').addEventListener('submit', function(event) {
  event.preventDefault();

  const correo = document.querySelector('.sign-in-container input[placeholder="Correo electrónico"]').value;
  const contrasena = document.querySelector('.sign-in-container input[placeholder="Contraseña"]').value;

  const data = {
    email: correo,
    password: contrasena
  };

  loginUser(data);
});
