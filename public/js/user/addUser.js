import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";

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
    const fragment = document.createDocumentFragment();
    //for... of loop is marginally quicker and supprts break/continue
    for (const role of result) {        
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = role.name;
            button.id = role.id
            button.className = 'deselected';
            button.addEventListener('click', (event) => {
                categoryClicked(role.id);
            });
            fragment.appendChild(button);
    }
    roleButtonsContainer.appendChild(fragment);
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
        showMessage(errorMessage, err.message || 'Adding User Failed');
    }
});



const categoryClicked = (id) => {
    const btnClicked = document.getElementById(id);
    // removes empty string, converts to a number array
    const currentRoles = rolesInput.value.split(',').filter(Boolean).map(Number); 
    if (btnClicked.className === 'deselected') {
        btnClicked.className = 'selected';
        currentRoles.push(id);
    } else {        
        //this line locates the position of id in the currentRoles array (ie its array index)
        //it returns the index if found, or -1 if not
        const index = currentRoles.indexOf(id);
        //if it exists (ie greater than -1) then remove it
        if (index > -1) {
            //the 1 means remove one item, starting at the provided index(ie that item)
            currentRoles.splice(index, 1);
        }
        btnClicked.className = 'deselected';
    }
    rolesInput.value = currentRoles.join(',');
}

