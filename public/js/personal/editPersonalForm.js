import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";

const form = document.getElementById('editPersonalForm');
const descriptionInput = document.getElementById('description');
const data = {}


try {
    const result = await fetchWithRedirect({
        url: '/personal/profile',
        method: 'GET'
    });
    data.id = Number(result.id);
    descriptionInput.value = result.description;
} catch (err) {
    showMessage('error', err.message || 'Retrieving Data Failed');
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    data.description = formData.get('description');
    console.log(data);
    try {
        await fetchWithRedirect({
            url: '/personal',
            method: 'PATCH',
            data,
            redirect: '/dashboard'
        });
    } catch (err) {
        showMessage('error', err.message || 'Updating Profile Failed');
    }
});
