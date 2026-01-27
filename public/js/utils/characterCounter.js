export default function characterCounter(textarea, counterElement, maxLength) {
    function updateCount() {
        const current = textarea.value.length;
        counterElement.textContent = `${current}/${maxLength} characters`;
    }
    
    function validate() {
        if (textarea.value.length > maxLength) {
            textarea.setCustomValidity(`Must be ${maxLength} characters or less`);
        } else {
            textarea.setCustomValidity('');
        }
    }
    
    // Initial count
    updateCount();
    
    // Update on input
    textarea.addEventListener('input', updateCount);
    
    return { validate }; // Return validate function for use in submit handler
}