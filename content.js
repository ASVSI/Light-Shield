(function () {

  if (window.top !== window.self) return;

  const OVERLAY_ID = "soft-dim-overlay";

  function createOverlay(opacity, color) {
    removeOverlay();

    const overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;

    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = color;
    overlay.style.opacity = opacity;
    overlay.style.pointerEvents = "none";
    overlay.style.zIndex = "2147483647";
    overlay.style.transition = "opacity 0.2s ease";

    document.documentElement.appendChild(overlay);
  }

  function removeOverlay() {
    const existing = document.getElementById(OVERLAY_ID);
    if (existing) existing.remove();
  }

  function applySettings(settings) {
    if (!settings.enabled) {
      removeOverlay();
      return;
    }

    createOverlay(settings.opacity || 0.3, settings.color || "black");
  }

  // Load saved settings on page load
  chrome.storage.sync.get(
    {
      enabled: false,
      opacity: 0.3,
      color: "black"
    },
    applySettings
  );

  // Listen for popup updates
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "update") {
      applySettings(message.settings);
    }
  });

})();
