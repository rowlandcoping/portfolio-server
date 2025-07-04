const form = document.getElementById('techtypeForm');
import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {
        name: formData.get('name')
    };

    try {
        await fetchWithRedirect({
            url: '/tech/techtypes',
            method: 'POST',
            data: data,
            redirect: '/dashboard'
        });
    } catch (err) {
        showMessage('error', err.message, false);
    }
});