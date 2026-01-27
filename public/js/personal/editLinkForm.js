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
const imageGreenPreview = document.getElementById('imageGreenPreview');
const imageGrayscalePreview = document.getElementById('imageGrayscalePreview');
const imageCancel = document.getElementById('imageCancel');
const currentImage = document.getElementById('currentImage');
let originalBlob = null;
let transformedGreenBlob = null;
let transformedGrayscaleBlob = null;

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

//SUBMIT TO SERVER
form.addEventListener('submit', async (e) => {
    e.preventDefault();
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
    }
    
    formData.delete('logo');
    
    try {
        await fetchWithRedirect({
            url: `/personal/links/${id}`,
            method: 'PATCH',
            data: formData,
            redirect: '/dashboard'
        });
    } catch (err) {
        showMessage('error', err.message || 'Updating Link Failed');
    }
});