import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";

const form = document.getElementById('ecosystemForm');
const select = document.getElementById('ecotype');

try {
    const result = await fetchWithRedirect({
        url: '/tech/ecotypes'
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
        type: formData.get('ecotype')
    };

    try {
        await fetchWithRedirect({
            url: '/tech/ecosystems',
            method: 'POST',
            data: data,
            redirect: '/dashboard'
        });
    } catch (err) {
        showMessage('error', err.message, false);
    }
});