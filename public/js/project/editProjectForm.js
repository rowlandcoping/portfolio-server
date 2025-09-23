import showMessage from "../utils/showMessage.js";
import createListLink from "../utils/createListLink.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";
import { processImageHelper } from "../utils/imageProcessor.js";

const message = sessionStorage.getItem('flash');
if (message) {
    showMessage('success', message)
    sessionStorage.removeItem('flash');
}

const url = new URL(window.location.href);
const id = url.pathname.split('/').pop();

const form = document.getElementById('editProjectForm');
const nameInput = document.getElementById('name');
const overInput = document.getElementById('overview');
const urlInput = document.getElementById('url');
const repoInput = document.getElementById('repo');
const altInput = document.getElementById('imageAlt');
const dateMvp = document.getElementById('dateMvp');
const dateProd = document.getElementById('dateProd');
const featureInput = document.getElementById('featureInput');
const issueInput = document.getElementById('issueInput');

const imageUpload = document.getElementById('image');
const imageLoader = document.getElementById('imageLoader');
const imagePreview = document.getElementById('imagePreview');
const imageCancel = document.getElementById('imageCancel');
const currentImage = document.getElementById('currentImage');
let originalBlob = null;
let transformedBlob = null;

const select = document.getElementById('type');
const userSelector = document.getElementById('user');

window.onload=imageUpload.value = "";

//POPULATE FIELDS

try {
    const result = await fetchWithRedirect({
        url: `/projects/${id}`
    });
    nameInput.value = result.name;
    urlInput.value = result.url;

    repoInput.value = result.repo;
    overInput.value = result.overview;
    altInput.value = result.imageAlt;
    currentImage.src = result.imageGrn;

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
    select.value = String(result.typeId);

    //populate users selector
    const userResult = await fetchWithRedirect({
        url:'/users'
    });
    userSelector.querySelectorAll('option').forEach(opt => opt.remove());
    userResult.forEach(type => {
        const option = document.createElement('option');
        option.value = type.id;
        option.textContent = type.name;
        userSelector.appendChild(option);
    });
    userSelector.value = String(result.userId);

    //populate dates
    if (result?.dateMvp) {
        const dateMvpValue = new Date(result.dateMvp).toISOString().split('T')[0];
        dateMvp.value = dateMvpValue;
    }
    console.log('dateProd:', result?.dateProd, 'typeof:', typeof result?.dateProd);
    if (result?.dateProd) {
        const dateProdValue = new Date(result.dateProd).toISOString().split('T')[0];
        dateProd.value = dateProdValue;
    } else {
        dateProd.value = '';  // Clear the input explicitly when null or missing
    }

    //populate features & issues
    const featuresResult = await fetchWithRedirect({
        url:`/projects/features/${result.id}`
    });
    const issuesResult = await fetchWithRedirect({
        url:`/projects/issues/${result.id}`
    });
    const featureArray = featuresResult.map(item => item.description)
    const issueArray = issuesResult.map(item => item.description)
    featureArray.forEach(item => {
        featureInput.value = item
        updateFeatureList("feature");
    })
    issueArray.forEach(item => {
        issueInput.value = item
        updateFeatureList("issue");
    })
} catch (err) {
    showMessage('error', err.message || 'Update failed');
}

//populate project ecosystems

