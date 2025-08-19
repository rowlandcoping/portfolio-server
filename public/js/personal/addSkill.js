import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";
import { optionFragment } from '../utils/optionButtons.js';

const url = new URL(window.location.href);
const profileId = url.pathname.split('/').pop();

const form = document.getElementById('skillForm');

const buttonsContainer = document.getElementById('buttonsContainer');
const techInput = document.getElementById('tech');
const select = document.getElementById('ecosystem');

window.addEventListener('DOMContentLoaded', () => {
    techInput.value = '';
});

try {
    const result = await fetchWithRedirect({
        url: '/tech/ecosystems'
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

const popButtons = async () => {    
    if (select.value) {
        try {
            const result = await fetchWithRedirect({
                url: `/tech/${select.value}`,
            });
            buttonsContainer.appendChild(optionFragment({
                result,
                optionsInput: techInput
            }));
        } catch(err) {
            showMessage('error', err.message, false);
        }
    } else {
        buttonsContainer.innerHTML = "<p>No Options Found</p>";
    }
}

select.addEventListener('change', () => {
    techInput.value = '';
    buttonsContainer.replaceChildren();
    popButtons();
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const tech = techInput.value.split(',').filter(Boolean).map(Number);
    const optionName = select.options[select.selectedIndex].text;
    const data = {
        name: optionName,
        ecosystem: select.value,
        personal: profileId,
        tech
    }

    try {
        await fetchWithRedirect({
            url: '/personal/skills',
            method: 'POST',
            data,
            redirect: `/dashboard/personal/edit`
        });
    } catch (err) {
        showMessage('error', err.message || 'Adding Skill Failed');
    }
});