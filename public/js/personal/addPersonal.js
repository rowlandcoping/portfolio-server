import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";
import { processImageHelper } from "../utils/imageProcessor.js";


const form = document.getElementById('personalForm');
const imageUpload = document.getElementById('image');
const imageLoader = document.getElementById('imageLoader');
const imagePreview = document.getElementById('imagePreview');
const imageCancel = document.getElementById('imageCancel');
let originalBlob = null; 
let transformedBlob = null;
window.onload=imageUpload.value = "";

//check for a profile
try {
    const result = await fetchWithRedirect({
        url: '/personal/profile',
        method: 'GET'
    });
    if (result) {
        sessionStorage.setItem('flash', 'You already have a profile');
        window.location.href = '/dashboard';
    }
} catch(err) { 
    showMessage('error', err.message || 'Fail');
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


form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    if (imageUpload.files.length > 0) {
        const baseName = imageUpload.files[0].name.replace(/\.[^/.]+$/, ''); // remove file extension
        const originalFile = new File([originalBlob], `${baseName}.webp`, { type: 'image/webp' });
        const transformedFile = new File([transformedBlob], `green-${baseName}.webp`, { type: 'image/webp' });
        
        // Remove the plain image field and append the files
        formData.delete('image');
        formData.append('original', originalFile);
        formData.append('transformed', transformedFile);
    }
    
    try {
        await fetchWithRedirect({
            url: '/personal',
            method: 'POST',
            data: formData,
            redirect: '/dashboard'
        });
    } catch (err) {
        showMessage('error', err.message || 'Adding Profile Failed');
    }
});
