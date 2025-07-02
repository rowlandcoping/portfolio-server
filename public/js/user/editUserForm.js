import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";

const url = new URL(window.location.href);
const id = url.pathname.split('/').pop();

const form = document.getElementById('editUserForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const rolesInput = document.getElementById('roles');

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
    const fragment = document.createDocumentFragment();
    //for... of loop is marginally quicker and supprts break/continue
    for (const option of roles) {        
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = option.name;
            button.id = option.id;
            if (!rolesArray.includes(option.id)) {
                button.className = 'deselected';
            } else {
                button.className = 'selected';
            }
            button.addEventListener('click', (event) => {
                categoryClicked(option.id);
            });
            fragment.appendChild(button);
    }
    roleButtonsContainer.appendChild(fragment);
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
    console.log(data)
    
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