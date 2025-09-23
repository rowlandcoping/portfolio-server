import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";

const form = document.getElementById('aboutForm');
console.log(form)
const select = document.getElementById('type');


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



//Submit Form
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form)

    const data = {
        type: formData.get('type'),
        overview: formData.get('overview'), 
        repo: formData.get('repo'),
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