try {
    const projectEcosystems = await fetchWithRedirect({
        url: `/projects/projectecosystems/projects/${id}`
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
    window.location.href = `/dashboard/project/projectecosystem/${id}`;
});

//add outline to feature or issue input if selected:
document.querySelectorAll('.nested-input').forEach(element => {
    element.addEventListener('focus', function () {
        this.closest('.input-wrapper').style.outline = 'rgb(89, 255, 47) 1px solid';
    });
    element.addEventListener('blur', function () {
        this.closest('.input-wrapper').style.outline = 'none';
    });
});

//MANAGE LISTS FOR ISSUES AND FEATURES

//Add placeholders if needed
document.querySelectorAll('.item-list').forEach(list => {
    if (list.children.length === 0) {
        const noItems = document.createElement('div');
        noItems.className = 'placeholder';
        noItems.textContent = 'Nothing added yet!';
        list.appendChild(noItems);
    }
});

//define functions to update lists
function updateHiddenInput(list, hiddenInput) {
    const items = Array.from(list.children).map(div => div.firstChild.textContent);
    hiddenInput.value = JSON.stringify(items);
}
//check placeholders after list update
function checkPlaceholder(list) {
    if (list.children.length === 0) {
        const noItems = document.createElement('div');
        noItems.className = 'placeholder';
        noItems.textContent = 'No items found';
        list.appendChild(noItems);
    }
}

//update feature list

function updateFeatureList(listType) {
    const hiddenInput = document.getElementById(`${listType}s`);
    const input =  document.getElementById(`${listType}Input`);
    const value = input.value.trim();
    const list = document.getElementById(`${listType}List`);

    // Remove "No items found" placeholder if present
    const placeholder = list.querySelector('.placeholder');
    if (placeholder) placeholder.remove();

    // Create the list item
    const item = document.createElement('div');
    item.className = 'feature-item';
    item.textContent = value;

    // Create and append delete button
    const delBtn = document.createElement('button');
    delBtn.innerHTML = '&#216;';
    delBtn.type = 'button';
    delBtn.className = 'delete-button'; // Add class for styling
    delBtn.addEventListener('click', () => {
        item.remove();
        updateHiddenInput(list, hiddenInput);
        checkPlaceholder(list);
    });

    item.appendChild(delBtn);
    list.appendChild(item);
    updateHiddenInput(list, hiddenInput);
    input.value = '';
}

// Add button listeners
document.querySelectorAll('.add-button').forEach(button => {
    button.addEventListener('click', () => {
        const listType = button.id.replace(/^add/i, '').toLowerCase();        
        updateFeatureList(listType);
    });
});

//IMAGE HANDLING
//previews images due for upload
imageUpload.addEventListener('change', () => {
    if (!imageUpload.files[0]) return;
    const fileUrl = URL.createObjectURL(imageUpload.files[0]);
    imageLoader.src = fileUrl; // load original in hidden image
});

//seperate function to avoid endless image loading loop
imageLoader.onload = async () => {
  const result = await processImageHelper(imageLoader);
  originalBlob = result.originalBlob;
  transformedBlob = result.transformedBlob;
  const previewUrl = URL.createObjectURL(transformedBlob);
  imagePreview.src = previewUrl;
  imagePreview.style.display = 'block';
  imageCancel.style.display = "block";
  currentImage.style.display = "none";
  // clean up
  URL.revokeObjectURL(imageLoader.src);
};

// cancel image update/add
imageCancel.addEventListener('click', (e) => {
    e.preventDefault();
    imagePreview.style.display="none";
    imagePreview.src = "";
    imageUpload.value = "";
    imageCancel.style.display = "none";
    currentImage.style.display = "block";
    originalBlob = null;
    transformedBlob = null;
});

//SUBMIT FORM
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    if (imageUpload.files.length > 0) {
        const baseName = imageUpload.files[0].name.replace(/\.[^/.]+$/, ''); // remove file extension
        const originalFile = new File([originalBlob], `${baseName}.webp`, { type: 'image/webp' });
        const transformedFile = new File([transformedBlob], `green-${baseName}.webp`, { type: 'image/webp' });
        const oldTransformedFilename = currentImage.src.split('/').pop();
        const oldFilename = oldTransformedFilename.split('-').slice(1).join('-');        
        formData.append('original', originalFile);
        formData.append('transformed', transformedFile);
        formData.append('oldOriginal', oldFilename);
        formData.append('oldTransformed', oldTransformedFilename);
        formData.delete('image');
    }
    formData.append('id', Number(id)); 

    try {
        await fetchWithRedirect({
            url: '/projects',
            method: 'PATCH',
            data: formData,
            redirect: '/dashboard'
        });
    } catch (err) {
        showMessage('error', err.message || 'Updating Profile Failed');
    }
});
