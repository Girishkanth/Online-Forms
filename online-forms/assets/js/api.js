const BASE_URL = "https://68f4cc12b16eb6f4683582bb.mockapi.io/api/v1/forms";

async function getForms() {
    const res = await fetch(BASE_URL);
    return await res.json();
}

async function getFormById(id) {
    const res = await fetch(`${BASE_URL}/${id}`);
    return await res.json();
}

async function createForm(formData) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    });
    return await res.json();
}

async function updateForm(id, formData) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    });
    return await res.json();
}
