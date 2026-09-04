function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie =
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${d.toUTCString()}; path=/; SameSite=Lax`;
}

function getCookie(name) {
  const key = encodeURIComponent(name) + "=";
  const parts = document.cookie.split("; ");
  for (const p of parts) if (p.startsWith(key)) return decodeURIComponent(p.slice(key.length));
  return null;
}

function deleteCookie(name) {
  // expires in the past
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

// Example objective state: { obj1:true, obj2:false }
function loadObjectives() {
  const raw = getCookie("objectives");
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

function saveObjectives(objState) {
  setCookie("objectives", JSON.stringify(objState), 30);
}

// -------------------------------
// Persistent objective system
// Cookie key used: "objectives_v2"
// Stores: { list: [...], current: 0 }
// -------------------------------

function loadObjectiveStore() {
  const raw = getCookie("objectives_v2");
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function saveObjectiveStore(store) {
  setCookie("objectives_v2", JSON.stringify(store), 30);
}

// Call this on every page that has a HUD
// - If cookie doesn't exist, it seeds it with your list.
// - If cookie exists, it keeps progress (current index).
function initObjectives(hudEl, list, opts = {}) {
  const {
    cookieKey = "objectives_v2",
    reset = false,
    startIndex = 0
  } = opts;

  // allow overriding key if you ever want multiple campaigns
  const prevGet = () => {
    const raw = getCookie(cookieKey);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  };
  const prevSet = (store) => setCookie(cookieKey, JSON.stringify(store), 30);

  let store = reset ? null : prevGet();

  if (!store || !Array.isArray(store.list)) {
    store = { list: [...list], current: startIndex };
    prevSet(store);
  } else {
    // If you want to keep progress but update wording safely:
    // keep current index, replace list with new one
    store.list = [...list];
    if (typeof store.current !== "number") store.current = startIndex;
    prevSet(store);
  }

  // expose globally so other code (teleport) can save safely
  window.objectiveStore = store;
  window.saveObjectiveStore = () => prevSet(window.objectiveStore);

  // Push to HUD (HUD should decide what to display based on current)
  hudEl.emit("hud-set-objectives", {
    list: store.list,
    current: store.current
  });

    if (!hudEl.__objectiveListenerAdded) {
    hudEl.__objectiveListenerAdded = true;

    hudEl.addEventListener("hud-complete-objective", () => {
    const s = window.objectiveStore || store;
    s.current = Math.min(s.current + 1, s.list.length - 1);
    window.objectiveStore = s;
    prevSet(s);

    });
  }
  return store;
}