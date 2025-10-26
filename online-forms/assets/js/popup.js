// popup.js

// Simple message popup (for success, info, etc.)
function showPopup(message, duration = 2000) {
    const existing = document.getElementById("customPopup");
    if (existing) existing.remove();

    const popup = document.createElement("div");
    popup.id = "customPopup";
    popup.className = "custom-popup";
    popup.innerText = message;

    document.body.appendChild(popup);

    setTimeout(() => popup.remove(), duration);
}

// Custom confirm popup that returns a Promise
function confirmPopup(message) {
    return new Promise((resolve) => {
        const overlay = document.createElement("div");
        overlay.className = "popup-overlay";

        const popup = document.createElement("div");
        popup.className = "custom-confirm-popup";

        const msg = document.createElement("p");
        msg.innerText = message;

        const btnContainer = document.createElement("div");
        btnContainer.className = "popup-buttons";

        const yesBtn = document.createElement("button");
        yesBtn.className = "popup-btn yes";
        yesBtn.innerText = "Yes";

        const noBtn = document.createElement("button");
        noBtn.className = "popup-btn no";
        noBtn.innerText = "No";

        btnContainer.appendChild(yesBtn);
        btnContainer.appendChild(noBtn);
        popup.appendChild(msg);
        popup.appendChild(btnContainer);
        overlay.appendChild(popup);
        document.body.appendChild(overlay);

        yesBtn.addEventListener("click", () => {
            overlay.remove();
            resolve(true);
        });

        noBtn.addEventListener("click", () => {
            overlay.remove();
            resolve(false);
        });
    });
}
