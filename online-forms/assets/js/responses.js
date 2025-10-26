const urlParams = new URLSearchParams(window.location.search);
const formId = urlParams.get("id");
const responseContainer = document.getElementById("responseContainer");
const exportBtn = document.getElementById("exportCsvBtn");

async function loadResponses() {
    if (!formId) return showPopup("Invalid form ID!");

    try {
        const res = await fetch(`${BASE_URL}/${formId}`);
        console.log("Fetch response:", res);
        const form = await res.json();
        console.log("Form data:", form);

        if (!form.responses || form.responses.length === 0) {
            responseContainer.innerHTML = "<p>No responses yet.</p>";
            return;
        }

        // Table headers
        const headers = [...form.fields.map(f => f.label), "Submitted At"];
        let html = "<table><tr>" + headers.map(h => `<th>${h}</th>`).join("") + "</tr>";

        // Table rows
        form.responses.forEach(r => {
            let row = "<tr>";
            form.fields.forEach(f => {
                row += `<td>${r[f.label] || ""}</td>`; // use label to access value
            });
            row += `<td>${r.submittedAt}</td>`;
            row += "</tr>";
            html += row;
        });

        html += "</table>";
        responseContainer.innerHTML = html;

        // Enable CSV export
        exportBtn.style.display = "inline-block";
        exportBtn.onclick = () => exportToCSV(form);

    } catch (e) {
        console.error("Error fetching responses:", e);
        showPopup("Error loading responses.");
    }
}

function exportToCSV(form) {
    const headers = [...form.fields.map(f => f.label), "Submitted At"];
    const rows = form.responses.map(r =>
        [...form.fields.map(f => r[f.label] || ""), r.submittedAt]
    );

    let csvContent = headers.join(",") + "\n";
    rows.forEach(row => {
        csvContent += row.map(v => `"${v}"`).join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${form.title.replace(/\s+/g, "_")}_responses.csv`);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Load responses when page loads
window.onload = loadResponses;
