export async function getBranches(token) {
    const res = await fetch("http://127.0.0.1:8000/api/accounts/branches/", {
        headers: { "Authorization": `Bearer ${token}` }
    });
    return res.json();
}
