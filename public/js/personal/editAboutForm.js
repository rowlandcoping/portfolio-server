import showMessage from "../utils/showMessage.js";
import createListLink from "../utils/createListLink.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";

const message = sessionStorage.getItem('flash');
if (message) {
    showMessage('success', message)
    sessionStorage.removeItem('flash');
}

const data = {}
const form = document.getElementById('editAboutForm');
const overInput = document.getElementById('overview');
const repoInput = document.getElementById('repo');
const copyYearInput = document.getElementById('copyYear');
const copyNameInput = document.getElementById('copyName');
const select = document.getElementById('type');

//POPULATE FIELDS
try {
    //populate types selector
    const typeOptions = await fetchWithRedirect({
        url: '/projects/types'
    });
    select.querySelectorAll('option:not(:first-child)').forEach(opt => opt.remove());
    typeOptions.forEach(type => {
        const option = document.createElement('option');
        option.value = type.id;
        option.textContent = type.name;
        select.appendChild(option);
    });
    const result = await fetchWithRedirect({
        url: '/personal/about',
        method: 'GET'
    });    
    data.id = Number(result.id);
    overInput.value = result.overview;
    repoInput.value = result.repo;
    copyYearInput.value = result.copyYear;
    copyNameInput.value = result.copyName;
    select.value = String(result.typeId);
    //NB route needs to retrieve it for logged in person.    
} catch (err) {
    showMessage('error', err.message || 'Retrieving Data Failed');
}

//populate project ecosystems
try {
    const projectEcosystems = await fetchWithRedirect({
        //a fetch by about id route needs creating
        url: `/projects/projectecosystems/about/${data.id}`
    });
    const adminProjecoSelect = document.getElementById('adminProjecoSelect');
    console.log(projectEcosystems)
    adminProjecoSelect.innerHTML = '';
    if (projectEcosystems?.length) {
        const fragment = document.createDocumentFragment();
        for (const link of projectEcosystems) {
            fragment.appendChild(createListLink({
                listItem: link,
                showDelete: true,
                deleteUrl: '/projects/projectecosystems',
                baseUrl: '/dashboard/project/projectecosystem/edit'
            }));
        }
        adminProjecoSelect.appendChild(fragment);
    } else {
        adminProjecoSelect.innerText = "No Ecosystems Found";
    }
} catch (err) {
    showMessage('error', err.message, false);
}

const addProjeco = document.getElementById('addProjeco');

addProjeco.addEventListener('click', () => {
    //need new add page/route for about unless I want to get real fancy logging where it's from.  perhaps not.
    window.location.href = `/dashboard/project/projectecosystem/about/${data.id}`;
});

//SUBMIT FORM
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    data.overview = overInput.value
    data.repo = repoInput.value
    data.copyYear = copyYearInput.value
    data.copyName = copyNameInput.value
    data.type = select.value
    try {
        await fetchWithRedirect({
            url: '/personal/about',
            method: 'PATCH',
            data,
            redirect: "/dashboard"
        });
    } catch (err) {
        showMessage('error', err.message || 'Updating Profile Failed');
    }
});
