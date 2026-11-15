/* Edit this one value to change the default destination. */
const CONFIG = {
  DEFAULT_EMBED_URL: "https://now.gg/",
  LOAD_HINT_MS: 14000
};

(() => {
  "use strict";

  const byId = (id) => document.getElementById(id);
  const frame = byId("gameFrame");
  const status = byId("status");
  const openButton = byId("openButton");
  const noticeOpenButton = byId("noticeOpenButton");
  const helpNotice = byId("helpNotice");
  const settingsPanel = byId("settingsPanel");
  const settingsButton = byId("settingsButton");
  const urlInput = byId("urlInput");
  const urlForm = byId("urlForm");

  if (!frame || !status || !openButton || !urlForm) return;

  let activeUrl = CONFIG.DEFAULT_EMBED_URL;
  let hintTimer = null;

  function safeHttpUrl(raw) {
    const parsed = new URL(raw, document.URL);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      throw new Error("Only http:// and https:// URLs are supported.");
    }
    return parsed.href;
  }

  function showNotice(message) {
    if (message) {
      const span = helpNotice.querySelector(".notice-copy span");
      if (span) span.textContent = message;
    }
    helpNotice.hidden = false;
  }

  function applyUrl(raw) {
    let nextUrl;
    try {
      nextUrl = safeHttpUrl(raw.trim());
    } catch (error) {
      status.textContent = error.message || "Invalid URL";
      showNotice("Enter a valid http:// or https:// address in the URL panel.");
      return;
    }

    activeUrl = nextUrl;
    urlInput.value = activeUrl;
    openButton.href = activeUrl;
    noticeOpenButton.href = activeUrl;
    helpNotice.hidden = true;
    status.textContent = "Loading destination…";

    if (hintTimer) clearTimeout(hintTimer);
    frame.src = "about:blank";
    window.setTimeout(() => {
      frame.src = activeUrl;
    }, 30);

    hintTimer = window.setTimeout(() => {
      status.textContent = "Check the frame if it is still blank";
      showNotice("Still blank after loading? The destination may block framing, require a supported embed integration, or be affected by browser privacy settings.");
    }, CONFIG.LOAD_HINT_MS);
  }

  frame.addEventListener("load", () => {
    if (frame.src && frame.src !== "about:blank") {
      status.textContent = "Frame navigation occurred";
    }
    /* A cross-origin load event does not prove that the page is visible or playable. */
  });

  byId("reloadButton").addEventListener("click", () => applyUrl(activeUrl));

  byId("fullscreenButton").addEventListener("click", async () => {
    const target = byId("app");
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (target.requestFullscreen) {
        await target.requestFullscreen();
      } else {
        status.textContent = "Fullscreen is unavailable in this browser";
      }
    } catch (_) {
      status.textContent = "Fullscreen request was not allowed";
    }
  });

  settingsButton.addEventListener("click", () => {
    const willOpen = settingsPanel.hidden;
    settingsPanel.hidden = !willOpen;
    settingsButton.setAttribute("aria-expanded", String(willOpen));
    if (willOpen) urlInput.focus();
  });

  urlForm.addEventListener("submit", (event) => {
    event.preventDefault();
    applyUrl(urlInput.value);
  });

  byId("dismissNotice").addEventListener("click", () => {
    helpNotice.hidden = true;
  });

  const params = new URLSearchParams(window.location.search);
  const queryUrl = params.get("url");
  const initialUrl = queryUrl || CONFIG.DEFAULT_EMBED_URL;
  applyUrl(initialUrl);
})();
