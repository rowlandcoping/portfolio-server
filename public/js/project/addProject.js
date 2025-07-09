import showMessage from "../utils/showMessage.js";
import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";
import { processImageHelper } from "../utils/imageProcessor.js";

const form = document.getElementById('projectForm');
const select = document.getElementById('type');
const imageUpload = document.getElementById('image');
const imageLoader = document.getElementById('imageLoader');
const imagePreview = document.getElementById('imagePreview');
const imageCancel = document.getElementById('imageCancel');
const userToggle = document.getElementById('userToggle');
const userSelect = document.getElementById('userSelect');
const userSelector = document.getElementById('userId');
let originalBlob = null;
let transformedBlob = null;

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

// Manage Feature List
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

//Submit Form
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
    console.log(formData)

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
