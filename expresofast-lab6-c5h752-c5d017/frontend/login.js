const AUTH_URL = 'http://localhost:8080/api/auth/login';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const usernameInput = document.getElementById('username').value.trim();
        const passwordInput = document.getElementById('password').value;
        const errorMessageDiv = document.getElementById('error-message');
        
        errorMessageDiv.style.display = 'none';
        errorMessageDiv.textContent = '';

        const payload = {
            username: usernameInput,
            password: passwordInput
        };

        try {
            const response = await fetch(AUTH_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                localStorage.setItem('roles', JSON.stringify(data.roles));

                window.location.href = 'index.html';
            } else {
                const errorText = await response.text();
                errorMessageDiv.textContent = errorText || 'Credenciales inválidas intente de nuevo.';
                errorMessageDiv.style.display = 'block';
            }
        } catch (error) {
            console.error('Error durante la autenticación:', error);
            errorMessageDiv.textContent = 'Error de conexión con el servidor.';
            errorMessageDiv.style.display = 'block';
        }
    });
});