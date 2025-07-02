import showMessage from "./showMessage.js";

export async function fetchWithRedirect({
    url,
    method = 'GET',
    data = null,
    redirect = null
} = {}) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    };

    if (method !== 'GET' && data !== null) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        if (!response.ok) {
            showMessage('error', result.message || 'Unknown error');
            throw new Error(result.message || 'Unknown error');
        }
        if (redirect) {
            sessionStorage.setItem('flash', result.message || 'Operation Successful');
            window.location.href = redirect;
            return;
        }
        return result;  
    } catch (err) {
        showMessage('error', err.message, false);
        throw err;
    }
}