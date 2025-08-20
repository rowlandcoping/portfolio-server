import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";
import { optionFragment } from '../utils/optionButtons.js';

const url = new URL(window.location.href);
const id = url.pathname.split('/').pop();

const state = {
  projectId: null,
  ecosystemId: null,
  oldValues: [],
  techIds: []
};

const form = document.getElementById('editProjectecosystemForm');
const buttonsContainer = document.getElementById('buttonsContainer');
const techInput = document.getElementById('tech');
const select = document.getElementById('ecosystem');


window.addEventListener('DOMContentLoaded', () => {
    techInput.value = '';
});

const populateTechButtons = (result, techArray, techInput) => {
  buttonsContainer.replaceChildren(optionFragment({
    result,
    optionsArray: techArray,
    optionsInput: techInput
  }));
};

try {
    const result = await fetchWithRedirect({
        url:`/projects/projectecosystems/${id}`
    })
    state.techArray = result.tech.map(tech => tech.id);
    const initialValues = state.techArray.join(',');
    state.oldValues = initialValues;
    techInput.value = initialValues;
    state.projectId = result.projectId;
    
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
    state.ecosystemId = String(result.ecoId);
    select.value = String(result.ecoId);
    const techResult = await fetchWithRedirect({
        url: `/tech/associated/${select.value}`
    });
    populateTechButtons(techResult, state.techArray, techInput)
} catch(err) {
    showMessage('error', err.message, false);
}

const popButtons = async () => {      
        try {
            const result = await fetchWithRedirect({
                url: `/tech/associated/${select.value}`,
            });
            if (select.value === state.ecosystemId) {
                state.techArray = state.oldValues;
                techInput.value = state.oldValues;
            } else {
                state.techArray = [];
            }
            populateTechButtons(result, state.techArray, techInput)
        } catch(err) {
            showMessage('error', err.message, false);
        }
    //}
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
        id,
        name: optionName,
        ecosystem: select.value,
        tech
    }

    try {
        await fetchWithRedirect({
            url: '/projects/projectecosystems',
            method: 'PATCH',
            data,
            redirect: `/dashboard/project/edit/${state.projectId}`
        });
    } catch (err) {
        showMessage('error', err.message || 'Updating Project Ecosystem Failed');
    }
});
