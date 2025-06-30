const iconClasses = Array.from(document.getElementsByClassName('admin-icon'));
const sectionClasses = Array.from(document.getElementsByClassName('admin-section-options'));

iconClasses.forEach(item => {
    item.addEventListener('click', function handleClick(event) {
        const id = item.getAttribute('id');  
        const section = id.split('-')[0];
        showSections(section);
    });
    item.addEventListener('mouseover', function handleClick(event) {
        const id = item.getAttribute('id');
        document.getElementById(id).style.color = "white";
        document.getElementById(id).style.textDecoration = "underline";
    });
    item.addEventListener('mouseout', function handleClick(event) {
        const id = item.getAttribute('id');
        document.getElementById(id).style.color = "rgb(89, 255, 47)";
        document.getElementById(id).style.textDecoration = "none";
    });
});

const showSections = (section) => {
    const sectionId = `${section}Section`;
    const iconId = `${section}-options`;
    if (document.getElementById(sectionId).style.display === "block") {
        document.getElementById(sectionId).style.display = "none";
        document.getElementById(iconId).innerHTML = "&rrarr;";
        return;
    };
    sectionClasses.forEach(item => {
        item.style.display = "none";
    });
    iconClasses.forEach(item => {
        item.innerHTML = "&rrarr;";
    });

    document.getElementById(sectionId).style.display = "block";
    document.getElementById(iconId).innerHTML = "&ddarr;";
    
}