const BASE_URL = "https://68f4cc12b16eb6f4683582bb.mockapi.io/api/v1/forms";

const formsList = document.getElementById("formsList");

// Load all forms and render dashboard
async function loadForms() {
    try {
        const res = await fetch(BASE_URL);
        const forms = await res.json();

        formsList.innerHTML = "";

        forms.forEach(f => {
            const div = document.createElement("div");
            div.className = "form-card";
            div.innerHTML = `
                <strong>${f.title}</strong><br>
                ${f.description || ""}<br>
                <span>Total Responses: ${f.responses ? f.responses.length : 0}</span><br><br>
                <button onclick="editForm('${f.id}')">Edit</button>
                <button onclick="viewForm('${f.id}')">Responses</button>
                <button onclick="shareForm('${f.id}')">Share</button>
                <button class="delete-btn" onclick="deleteForm(${f.id})">Delete</button>

            `;
            formsList.appendChild(div);
        });
    } catch (e) {
        console.error("Dashboard fetch error:", e);
        showPopup("Error loading forms.");
    }
}

// Edit form
function editForm(id) {
    window.location.href = `form.html?id=${id}`;
}

// View responses
function viewForm(id) {
    window.location.href = `responses.html?id=${id}`;
}

// Share form
function shareForm(id) {
    const link = `${window.location.origin}/fill-form.html?id=${id}`;
    // const link = `${window.location.origin}/online-forms/fill-form.html?id=${id}`;

    navigator.clipboard.writeText(link)
        .then(() => showPopup("Shareable link copied to clipboard!", 1500))
        .catch(() => showPopup("Failed to copy link."));
}

// Delete form
async function deleteForm(id) {
    const confirmDelete = await confirmPopup("Are you sure you want to delete this form?");
    if (!confirmDelete) return;

    try {
        await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
        showPopup("Form deleted successfully!", 2000);
        setTimeout(loadForms, 1000);
    } catch (err) {
        console.error(err);
        showPopup("Error deleting form!", 2000);
    }
}


// Make functions global
window.editForm = editForm;
window.viewForm = viewForm;
window.shareForm = shareForm;
window.deleteForm = deleteForm;

window.onload = loadForms;
