import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";

const form = document.getElementById('techForm');
const select = document.getElementById('techtype');

try {
    const result = await fetchWithRedirect({
        url: '/tech/techtypes'
    });

    select.querySelectorAll('option:not(:first-child)').forEach(opt => opt.remove());

    result.forEach(type => {
        const option = document.createElement('option');
        option.value = type.id;
        option.textContent = type.name;
        select.appendChild(option);
    });
} catch(err) {
    showMessage('error', err.message, false);
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        type: formData.get('techtype')
    };

    try {
        await fetchWithRedirect({
            url: '/tech',
            method: 'POST',
            data: data,
            redirect: '/dashboard'
        });
    } catch (err) {
        showMessage('error', err.message, false);
    }
});