import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";
import createListLink from "../utils/createListLink.js";
import { processImageHelper } from "../utils/imageProcessor.js";

const form = document.getElementById('editPersonalForm');
const descriptionInput = document.getElementById('description');
const starSignInput =  document.getElementById('starSign');
const favColorInput =  document.getElementById('favColor');


const altInput = document.getElementById('imageAlt');
const imageUpload = document.getElementById('image');
const imageLoader = document.getElementById('imageLoader');
const imagePreview = document.getElementById('imagePreview');
const imageCancel = document.getElementById('imageCancel');
const currentImage = document.getElementById('currentImage');
let originalBlob = null;
let transformedBlob = null;
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
    favColorInput.value = result.favColor;
    starSignInput.value = result.starSign;
    altInput.value = result.imageAlt;
    currentImage.src = result.imageGrn;
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


//update description
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
