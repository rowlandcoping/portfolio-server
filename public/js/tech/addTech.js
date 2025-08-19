import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";

const form = document.getElementById('techForm');
const selectTechType = document.getElementById('techtype');
const selectEcosystem = document.getElementById('ecosystem');

try {
    const result = await fetchWithRedirect({
        url: '/tech/techtypes'
    });

    selectTechType.querySelectorAll('option:not(:first-child)').forEach(opt => opt.remove());

    result.forEach(type => {
        const option = document.createElement('option');
        option.value = type.id;
        option.textContent = type.name;
        selectTechType.appendChild(option);
    });
} catch(err) {
    showMessage('error', err.message, false);
}

try {
    const result = await fetchWithRedirect({
        url: '/tech/ecosystems'
    });

   selectEcosystem.querySelectorAll('option:not(:first-child)').forEach(opt => opt.remove());

    result.forEach(type => {
        const option = document.createElement('option');
        option.value = type.id;
        option.textContent = type.name;
        selectEcosystem.appendChild(option);
    });
} catch(err) {
    showMessage('error', err.message, false);
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        type: formData.get('techtype'),
        ecosystem: formData.get('ecosystem')
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