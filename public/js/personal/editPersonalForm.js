import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";
import createListLink from "../utils/createListLink.js";

const form = document.getElementById('editPersonalForm');
const descriptionInput = document.getElementById('description');

const data = {}

const message = sessionStorage.getItem('flash');
if (message) {
    showMessage('success', message)
    sessionStorage.removeItem('flash');
}


try {
    const result = await fetchWithRedirect({
        url: '/personal/profile',
        method: 'GET'
    });
    data.id = Number(result.id);
    descriptionInput.value = result.description;
} catch (err) {
    showMessage('error', err.message || 'Retrieving Data Failed');
}

//populate skills
try {
    const skills = await fetchWithRedirect({
        url: '/personal/profileskills',
        method: 'POST',
        data: {id: data.id }
    });
    const adminSkillSelect = document.getElementById('adminSkillSelect');
    adminSkillSelect.innerHTML = '';
    if (skills?.length) {
        const fragment = document.createDocumentFragment();
        for (const skill of skills) {
            fragment.appendChild(createListLink({
                listItem: skill,
                showDelete: true,
                deleteUrl: '/personal/skills',
                baseUrl: '/dashboard/personal/skill/edit'
            }));
        }
        adminSkillSelect.appendChild(fragment);
    } else {
        adminSkillSelect.innerText = "No Skills Found"
    }
} catch (err) {
    showMessage('error', err.message, false);
}

//populate links
try {
    const links = await fetchWithRedirect({
        url: '/personal/profilelinks',
        method: 'POST',
        data: {id: data.id } 
    });
    const adminLinkSelect = document.getElementById('adminLinkSelect');
    adminLinkSelect.innerHTML = '';
    if (links?.length) {
        const fragment = document.createDocumentFragment();
        for (const link of links) {
            fragment.appendChild(createListLink({
                listItem: link,
                showDelete: true,
                deleteUrl: '/personal/links',
                baseUrl: '/dashboard/personal/link/edit'
            }));
        }
        adminLinkSelect.appendChild(fragment);
    } else {
        adminLinkSelect.innerText = "No Links Found"
    }
} catch (err) {
    showMessage('error', err.message, false);
}

//clicking an add button
const addSkill = document.getElementById('addSkill');
const addLink = document.getElementById('addLink');

addLink.addEventListener('click', () => {
    window.location.href = `/dashboard/personal/link/${data.id}`;
});
addSkill.addEventListener('click', () => {
    window.location.href = `/dashboard/personal/skill/${data.id}`;
});
//update description
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    data.description = formData.get('description');
    try {
        await fetchWithRedirect({
            url: '/personal',
            method: 'PATCH',
            data,
        });
    } catch (err) {
        showMessage('error', err.message || 'Updating Profile Failed');
    }
});
