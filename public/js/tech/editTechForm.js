import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";

const url = new URL(window.location.href);
const id = url.pathname.split('/').pop();

const form = document.getElementById('editTechForm');
const selectTechType = document.getElementById('techtype');
const selectEcosystem = document.getElementById('ecosystem');
const nameValue = document.getElementById('name');

const result = await fetchWithRedirect({
        url: `/tech/${id}`
});
if (!result) showMessage('error', err.message, false);

try {    
    const options = await fetchWithRedirect({
        url: '/tech/techtypes'
    });

    selectTechType.querySelectorAll('option:not(:first-child)').forEach(opt => opt.remove());

    options.forEach(type => {
        const option = document.createElement('option');
        option.value = type.id;
        option.textContent = type.name;
        selectTechType.appendChild(option);
    });

    nameValue.value = result.name;
    selectTechType.value = String(result.typeId);
} catch(err) {
    showMessage('error', err.message, false);
}

try {    
    const options = await fetchWithRedirect({
        url: '/tech/ecosystems'
    });

    selectEcosystem.querySelectorAll('option:not(:first-child)').forEach(opt => opt.remove());

    options.forEach(type => {
        const option = document.createElement('option');
        option.value = type.id;
        option.textContent = type.name;
        selectEcosystem.appendChild(option);
    });

    nameValue.value = result.name;
    selectEcosystem.value = String(result.ecoId);
} catch(err) {
    showMessage('error', err.message, false);
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = {
        id,
        name: formData.get('name'),
        type: formData.get('techtype'),
        ecosystem: formData.get('ecosystem')
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