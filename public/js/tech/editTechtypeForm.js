import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";

const url = new URL(window.location.href);
const id = url.pathname.split('/').pop();

const form = document.getElementById('editTechtypeForm');
const nameInput = document.getElementById('name');

try {
    const result = await fetchWithRedirect({
        url: `/tech/techtypes/${id}`
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
            url: '/tech/techtypes',
            method: 'PATCH',
            data,
            redirect: '/dashboard/tech/techtype/edit'
        });
    } catch (err) {
        showMessage('error', err.message, false);
    }
});