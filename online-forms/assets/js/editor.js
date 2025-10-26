const formIdParam = getQueryParam("id");
let currentForm = { title: "", description: "", fields: [], responses: [] };

async function loadFormForEdit() {
    if (!formIdParam) return;
    const form = await getFormById(formIdParam);
    currentForm = form;

    document.getElementById("formTitle").value = form.title;
    document.getElementById("formDescription").value = form.description;

    renderFields();

}

window.onload = loadFormForEdit;

function addField(type) {
    const field = {
        id: generateId(),
        type: type,
        label: "",
        placeholder: "",
        required: false,
        options: (type === "multiple_choice" || type === "checkbox" || type === "dropdown") ? ["Option 1"] : []
    };

    currentForm.fields.push(field);
    renderFields();
}

function renderFields() {
    const container = document.getElementById("fieldsContainer");
    container.innerHTML = "";

    currentForm.fields.forEach((f, index) => {
        let optionsHTML = "";

        if (f.type === "multiple_choice" || f.type === "checkbox" || f.type === "dropdown") {
            optionsHTML = f.options.map((opt, i) =>
                `<input type="text" value="${opt}" onchange="updateOption(${index}, ${i}, this.value)">`).join("<br>");
            optionsHTML += `<button onclick="addOption(${index})">Add Option</button>`;
        }

        container.innerHTML += `
            <div class="field-container">
                <input type="text" placeholder="Label" value="${f.label}" onchange="updateLabel(${index}, this.value)" class="field-label" required>
                ${optionsHTML}
                <label><input type="checkbox" ${f.required ? "checked" : ""} onchange="toggleRequired(${index}, this.checked)"> Required</label>
                <button class="delete-btn" onclick="deleteField(${index})">Delete Field</button>
            </div>
        `;
    });

    renderPreview();
}

function updateLabel(fieldIndex, value) {
    currentForm.fields[fieldIndex].label = value;
    renderPreview();
}

function updateOption(fieldIndex, optionIndex, value) {
    currentForm.fields[fieldIndex].options[optionIndex] = value;
    renderPreview();
}

function addOption(fieldIndex) {
    currentForm.fields[fieldIndex].options.push("New Option");
    renderFields();
}

function toggleRequired(fieldIndex, checked) {
    currentForm.fields[fieldIndex].required = checked;
}

function deleteField(index) {
    currentForm.fields.splice(index, 1);
    renderFields();
}

function renderPreview() {
    const preview = document.getElementById("previewContainer");
    preview.innerHTML = "";

    currentForm.fields.forEach(f => {
        let fieldHTML = "";
        switch(f.type) {
            case "short_text": fieldHTML = `<input type="text" disabled>`; break;
            case "paragraph": fieldHTML = `<textarea disabled></textarea>`; break;
            case "number": fieldHTML = `<input type="number" disabled>`; break;
            case "date": fieldHTML = `<input type="date" disabled>`; break;
            case "multiple_choice":
                fieldHTML = f.options.map(o => `<label><input type="radio" disabled> ${o}</label>`).join("<br>");
                break;
            case "checkbox":
                fieldHTML = f.options.map(o => `<label><input type="checkbox" disabled> ${o}</label>`).join("<br>");
                break;
            case "dropdown":
                fieldHTML = `<select disabled>${f.options.map(o => `<option>${o}</option>`)}</select>`;
                break;
        }
        preview.innerHTML += `<div class="preview-field"><strong>${f.label}</strong><br>${fieldHTML}</div>`;
    });
}

async function saveForm() {
    currentForm.title = document.getElementById("formTitle").value;
    currentForm.description = document.getElementById("formDescription").value;

    // validate title and description
    let titleInput = document.getElementById("formTitle");
    let descInput = document.getElementById("formDescription");
    let hasError = false;

    [titleInput, descInput].forEach(input => {
        if (!input.value.trim()) {
            input.classList.add("input-error");
            hasError = true;
        } else {
            input.classList.remove("input-error");
        }
    });

    // validate all field labels
    currentForm.fields.forEach((f, i) => {
        if (!f.label.trim()) {
            hasError = true;
            document.querySelectorAll(".field-label")[i].classList.add("input-error");
        } else {
            document.querySelectorAll(".field-label")[i].classList.remove("input-error");
        }
    });

    if (hasError) {
        showPopup("Please fill all required fields!", 2000);
        return;
    }

    try {
        if (formIdParam) {
            await updateForm(formIdParam, currentForm);
            showPopup("Form updated successfully!", 1500);
        } else {
            await createForm(currentForm);
            showPopup("Form created successfully!", 1500);
        }

        setTimeout(() => window.location.href = "index.html?reload=1", 1600);
    } catch(e) {
        showPopup("Error saving form!");
        console.error(e);
    }
}
