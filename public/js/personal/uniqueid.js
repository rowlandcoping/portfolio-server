import { fetchWithRedirect } from "../utils/fetchWithRedirect.js";

try {
    const user = await fetchWithRedirect({
        url: '/users/current'
    });
    if (user) {
        document.getElementById('userid').textContent = user.publicId;
    }
} catch (err) {
}