import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";

const url = new URL(window.location.href);
const id = url.pathname.split('/').pop();

const form = document.getElementById('editSkillForm');
const ecoContainer = document.getElementById('ecoContainer');
const techContainer = document.getElementById('techContainer');
const ecoSelect = document.getElementById('ecosystem');
const techSelect = document.getElementById('technology');
const ecoButton = document.getElementById('loadEcosystem');
const techButton = document.getElementById('loadTechnology');

const popEcosystem = async () => {
    try {
        if (ecoSelect.options.length < 2) {
            const result = await fetchWithRedirect({
                url: '/tech/ecosystems'
            });            
            result.forEach(type => {
                const option = document.createElement('option');
                option.value = type.id;
                option.textContent = type.name;
                ecoSelect.appendChild(option);
            });
        }
    } catch(err) {
        showMessage('error', err.message, false);
    }
    ecoContainer.style.display = "flex"
    techContainer.style.display = "none"
}

const popTech = async () => {
    try {
        if (techSelect.options.length < 2) {
            const result = await fetchWithRedirect({
                url: '/tech'
            });
            result.forEach(type => {
                const option = document.createElement('option');
                option.value = type.id;
                option.textContent = type.name;
                techSelect.appendChild(option);
            });
        }
        //techSelect.querySelectorAll('option:not(:first-child)').forEach(opt => opt.remove());              
    } catch(err) {
        showMessage('error', err.message, false);
    }
    techContainer.style.display = "flex"
    ecoContainer.style.display = "none"
}


//populate form (oh boy)
try {
    const result = await fetchWithRedirect({
        url: `/personal/skills/${id}`
    });
    document.getElementById('competency').value = result.competency;
    if (result.ecoId) {
        ecoButton.className = 'selected';
        await popEcosystem();
        ecoSelect.querySelector(`option[value="${result.ecoId}"]`).selected = true;
    }
    if (result.techId) {
        techButton.className = 'selected';
        await popTech();
        techSelect.querySelector(`option[value="${result.techId}"]`).selected = true;
    }
} catch (err) {
    showMessage('error', err.message || 'Update failed');
}

ecoButton.addEventListener('click', () => {
    ecoButton.className="selected"
    techButton.className="deselected"
    popEcosystem();
});

techButton.addEventListener('click', () => {    
    ecoButton.className="deselected"
    techButton.className="selected"
    popTech();
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    let optionName; 
    let selectedTech;
    let selectedEco;
    if (techButton.classList.contains('selected')) {        
        selectedTech = formData.get('technology');
        optionName = techSelect.options[techSelect.selectedIndex].text;
        selectedEco = undefined;
    }
    if (ecoButton.classList.contains('selected')) {
        selectedTech = undefined
        optionName = ecoSelect.options[ecoSelect.selectedIndex].text;
        selectedEco = formData.get('ecosystem');
    }

    const data = {
        id,
        name: optionName,
        competency: formData.get('competency'),
        ecosystem: selectedEco,
        tech: selectedTech
    }

    console.log(data)

    try {
        await fetchWithRedirect({
            url: '/personal/skills',
            method: 'PATCH',
            data,
            redirect: '/dashboard/personal/edit'
        });
    } catch (err) {
        showMessage('error', err.message || 'Updating Skill Failed');
    }
});