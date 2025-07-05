import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";

const url = new URL(window.location.href);
const id = url.pathname.split('/').pop();

const form = document.getElementById('editTechForm');
const select = document.getElementById('techtype');
const nameValue = document.getElementById('name');

try {
    const result = await fetchWithRedirect({
        url: `/tech/${id}`
    });
    const options = await fetchWithRedirect({
        url: '/tech/techtypes'
    });

    select.querySelectorAll('option:not(:first-child)').forEach(opt => opt.remove());

    options.forEach(type => {
        const option = document.createElement('option');
        option.value = type.id;
        option.textContent = type.name;
        select.appendChild(option);
    });

    nameValue.value = result.name;
    select.value = String(result.typeId);
} catch(err) {
    showMessage('error', err.message, false);
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = {
        id,
        name: formData.get('name'),
        type: formData.get('techtype')
    };

    try {
        await fetchWithRedirect({
            url: '/tech',
            method: 'PATCH',
            data: data,
            redirect: '/dashboard/tech/edit'
        });
    } catch (err) {
        showMessage('error', err.message, false);
    }
});