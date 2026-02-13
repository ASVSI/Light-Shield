const toggle = document.getElementById("toggle");
const opacityInput = document.getElementById("opacity");
const colorSelect = document.getElementById("color");
const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");
const opacityValue = document.getElementById("opacityValue");

/* -----------------------------
   Load saved settings instantly
------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(
    {
      enabled: false,
      opacity: 0.3,
      color: "black"
    },
    (data) => {
      toggle.checked = data.enabled;
      opacityInput.value = data.opacity;
      colorSelect.value = data.color;
      updateOpacityLabel(data.opacity);

      // Apply immediately when popup opens
      sendUpdate(data);
    }
  );
});

/* -----------------------------
   UI Helpers
------------------------------ */
function updateOpacityLabel(value) {
  const percent = Math.round(value * 100);
  opacityValue.textContent = percent + "%";
}

/* -----------------------------
   Send message to active tab
------------------------------ */
async function sendUpdate(settings) {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    if (!tab?.id) return;

    await chrome.tabs.sendMessage(tab.id, {
      action: "update",
      settings: settings
    });
  } catch (err) {
    // Happens on Chrome internal pages like chrome://
    console.warn("Content script not available on this page.");
  }
}

/* -----------------------------
   Save + Update
------------------------------ */
function saveAndUpdate() {
  const settings = {
    enabled: toggle.checked,
    opacity: parseFloat(opacityInput.value),
    color: colorSelect.value
  };

  chrome.storage.sync.set(settings);
  updateOpacityLabel(settings.opacity);
  sendUpdate(settings);
}

/* -----------------------------
   Event Listeners
------------------------------ */
toggle.addEventListener("change", saveAndUpdate);
opacityInput.addEventListener("input", saveAndUpdate);
colorSelect.addEventListener("change", saveAndUpdate);

settingsBtn.addEventListener("click", () => {
  settingsPanel.style.display =
    settingsPanel.style.display === "block" ? "none" : "block";
});
