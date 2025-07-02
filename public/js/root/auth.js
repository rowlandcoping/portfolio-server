import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";

const form = document.getElementById('loginForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    try {
        await fetchWithRedirect({
            url: '/auth/login',
            method: 'POST',
            data: data,
            redirect: '/dashboard'
        });
    } catch (err) {
        showMessage('error', err.message, false);
    }
});
