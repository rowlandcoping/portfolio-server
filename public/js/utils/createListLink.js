import { fetchWithRedirect } from "./fetchWithRedirect.js";
import showMessage from "./showMessage.js";

function createListLink({
    listItem,
    showDelete = false,
    deleteUrl = null,
    baseUrl = window.location.href
} = {}) {
    //add edit link
    const h4 = document.createElement('h4');
    const a = document.createElement('a');
    a.href = `${baseUrl}/${listItem.id}`;
    a.innerHTML = `&rarr;&nbsp;&nbsp;${listItem.name}`;
    h4.appendChild(a);   

    //add delete button
    if (showDelete) {
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.innerHTML = '&#216;'; // Trash can icon
        deleteBtn.className = 'delete-button'; // Add class for styling
        deleteBtn.title = 'delete';
        deleteBtn.onclick = async () => {
            try {
                await fetchWithRedirect({
                    url: deleteUrl,
                    method: 'DELETE',
                    data: { id: listItem.id },
                    redirect: window.location.href
                });
            } catch (err) {
                showMessage('error', err.message, false);
            }
        };
        h4.appendChild(deleteBtn);
    }
    return h4;
}

export default createListLink