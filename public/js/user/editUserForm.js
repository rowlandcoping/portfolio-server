import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";
import { optionFragment } from '../utils/optionButtons.js';

const url = new URL(window.location.href);
const id = url.pathname.split('/').pop();

const form = document.getElementById('editUserForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const rolesInput = document.getElementById('roles');

try {
    const result = await fetchWithRedirect({
        url: `/users/${id}`
    });
    nameInput.value = result.name;
    emailInput.value = result.email;
    const rolesArray = result.roles.map(role => role.id);
    rolesInput.value = rolesArray.join(',');

    //create buttons
    const roles = await fetchWithRedirect({
        url: `/users/roles`
    });
    roleButtonsContainer.appendChild(optionFragment({
        result: roles,
        optionsArray: rolesArray,
        optionsInput: rolesInput
    }));
} catch (err) {
    showMessage('error', err.message || 'Cannot find user data');
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        id,
        name: nameInput.value,
        email: emailInput.value,
        roles: rolesInput.value.split(',').filter(Boolean).map(Number)
    };
    
    try {
        await fetchWithRedirect({
            url: '/users',
            method: 'PATCH',
            data,
            redirect: '/dashboard/user/edit'
        });
    } catch (err) {
        showMessage('error', err.message, false);
    }
});