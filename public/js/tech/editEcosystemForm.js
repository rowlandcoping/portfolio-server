import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";

const url = new URL(window.location.href);
const id = url.pathname.split('/').pop();

const form = document.getElementById('editEcosystemForm');
const select = document.getElementById('ecotype');
const nameValue = document.getElementById('name');

try {
    const result = await fetchWithRedirect({
            url: `/tech/ecosystems/${id}`
    });
    const options = await fetchWithRedirect({
        url: '/tech/ecotypes'
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
        type: formData.get('ecotype')
    };

    try {
        await fetchWithRedirect({
            url: '/tech/ecosystems/',
            method: 'PATCH',
            data: data,
            redirect: '/dashboard/tech/ecosystem/edit'
        });
    } catch (err) {
        showMessage('error', err.message, false);
    }
});