import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";
import createListLink from "../utils/createListLink.js";

//display messages for user
const message = sessionStorage.getItem('flash');
if (message) {
    showMessage('success', message)
    sessionStorage.removeItem('flash');
}

try {
    const result = await fetchWithRedirect({
        url: '/users/roles'
    });
    const adminSelect = document.getElementById('adminSelect');
    adminSelect.innerHTML = ''; // clear previous content

    //creating a fragment stores up all the appends to be added at the end
    const fragment = document.createDocumentFragment();
    //for... of loop is marginally quicker and supprts break/continue
    for (const role of result) {
        fragment.appendChild(createListLink({
            url: "/dashboard/user/role/edit/",
            innerHTML: "&rarr;&nbsp;&nbsp;",
            listItem: role    
        }));
    }
    adminSelect.appendChild(fragment);

    /*
    result.forEach(role => adminSelect.appendChild(createListLink({
        url: "/dashboard/user/role/edit/",
        innerHTML: "&rarr;&nbsp;&nbsp;",
        listItem: role    
    })));
    */
} catch (err) {
    showMessage('error', err.message, false);
}