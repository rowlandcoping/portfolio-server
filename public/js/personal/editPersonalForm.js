import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";
import createListLink from "../utils/createListLink.js";
import { processImageHelper } from "../utils/imageProcessor.js";
import characterCounter from "../utils/characterCounter.js";

const form = document.getElementById('editPersonalForm');
const descriptionInput = document.getElementById('description');
const jobTitleInput =  document.getElementById('jobTitle');
const attributeInput =  document.getElementById('attributeInput');
const characterCount = document.getElementById('character-count');


const altInput = document.getElementById('imageAlt');
const imageUpload = document.getElementById('image'); 
const imageLoader = document.getElementById('imageLoader');
const imageGreenPreview = document.getElementById('imageGreenPreview');
const imageGrayscalePreview = document.getElementById('imageGrayscalePreview');
const imageCancel = document.getElementById('imageCancel');
const currentImage = document.getElementById('currentImage');
let originalBlob = null;
let transformedGreenBlob = null;
let transformedGrayscaleBlob = null;
window.onload=imageUpload.value = "";

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
    jobTitleInput.value = result.jobTitle;
    altInput.value = result.imageAlt;
    currentImage.src = result.imageGrn;
    const attributeArray = JSON.parse(result.attributes);

    attributeArray.forEach(item => {
        attributeInput.value = item;
        updateFeatureList("attribute");
    });


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
                deleteUrl: `/personal/skills/${skill.id}`,
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
                deleteUrl: `/personal/links/${link.id}`,
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

//adding a personal attribute
//add outline to attribute input if selected:
document.querySelectorAll('.nested-input').forEach(element => {
    element.addEventListener('focus', function () {
        this.closest('.input-wrapper').style.outline = 'rgb(89, 255, 47) 1px solid';
    });
    element.addEventListener('blur', function () {
        this.closest('.input-wrapper').style.outline = 'none';
    });
});
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

//update feature list function (we could possibly simplify)

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

//update text to indicate to user number of characters remaining
const overviewCounter = characterCounter(descriptionInput, characterCount, 400);


//IMAGE HANDLING
//previews images due for upload
imageUpload.addEventListener('change', () => {
    if (!imageUpload.files[0]) return;
    const fileUrl = URL.createObjectURL(imageUpload.files[0]);
    imageLoader.src = fileUrl; // load original in hidden image
});

//seperate function to avoid endless image loading loop
imageLoader.onload = async () => {
  const greenResult = await processImageHelper(imageLoader, "green");
  const grayscaleResult = await processImageHelper(imageLoader, "grayscale");
  originalBlob = greenResult.originalBlob;
  transformedGreenBlob = greenResult.transformedBlob;
  transformedGrayscaleBlob = grayscaleResult.transformedBlob;
  const greenPreviewUrl = URL.createObjectURL(transformedGreenBlob);
  const grayscalePreviewUrl = URL.createObjectURL(transformedGrayscaleBlob);
  imageGreenPreview.src = greenPreviewUrl;
  imageGreenPreview.style.display = 'block';
  imageGrayscalePreview.src = grayscalePreviewUrl;
  imageGrayscalePreview.style.display = 'block';
  imageCancel.style.display = "block";
  currentImage.style.display = "none";
  // clean up
  URL.revokeObjectURL(imageLoader.src);
};

// cancel image update/add
imageCancel.addEventListener('click', (e) => {
    e.preventDefault();
    imageGreenPreview.style.display="none";
    imageGreenPreview.src = "";
    imageGrayscalePreview.style.display="none";
    imageGrayscalePreview.src = "";
    imageUpload.value = "";
    imageCancel.style.display = "none";
    currentImage.style.display = "block";
    originalBlob = null;
    transformedGreenBlob = null;
    transformedGrayscaleBlob = null;
});


//update images
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    //validate character limit
    overviewCounter.validate();
    //display error if fields not valid
    if (!form.reportValidity()) {
        return; // Stops here and shows browser errors
    }

    const formData = new FormData(form);
    if (imageUpload.files.length > 0) {
        const baseName = imageUpload.files[0].name.replace(/\.[^/.]+$/, ''); // remove file extension
        const originalFile = new File([originalBlob], `${baseName}.webp`, { type: 'image/webp' });
        const transformedGreenFile = new File([transformedGreenBlob], `green-${baseName}.webp`, { type: 'image/webp' });
        const transformedGrayscaleFile = new File([transformedGrayscaleBlob], `grayscale-${baseName}.webp`, { type: 'image/webp' });

        const oldGreenTransformedFilename = currentImage.src.split('/').pop();
        const oldGrayscaleTransformedFilename = "grayscale-" + oldGreenTransformedFilename.split('-').slice(1).join('-');
        const oldFilename = oldGreenTransformedFilename.split('-').slice(1).join('-');   

        formData.append('original', originalFile);
        formData.append('transformedGreen', transformedGreenFile);
        formData.append('transformedGrayscale', transformedGrayscaleFile);

        formData.append('oldOriginal', oldFilename);
        formData.append('oldGreenTransformed', oldGreenTransformedFilename);
        formData.append('oldGrayscaleTransformed', oldGrayscaleTransformedFilename);

        formData.delete('image');
    }
    formData.append('id', data.id);
    try {
        await fetchWithRedirect({
            url: '/personal',
            method: 'PATCH',
            data:formData,
            redirect: '/dashboard'
        });
    } catch (err) {
        showMessage('error', err.message || 'Updating Profile Failed');
    }
});
