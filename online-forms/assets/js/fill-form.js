const BASE_URL = "https://68f4cc12b16eb6f4683582bb.mockapi.io/api/v1/forms";

const urlParams = new URLSearchParams(window.location.search);
const formId = urlParams.get("id");
const formContainer = document.getElementById("formContainer");

let currentFormForSubmit = null;

async function loadForm() {
    if (!formId) {
        showPopup("Invalid form link!");
        return;
    }

    try {
        const res = await fetch(`${BASE_URL}/${formId}`);
        const form = await res.json();
        currentFormForSubmit = form;

        renderForm(form);
    } catch (e) {
        showPopup("Error loading form.");
        console.error(e);
    }
}

function renderForm(form) {
    formContainer.innerHTML = `<h2>${form.title}</h2>${form.description ? `<p>${form.description}</p>` : ""}`;

    form.fields.forEach((f, index) => {
        let fieldHTML = "";
        switch(f.type) {
            case "short_text":
                fieldHTML = `<input type="text" id="field_${index}" placeholder="${f.placeholder || ''}" ${f.required ? "data-required='true'" : ""}>`; break;
            case "paragraph":
                fieldHTML = `<textarea id="field_${index}" placeholder="${f.placeholder || ''}" ${f.required ? "data-required='true'" : ""}></textarea>`; break;
            case "number":
                fieldHTML = `<input type="number" id="field_${index}" ${f.required ? "data-required='true'" : ""}>`; break;
            case "date":
                fieldHTML = `<input type="date" id="field_${index}" ${f.required ? "data-required='true'" : ""}>`; break;
            case "multiple_choice":
                fieldHTML = f.options.map(o => `<label><input type="radio" name="field_${index}" value="${o}" ${f.required ? "data-required='true'" : ""}> ${o}</label>`).join("<br>"); break;
            case "checkbox":
                fieldHTML = f.options.map(o => `<label><input type="checkbox" name="field_${index}" value="${o}" ${f.required ? "data-required='true'" : ""}> ${o}</label>`).join("<br>"); break;
            case "dropdown":
                fieldHTML = `<select id="field_${index}" ${f.required ? "data-required='true'" : ""}>${f.options.map(o => `<option value="${o}">${o}</option>`).join("")}</select>`; break;
        }

        formContainer.innerHTML += `<div class="preview-field"><strong>${f.label}</strong><br>${fieldHTML}</div>`;
    });

    formContainer.innerHTML += `<button onclick="submitResponse()">Submit</button>`;
}

async function submitResponse() {
    if (!currentFormForSubmit) return;

    let hasError = false;
    const answers = {};

    for (let i = 0; i < currentFormForSubmit.fields.length; i++) {
        const f = currentFormForSubmit.fields[i];
        let value = "";

        switch(f.type) {
            case "short_text":
            case "paragraph":
            case "number":
            case "date":
            case "dropdown":
                const inputEl = document.getElementById(`field_${i}`);
                value = inputEl.value;
                if (f.required && !value) {
                    inputEl.classList.add("input-error");
                    hasError = true;
                } else {
                    inputEl.classList.remove("input-error");
                }
                break;
            case "multiple_choice":
                const radios = document.getElementsByName(`field_${i}`);
                value = "";
                for (const r of radios) if (r.checked) value = r.value;
                if (f.required && !value) {
                    radios.forEach(r => r.closest("label").classList.add("input-error"));
                    hasError = true;
                } else {
                    radios.forEach(r => r.closest("label").classList.remove("input-error"));
                }
                break;
            case "checkbox":
                const checks = document.getElementsByName(`field_${i}`);
                value = [];
                for (const c of checks) if (c.checked) value.push(c.value);
                if (f.required && value.length === 0) {
                    checks.forEach(c => c.closest("label").classList.add("input-error"));
                    hasError = true;
                } else {
                    checks.forEach(c => c.closest("label").classList.remove("input-error"));
                }
                break;
        }

        answers[f.label] = value;
    }

    if (hasError) {
        showPopup("Please fill all required fields.");
        return;
    }

    if (!currentFormForSubmit.responses) currentFormForSubmit.responses = [];
    currentFormForSubmit.responses.push({ ...answers, submittedAt: new Date().toISOString() });

    try {
        await fetch(`${BASE_URL}/${formId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(currentFormForSubmit)
        });

        window.location.href = "thankyou.html";
    } catch (e) {
        showPopup("Error submitting form.");
        console.error(e);
    }
}

window.onload = loadForm;
