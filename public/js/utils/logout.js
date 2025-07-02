export async function logoutUser() {
    const res = await fetch('/auth/logout', {
        method: 'POST',
        credentials: 'include',
    });
    if (res.ok) window.location.href = '/';
}