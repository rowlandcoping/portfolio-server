import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";

const url = new URL(window.location.href);
const id = url.pathname.split('/').pop();

const form = document.getElementById('editEcotypeForm');
const nameInput = document.getElementById('name');

try {
    const result = await fetchWithRedirect({
        url: `/tech/ecotypes/${id}`
    });
    nameInput.value = result.name;
} catch (err) {
    showMessage(errorMessage, err.message || 'Update failed');
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {
        id,
        name: formData.get('name')
    };
    try {
        await fetchWithRedirect({
            url: '/tech/ecotypes',
            method: 'PATCH',
            data,
            redirect: '/dashboard/tech/ecotype/edit'
        });
    } catch (err) {
        showMessage('error', err.message, false);
    }
});