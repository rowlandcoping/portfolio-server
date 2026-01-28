import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";

const message = sessionStorage.getItem('flash');
if (message) {
    showMessage('success', message)
    sessionStorage.removeItem('flash');
}

const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
    const year = String(date.getFullYear()).slice(-2);
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year}, ${hours}:${minutes}`;
};


try {
    const contacts = await fetchWithRedirect({
        url: '/personal/usercontacts'
    });
    console.log(contacts);
    const list = document.getElementById("messages-container");
    contacts.forEach(contact => {
        const header = document.createElement('div');
        const message = document.createElement('div');
        const hr = document.createElement('hr');
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.innerHTML = 'Delete Message &#216;'; // Trash can icon
        deleteBtn.className = 'delete-button'; // Add class for styling
        deleteBtn.title = 'delete';
        deleteBtn.onclick = async () => {
            try {
                await fetchWithRedirect({
                    url: `/personal/contacts/${contact.id}`,
                    method: 'DELETE',
                    redirect: window.location.href
                });
            } catch (err) {
                showMessage('error', err.message, false);
            }
        };
        header.className = 'message-header';
        message.className = 'message-content';
        header.textContent = `${contact.name}, ${contact.email}, ${formatTimestamp(contact.timestamp)}`;
        message.textContent = contact.message;
        list.appendChild(header);
        list.appendChild(message);
        list.appendChild(deleteBtn)
        list.appendChild(hr);
    });
    
     

} catch(err) {
    showMessage('error', err.message || 'No profile found');
}