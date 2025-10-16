import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";
import { processImageHelper } from "../utils/imageProcessor.js";


const form = document.getElementById('personalForm');
const imageUpload = document.getElementById('image');
const imageLoader = document.getElementById('imageLoader');
const imageGreenPreview = document.getElementById('imageGreenPreview');
const imageGrayscalePreview = document.getElementById('imageGrayscalePreview');
const imageCancel = document.getElementById('imageCancel');
let originalBlob = null;
let transformedGreenBlob = null;
let transformedGrayscaleBlob = null;
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

//ATTRIBUTES LIST


//add outline to feature or issue input if selected:
document.querySelectorAll('.nested-input').forEach(element => {
    element.addEventListener('focus', function () {
        this.closest('.input-wrapper').style.outline = 'rgb(89, 255, 47) 1px solid';
    });
    element.addEventListener('blur', function () {
        this.closest('.input-wrapper').style.outline = 'none';
    });
});

//Manage Lists for attributes

//Add placeholders
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

function checkPlaceholder(list) {
    if (list.children.length === 0) {
        const noItems = document.createElement('div');
        noItems.className = 'placeholder';
        noItems.textContent = 'No items found';
        list.appendChild(noItems);
    }
}

// Manage Lists
document.querySelectorAll('.add-button').forEach(button => {
    button.addEventListener('click', () => {
        const listType = button.id.replace(/^add/i, '').toLowerCase();        
        const hiddenInput = document.getElementById(`${listType}s`);
        const input =  document.getElementById(`${listType}Input`);
        const value = input.value.trim();
        const list = document.getElementById(`${listType}List`);

        console.log(list);

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
