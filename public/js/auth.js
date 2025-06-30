const form = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            // Login success — redirect to dashboard
            
        
            window.location.href = '/dashboard';
        
        } else {
            // Login failed — show error
            const result = await response.json();
            errorMessage.textContent = result.message || 'Login failed';
            errorMessage.style.display = 'block';
        }
    } catch (err) {
        errorMessage.textContent = 'Network error, please try again.';
        errorMessage.style.display = 'block';
    }
});