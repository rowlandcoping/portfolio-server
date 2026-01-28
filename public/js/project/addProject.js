import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";
import { processImageHelper } from "../utils/imageProcessor.js";
import characterCounter from "../utils/characterCounter.js"; 

const form = document.getElementById('projectForm');
const select = document.getElementById('type');
const userToggle = document.getElementById('userToggle');
const userSelect = document.getElementById('userSelect');
const userSelector = document.getElementById('userId');
const overInput = document.getElementById('overview');
const characterCount = document.getElementById('character-count');
const characterCountFeature = document.getElementById('character-count-feature');
const characterCountIssue = document.getElementById('character-count-issue');

const imageUpload = document.getElementById('image');
const imageLoader = document.getElementById('imageLoader');
const imageGreenPreview = document.getElementById('imageGreenPreview');
const imageGrayscalePreview = document.getElementById('imageGrayscalePreview');
const imageCancel = document.getElementById('imageCancel');
let originalBlob = null;
let transformedGreenBlob = null;
let transformedGrayscaleBlob = null;

window.onload=imageUpload.value = "";
window.onload=userToggle.checked = false;
window.onload=userSelect.value = "";

//Populate drop-down
try {
    const result = await fetchWithRedirect({
        url: '/projects/types'
    });
    select.querySelectorAll('option:not(:first-child)').forEach(opt => opt.remove());
    result.forEach(type => {
        const option = document.createElement('option');
        option.value = type.id;
        option.textContent = type.name;
        select.appendChild(option);
    });
} catch(err) {
    showMessage('error', err.message, false);
}

//show or hide user assign
userToggle.addEventListener('change', async (e) => {
    if (e.target.checked) {
        userSelect.style.display = 'flex';
        try {
            const result = await fetchWithRedirect({
                url: '/users'
            });
            userSelector.querySelectorAll(('option:not(:first-child)')).forEach(opt => opt.remove());
            result.forEach(type => {
                const option = document.createElement('option');
                option.value = type.id;
                option.textContent = type.name;
                userSelector.appendChild(option);
            });
        } catch(err) {
            showMessage('error', err.message, false);
        }
    } else {
        userSelect.style.display = 'none';
        userSelect.value = "";
    }
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

//Manage Lists for issues and features

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

//character counters
const overviewCounter = characterCounter(overInput, characterCount, 400);
const featureCounter = characterCounter(featureInput, characterCountFeature, 35);
const issueCounter = characterCounter(issueInput, characterCountIssue, 35);

// Manage Feature List
document.querySelectorAll('.add-button').forEach(button => {
    button.addEventListener('click', () => {
        const listType = button.id.replace(/^add/i, '').toLowerCase();  
        if (listType === "feature") {
            featureCounter.validate();
        } else {
            issueCounter.validate(); 
        }
        //display error if fields not valid
        if (!form.reportValidity()) {
            return; // Stops here and shows browser errors
        }       
        const hiddenInput = document.getElementById(`${listType}s`);
        const input =  document.getElementById(`${listType}Input`);
        const value = input.value.trim();
        const list = document.getElementById(`${listType}List`);
                
        if (list.children.length >= 3) {
            // Show error or prevent adding        
            showMessage('error', 'Maximum of 3 items allowed');
            document.getElementById('showMessage').focus();
            return;
        }

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

//Submit Form
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

        formData.append('original', originalFile);
        formData.append('transformedGreen', transformedGreenFile);
        formData.append('transformedGrayscale', transformedGrayscaleFile);
    }

    try {
        await fetchWithRedirect({
            url: '/projects',
            method: 'POST',
            data: formData,
            redirect: '/dashboard'
        });
    } catch (err) {
        showMessage('error', err.message || 'Adding Profile Failed');
    }
});
