import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";
import { processImageHelper } from "../utils/imageProcessor.js";

window.onload=document.getElementById('logo').value = "";
const url = new URL(window.location.href);
const id = url.pathname.split('/').pop();

const form = document.getElementById('editLinkForm');
const nameInput = document.getElementById('name');
const urlInput = document.getElementById('url');
const altInput = document.getElementById('imageAlt');

const imageUpload = document.getElementById('logo');
const imageLoader = document.getElementById('imageLoader');
const imagePreview = document.getElementById('imagePreview');
const imageCancel = document.getElementById('imageCancel');
const currentImage = document.getElementById('currentImage');
let originalBlob = null;
let transformedBlob = null;

try {
    const result = await fetchWithRedirect({
        url: `/personal/links/${id}`
    });
    nameInput.value = result.name;
    urlInput.value = result.url;
    altInput.value = result.logoAlt;
    currentImage.src = result.logoGrn;

} catch (err) {
    showMessage('error', err.message || 'Update failed');
}

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

//SUBMIT TO SERVER
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    formData.append('id', id);

    if (originalBlob && transformedBlob) {
        const baseName = imageUpload.files[0].name.replace(/\.[^/.]+$/, ''); // remove file extension
        const originalFile = new File([originalBlob], `${baseName}.webp`, { type: 'image/webp' });
        const transformedFile = new File([transformedBlob], `green-${baseName}.webp`, { type: 'image/webp' });
        const oldTransformedFilename = currentImage.src.split('/').pop();
        const oldFilename = oldTransformedFilename.split('-').slice(1).join('-');        
        formData.append('original', originalFile);
        formData.append('transformed', transformedFile);
        formData.append('oldOriginal', oldFilename);
        formData.append('oldTransformed', oldTransformedFilename);
    }
    formData.delete('logo');
    
    try {
        await fetchWithRedirect({
            url: '/personal/links',
            method: 'PATCH',
            data: formData,
            redirect: '/dashboard'
        });
    } catch (err) {
        showMessage('error', err.message || 'Updating Link Failed');
    }
});