import { logoutUser } from '../utils/logout.js';
import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";

//display messages for user
try {
    const profile = await fetchWithRedirect({
        url: '/personal/profile'
    });
    if (profile) {
        document.getElementById('createProfile').style.display = 'none';
    } else {
        document.getElementById('manageProfile').style.display = 'none';
    }
} catch (err) {
    showMessage('error', err.message || 'Updating Link Failed');
}

const message = sessionStorage.getItem('flash');
if (message) {
    showMessage('success', message)
    sessionStorage.removeItem('flash');
}

document.getElementById('logout').addEventListener('click', logoutUser);

//refactored code for menus

//pulls entire container
const iconContainer = document.querySelector('.admin-sections');

iconContainer.addEventListener('click', (event) => {
    //ignores it if anything other than a button is clicked on
    if (!event.target.classList.contains('admin-icon')) return;

    const button = event.target;
    //nb this refers to data-section rather than an id
    const section = button.dataset.section;
    const sectionElement = document.getElementById(`${section}Section`);
    const isVisible = sectionElement.classList.contains('visible');

    // Hide all sections & reset icons - we're changing classes rather than applying styles
    document.querySelectorAll('.admin-section-options').forEach(section => {
        section.classList.remove('visible');
        section.classList.add('hidden');
    });
    //resets everythign to closed icons
    document.querySelectorAll('.admin-icon').forEach(icon => {
        icon.innerHTML = "&rrarr;";
        icon.setAttribute('aria-expanded', 'false');
    });
    //sets the selected section/icon to visible.  !isvisible ensure's we aren't re-opening
    //what we just closed
    if (!isVisible) {
        sectionElement.classList.remove('hidden');
        sectionElement.classList.add('visible');
        button.innerHTML = "&ddarr;";
        button.setAttribute('aria-expanded', 'true');
    }
});

/*
//
//original code
//

const iconClasses = Array.from(document.getElementsByClassName('admin-icon'));
const sectionClasses = Array.from(document.getElementsByClassName('admin-section-options'));

iconClasses.forEach(item => {
    item.addEventListener('click', function handleClick(event) {
        const id = item.getAttribute('id');  
        const section = id.split('-')[0];
        showSections(section);
    });
    item.addEventListener('mouseover', function handleClick(event) {
        const id = item.getAttribute('id');
        document.getElementById(id).style.color = "white";
        document.getElementById(id).style.textDecoration = "underline";
    });
    item.addEventListener('mouseout', function handleClick(event) {
        const id = item.getAttribute('id');
        document.getElementById(id).style.color = "rgb(89, 255, 47)";
        document.getElementById(id).style.textDecoration = "none";
    });
});

const showSections = (section) => {
    const sectionId = `${section}Section`;
    const iconId = `${section}-options`;
    if (document.getElementById(sectionId).style.display === "block") {
        document.getElementById(sectionId).style.display = "none";
        document.getElementById(iconId).innerHTML = "&rrarr;";
        return;
    };
    sectionClasses.forEach(item => {
        item.style.display = "none";
    });
    iconClasses.forEach(item => {
        item.innerHTML = "&rrarr;";
    });

    document.getElementById(sectionId).style.display = "block";
    document.getElementById(iconId).innerHTML = "&ddarr;";
}

*/