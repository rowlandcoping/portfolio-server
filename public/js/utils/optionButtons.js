const categoryClicked = (id, optionsInput) => {
    const btnClicked = document.getElementById(id);
    // removes empty string, converts to a number array
    const currentOptions = optionsInput.value.split(',').filter(Boolean).map(Number); 
    if (btnClicked.className === 'deselected') {
        btnClicked.className = 'selected';
        currentOptions.push(id);
    } else {        
        //this line locates the position of id in the currentRoles array (ie its array index)
        //it returns the index if found, or -1 if not
        const index = currentOptions.indexOf(id);
        //if it exists (ie greater than -1) then remove it
        if (index > -1) {
            //the 1 means remove one item, starting at the provided index(ie that item)
            currentOptions.splice(index, 1);
        }
        btnClicked.className = 'deselected';
    }
    optionsInput.value = currentOptions.join(',');
    return(optionsInput);
}

const optionFragment = ({
    result = [],
    optionsArray = [],
    optionsInput = ""
} = {}) => {
    const fragment = document.createDocumentFragment();
    //for... of loop is marginally quicker and supprts break/continue
    if (result.length) {
        for (const option of result) {        
                const button = document.createElement('button');
                button.type = 'button';
                button.textContent = option.name;
                button.id = option.id;
                button.className = optionsArray.includes(option.id)
                    ? 'selected'
                    : 'deselected';
                button.addEventListener('click', (event) => {
                    categoryClicked(option.id, optionsInput);
                });
                fragment.appendChild(button); 
        }
    } else {
        const p = document.createElement('p');
        p.textContent = 'No options found';
        fragment.appendChild(p);
    }
    return(fragment);   
}

export { optionFragment }