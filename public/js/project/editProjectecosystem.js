import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";
import { optionFragment } from '../utils/optionButtons.js';

const url = new URL(window.location.href);
const id = url.pathname.split('/').pop();
let projectId;

const form = document.getElementById('editProjectecosystemForm');
const buttonsContainer = document.getElementById('buttonsContainer');
const techInput = document.getElementById('tech');
const select = document.getElementById('ecosystem');

window.addEventListener('DOMContentLoaded', () => {
    techInput.value = '';
});

try {
    const result = await fetchWithRedirect({
        url:`/projects/projectecosystems/${id}`
    })
    const techArray = result.tech.map(tech => tech.id);
    techInput.value = techArray.join(',');
    projectId = result.projectId;
    const techResult = await fetchWithRedirect({
        url: '/tech'
    });
    buttonsContainer.appendChild(optionFragment({
        result:techResult,
        optionsArray: techArray,
        optionsInput: techInput
    }));


    const ecoResult = await fetchWithRedirect({
        url: '/tech/ecosystems'
    });
    select.querySelectorAll('option:not(:first-child)').forEach(opt => opt.remove());
    ecoResult.forEach(type => {
        const option = document.createElement('option');
        option.value = type.id;
        option.textContent = type.name;
        select.appendChild(option);
    });
    select.value = String(result.ecoId);
} catch(err) {
    showMessage('error', err.message, false);
}


form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const tech = techInput.value.split(',').filter(Boolean).map(Number);
    const optionName = select.options[select.selectedIndex].text;
    const data = {
        id,
        name: optionName,
        ecosystem: formData.get('ecosystem'),
        tech
    }

    try {
        await fetchWithRedirect({
            url: '/projects/projectecosystems',
            method: 'PATCH',
            data,
            redirect: `/dashboard/project/edit/${projectId}`
        });
    } catch (err) {
        showMessage('error', err.message || 'Updating Project Ecosystem Failed');
    }
});
