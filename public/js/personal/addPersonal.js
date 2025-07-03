import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";

//check for a profile
try {
    const result = await fetchWithRedirect({
        url: '/personal/profile',
        method: 'GET'
    });
    if (result) {
        sessionStorage.setItem('flash', 'You already have a profile');
        window.location.href = '/dashboard';
    }
} catch(err) {
    showMessage('error', err.message || 'Fail');
}

const form = document.getElementById('personalForm');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = {
        description: formData.get('description')
    }

    try {
        await fetchWithRedirect({
            url: '/personal',
            method: 'POST',
            data,
            redirect: '/dashboard'
        });
    } catch (err) {
        showMessage('error', err.message || 'Adding Profile Failed');
    }
});
