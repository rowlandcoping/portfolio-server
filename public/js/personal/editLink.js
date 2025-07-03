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
        url: '/personal/userlinks'
    });
    const adminSelect = document.getElementById('adminSelect');
    adminSelect.innerHTML = '';

    const fragment = document.createDocumentFragment();
    for (const link of result) {
        fragment.appendChild(createListLink({
            listItem: link,
            showDelete: true,
            deleteUrl: '/personal/links'
        }));
    }
    adminSelect.appendChild(fragment);    
} catch (err) {
    showMessage('error', err.message, false);
}