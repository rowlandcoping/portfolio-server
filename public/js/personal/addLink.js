import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";
import { processImageHelper } from "../utils/imageProcessor.js";

window.onload=document.getElementById('logo').value = "";
const url = new URL(window.location.href);
const profileId = url.pathname.split('/').pop();
const form = document.getElementById('linkForm');

const imageUpload = document.getElementById('logo');
const imageLoader = document.getElementById('imageLoader');
const imageGreenPreview = document.getElementById('imageGreenPreview');
const imageGrayscalePreview = document.getElementById('imageGrayscalePreview');
const imageCancel = document.getElementById('imageCancel');
let originalBlob = null;
let transformedGreenBlob = null;
let transformedGrayscaleBlob = null;
 
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
        formData.append('original', originalFile);
        formData.append('transformedGreen', transformedGreenFile);
        formData.append('transformedGrayscale', transformedGrayscaleFile);
    }
    formData.append('profileId', profileId);
    formData.delete('logo');
    
    try {
        await fetchWithRedirect({
            url: '/personal/links',
            method: 'POST',
            data: formData,
            redirect: '/dashboard/personal/edit'
        });
    } catch (err) {
        showMessage('error', err.message || 'Adding Link Failed');
    }
});