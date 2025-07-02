import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";
import createListLink from "../utils/createListLink.js";

//display messages for user
const message = sessionStorage.getItem('flash');
if (message) {
    showMessage('success', message)
    sessionStorage.removeItem('flash');
}
const apiUrl = '/users';

try {
    const result = await fetchWithRedirect({
        url: apiUrl
    });
    const adminSelect = document.getElementById('adminSelect');
    adminSelect.innerHTML = ''; // clear previous content

    //creating a fragment stores up all the appends to be added at the end
    const fragment = document.createDocumentFragment();
    //for... of loop is marginally quicker and supprts break/continue
    for (const item of result) {
        fragment.appendChild(createListLink({
            listItem: item,
            showDelete: true,
            deleteUrl: apiUrl
        }));
    }
    adminSelect.appendChild(fragment);
} catch (err) {
    showMessage('error', err.message, false);
}