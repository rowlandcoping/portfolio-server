function showMessage(type, message, timeout=true) {
    const showMessage = document.getElementById('showMessage');
    showMessage.textContent = message;
    showMessage.style.display = 'block';
    showMessage.className = type;
    if (timeout) {
        setTimeout(() => {
            showMessage.style.display = 'none';
        }, 6000);
    }
}

export default showMessage