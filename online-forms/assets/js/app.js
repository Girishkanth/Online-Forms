function generateId() {
    return 'f' + Math.random().toString(36).substr(2, 9);
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function convertResponsesToCSV(fields, responses) {
    const header = fields.map(f => f.label);
    const rows = responses.map(r => fields.map(f => r[f.id] || ''));
    return [header, ...rows].map(row => row.join(",")).join("\n");
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => showPopup("Copied to clipboard!"))
        .catch(() => showPopup("Failed to copy!"));
}

