import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";
import { optionFragment } from '../utils/optionButtons.js';

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('roles').value = '';
});

const form = document.getElementById('userForm');
const roleButtonsContainer = document.getElementById('roleButtonsContainer');
const rolesInput = document.getElementById('roles');

try {
    const result = await fetchWithRedirect({
        url: '/users/roles'
    });
    roleButtonsContainer.appendChild(optionFragment({
        result,
        optionsInput: rolesInput
    }));
} catch(err) {
    showMessage('error', err.message, false);
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const roles = rolesInput.value.split(',').filter(Boolean).map(Number);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        roles
    }

    try {
        await fetchWithRedirect({
            url: '/users',
            method: 'POST',
            data,
            redirect: '/dashboard'
        });
    } catch (err) {
        showMessage('error', err.message || 'Adding User Failed');
    }
});
