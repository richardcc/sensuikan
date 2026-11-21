// =========================================================================
// SENSUiKAN: GLOBAL STATE, LOCALSTORAGE, I18N & BACKUP SUBSYSTEM
// =========================================================================
let currentLang = (typeof detectInitialLanguage === 'function') ? detectInitialLanguage() : 'es';
window.currentLang = currentLang;

let campaignState = {
  currentRankIdx: 2,
  activeSubKey: null,
  tokens: { "token-medal-gea": true, "token-medal-sub": true },
  patrols: {},
  workflow: {
    currentPhase: 0,
    selectedMonth: "1941-12",
    currentBoxIndex: -1,
    boxList: ["Tránsito 1", "Casilla de Misión", "En Estación 1", "En Estación 2", "En Estación 3", "Retorno 1"],
    encounterStatus: "none",
    currentTarget: null,
    startingBase: "Yokosuka",
    assignedArea: "Pearl Harbor",
    lastA1Roll: 0,
    lastA3Roll: 0,
    currentEncounter: "",
    lastCombatHits: 0,
    lastCombatDamage: 0,
    lastCombatIsSunk: false,
    lastCombatStatus: "miss"
  },
  school: {
    capTorpEarned: false,
    xoDeckGunEarned: false,
    engKeenEarned: false,
    spareTime: "martial",
    f2TorpEarned: false,
    f2CommsEarned: false,
    f2NetEarned: false,
    f3Skills: [],
    pilotSkills: { 0: [], 1: [], 2: [] }
  },
  crewInjuries: {
    captain: false,
    xo: false,
    engineer: false,
    navigator: false
  }
};
window.campaignState = campaignState;

function saveState() {
  try {
    localStorage.setItem('sensuikan_campaign_state', JSON.stringify(campaignState));
  } catch(e) {
    console.error("Error saving state", e);
  }
}

function loadSavedState() {
  const saved = localStorage.getItem('sensuikan_campaign_state');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      campaignState = Object.assign(campaignState, parsed);
      window.campaignState = campaignState;
    } catch(e) {
      console.error("Error loading state", e);
    }
  }
}

function toggleLanguage() {
      currentLang = (typeof getNextLanguage === 'function')
        ? getNextLanguage(currentLang)
        : ((currentLang === 'es') ? 'en' : 'es');
      window.currentLang = currentLang;
      localStorage.setItem('sensuikan_user_lang', currentLang);
      applyLanguage(currentLang);
      if (typeof showToast === 'function') {
        showToast(typeof t === 'function' ? t('toastLangSwitched') : (currentLang === 'es' ? "Idioma cambiado a Español" : "Language switched to English"));
      }
    }

window.toggleLanguage = toggleLanguage;

function bindLanguageToggle() {
  const button = document.getElementById('lang-toggle-btn');
  if (!button || button.dataset.bound === 'true') return;
  button.dataset.bound = 'true';
  button.addEventListener('click', toggleLanguage);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bindLanguageToggle, { once: true });
} else {
  bindLanguageToggle();
}

if (typeof window !== 'undefined') {
  window.campaignState = campaignState;
  window.saveState = saveState;
  window.loadSavedState = loadSavedState;
  window.toggleLanguage = toggleLanguage;
  if (typeof setLanguage === 'function') window.setLanguage = setLanguage;
}
