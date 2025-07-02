function createListLink({
    url,
    innerHTML,
    listItem
}) {
    const h4 = document.createElement('h4');
    const a = document.createElement('a');
    a.href = `${url}${listItem.id}`;
    a.innerHTML = `${innerHTML}${listItem.name}`;
    h4.appendChild(a);
    return h4;
}

export default createListLink