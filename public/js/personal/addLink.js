import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";
import { processImageHelper } from "../utils/imageProcessor.js";

window.onload=document.getElementById('logo').value = "";
const url = new URL(window.location.href);
const profileId = url.pathname.split('/').pop();

const form = document.getElementById('linkForm');
const imageUpload = document.getElementById('logo');
const imageLoader = document.getElementById('imageLoader');
const imagePreview = document.getElementById('imagePreview');
const imageCancel = document.getElementById('imageCancel');
let originalBlob = null;
let transformedBlob = null;
 
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
    originalBlob = null;
    transformedBlob = null;
});

//SUBMIT TO SERVER
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const baseName = imageUpload.files[0].name.replace(/\.[^/.]+$/, ''); // remove file extension
    const originalFile = new File([originalBlob], `${baseName}.webp`, { type: 'image/webp' });
    const transformedFile = new File([transformedBlob], `green-${baseName}.webp`, { type: 'image/webp' });

    formData.delete('logo');
    formData.append('original', originalFile);
    formData.append('transformed', transformedFile);
    formData.append('profileId', profileId);
    
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