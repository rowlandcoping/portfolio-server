import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";
import characterCounter from "../utils/characterCounter.js"; 

const form = document.getElementById('aboutForm');
const select = document.getElementById('type');
const overInput = document.getElementById('overview');
const characterCount = document.getElementById('character-count');


//Populate drop-down
try {
    const result = await fetchWithRedirect({ 
        url: '/projects/types'
    });
    select.querySelectorAll('option:not(:first-child)').forEach(opt => opt.remove());
    result.forEach(type => {
        const option = document.createElement('option');
        option.value = type.id;
        option.textContent = type.name;
        select.appendChild(option);
    });
} catch(err) {
    showMessage('error', err.message, false);
}

//indicate to user number of characters remaining
const overviewCounter = characterCounter(overInput, characterCount, 400);

//Submit Form
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    //validate character limit
    overviewCounter.validate();
    //display error if fields not valid
    if (!form.reportValidity()) {
        return; // Stops here and shows browser errors
    }
    
    const formData = new FormData(form);

    const data = {
        type: formData.get('type'),
        overview: formData.get('overview'), 
        clientRepo: formData.get('clientRepo'),
        serverRepo: formData.get('serverRepo'),
        copyYear:formData.get('copyYear'),
        copyName:formData.get('copyName')
    }

    try {
        await fetchWithRedirect({
            url: '/personal/about',
            method: 'POST',
            data,
            redirect: '/dashboard'
        });
    } catch (err) {
        showMessage('error', err.message || 'Adding Profile Failed');
    }
});
