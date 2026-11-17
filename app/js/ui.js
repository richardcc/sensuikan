// =========================================================================
// SENSUiKAN: USER INTERFACE, MODALS, DRAWERS & SECURITY GATE
// =========================================================================
function switchTab(tabId) {
      if (tabId === 'k1') tabId = 'chart-k1';
      document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
      
      const pane = document.getElementById('tab-' + tabId);
      if (pane) pane.classList.add('active');

      const btn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.getAttribute('onclick') && b.getAttribute('onclick').includes(tabId));
      if (btn) btn.classList.add('active');

      if (tabId === 'chart-k1' || tabId === 'k1') {
        renderTokens();
        if (typeof renderCommanderDossier === 'function') renderCommanderDossier();
      }

      if (tabId === 'rogu-bukku') {
        recalculateTotals();
        if (typeof renderCommanderDossier === 'function') renderCommanderDossier();
      }
      if (tabId === 'workflow') {
        if (typeof renderCommanderDossier === 'function') renderCommanderDossier();
      }
      if (tabId === 'dock') {
        buildSubmarineList();
        const activeKey = (typeof campaignState !== 'undefined' && campaignState.activeSubKey) ? campaignState.activeSubKey : 'Type_B_Class';
        if (typeof selectSubmarine === 'function') {
          selectSubmarine(activeKey);
        } else if (typeof renderSubmarinePatrolTrack === 'function') {
          renderSubmarinePatrolTrack(activeKey);
        }
      }
      if (tabId === 'operations-map') {
        if (typeof initOperationsMapHotspots === 'function') initOperationsMapHotspots();
        if (typeof updateOperationsMap === 'function') updateOperationsMap();
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function openAboutModal() {
      const modal = document.getElementById('modal-about');
      if (modal) modal.style.display = 'flex';
    }

    function closeAboutModal() {
      const modal = document.getElementById('modal-about');
      if (modal) modal.style.display = 'none';
    }
    // WORKFLOW CONTROLS
    function updateTrayectoCompletionStatus() {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
      const list = (campaignState && campaignState.workflow && campaignState.workflow.boxList) ? campaignState.workflow.boxList : [];
      const isDone = (campaignState && campaignState.workflow && campaignState.workflow.patrolBoxesCompleted);
      
      // 1. Resaltar tab de trayectos (step-nav-2)
      const nav2 = document.getElementById('step-nav-2');
      if (nav2) {
        nav2.classList.toggle('trayecto-completed', !!isDone);
      }

      // 2. Botón de navegación tras combate en Fase 3 (apuntar a Trayecto vs Averías)
      const p3NextBtn = document.getElementById('p3-btn-next');
      const p3NextContainer = p3NextBtn ? p3NextBtn.parentElement : null;
      if (p3NextBtn) {
        if (!isDone) {
          p3NextBtn.setAttribute('data-target-phase', '2');
          p3NextBtn.innerText = isEn ? "Return to Phase 2: Navigation ➔" : "Continuar en Fase 2: Trayecto ➔";
          if (p3NextContainer) p3NextContainer.setAttribute('onclick', 'setWorkflowPhase(2)');
        } else {
          p3NextBtn.setAttribute('data-target-phase', '4');
          p3NextBtn.innerText = isEn ? "Proceed to Phase 4: Damage Control ➔" : "Pasar a Fase 4: Control de Averías ➔";
          if (p3NextContainer) p3NextContainer.setAttribute('onclick', 'setWorkflowPhase(4)');
        }
      }
    }

    function setWorkflowPhase(phaseId) {
      campaignState.workflow.currentPhase = phaseId;
      const allPhases = ['0', 'school', '1', '2', 'patrol', '3', '4', '5'];
      allPhases.forEach(pid => {
        const elNav = document.getElementById('step-nav-' + pid);
        const elBody = document.getElementById('phase-content-' + pid);
        if (elNav) elNav.classList.toggle('active', String(pid) === String(phaseId));
        if (elBody) elBody.classList.toggle('active', String(pid) === String(phaseId));
      });
      if (phaseId === 'patrol') {
        const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
        if (typeof applyPatrolLanguage === 'function') applyPatrolLanguage(isEn);
        if (typeof updatePatrolPhaseUI === 'function') updatePatrolPhaseUI();
      }
      if (phaseId === 'school') updateSchoolEquipDisplay();
      if (phaseId === 1 || phaseId === '1') updateBasesForDate();
      if (phaseId === 5 || phaseId === '5') {
        updateAirRaidUI();
        recalculateRefitTime();
      }
      updateTrayectoCompletionStatus();
      saveState();
    }

            // =========================================================================
    // TRAINING SCHOOLS LOGIC (EXACT FAITHFUL CHART F1, F2, F3 REPRODUCTION)
    // =========================================================================
    

function openModalViewer(title, dummySrc, chartKey) {
      const modal = document.getElementById('modal-viewer');
      const modalTitle = document.getElementById('modal-viewer-title');
      const digEl = document.getElementById('modal-viewer-digital');

      if (!modal) return;

      modalTitle.innerHTML = `<span>📖</span> <span>${title}</span>`;

      // Determine key if not passed
      let key = chartKey;
      if (!key) {
        const checkStr = (title + " " + (dummySrc || "")).toLowerCase();
        if (checkStr.includes("f1") || checkStr.includes("kure") || checkStr.includes("submarine school")) {
          key = "F1";
        } else if (checkStr.includes("f2") || checkStr.includes("f3") || checkStr.includes("kasumigaura")) {
          key = "F2_F3";
        } else if (checkStr.includes("b1_b6") || checkStr.includes("b1 a b6") || checkStr.includes("b1-b6") || checkStr.includes("combate b1") || checkStr.includes("tablas b1") || checkStr.includes("tabla b1")) {
          key = "B1_B6";
        } else if (checkStr.includes("b7")) {
          key = "B7";
        } else if (checkStr.includes("m5_m7") || checkStr.includes("m5 a m7") || checkStr.includes("m5-m7") || checkStr.includes("encounters") || checkStr.includes("tabla m5") || checkStr.includes("tabla m7")) {
          key = "M5_M7";
        } else if (checkStr.includes("m8_m9") || checkStr.includes("m8 a m9") || checkStr.includes("m8-m9") || checkStr.includes("midget sub damage")) {
          key = "M8_M9";
        } else if (checkStr.includes("0: ") || checkStr.includes("prepare to play")) {
          key = "FLOW_0";
        } else if (checkStr.includes("1: ") || checkStr.includes("mission start")) {
          key = "FLOW_1";
        } else if (checkStr.includes("2: ") || checkStr.includes("patrol transit")) {
          key = "FLOW_2";
        } else if (checkStr.includes("3: ") || checkStr.includes("encounters")) {
          key = "FLOW_3";
        } else if (checkStr.includes("4: ") || checkStr.includes("patrol return")) {
          key = "FLOW_4";
        } else if (checkStr.includes("5: ") || checkStr.includes("post mission")) {
          key = "FLOW_5";
        }
      }

      if (key && OCR_CHART_TEMPLATES[key]) {
        digEl.innerHTML = `<div id="modal-tab-digital">${OCR_CHART_TEMPLATES[key]}</div>`;
      } else {
        digEl.innerHTML = `<div style="padding:20px; color:#fde047; text-align:center;"><h3>${title}</h3><p style="color:#94a3b8;">Tabla digital no disponible directamente.</p></div>`;
      }

      modal.style.display = 'flex';
    }

    function toggleSchoolTablesDrawer() {
      const drawer = document.getElementById('school-tables-drawer');
      const btn = document.getElementById('btn-toggle-school-tables');
      if (!drawer) return;
      if (drawer.style.display === 'none') {
        drawer.style.display = 'block';
        if (btn) btn.innerText = '👁️ Ocultar Tablas en Pantalla ▲';
      } else {
        drawer.style.display = 'none';
        if (btn) btn.innerText = '👁️ Ver Tablas en Pantalla ▼';
      }
    }

    function closeModalViewer() {
      const modal = document.getElementById('modal-viewer');
      if (modal) modal.style.display = 'none';
    }

    function closeAllModals() {
      closeModalViewer();
      closeTargetEditor();
      closeAboutModal();
    }

    // GLOBAL KEYBOARD SHORTCUTS FOR TABS AND WORKFLOW PHASES
    window.addEventListener('keydown', (e) => {
      // 1. Always let Escape close modals
      if (e.key === 'Escape' || e.key === 'Esc') {
        closeAllModals();
        return;
      }

      // Ignore if user is currently typing in an input, textarea, or select field
      const activeEl = document.activeElement;
      if (activeEl) {
        const tag = activeEl.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || tag === 'select' || activeEl.isContentEditable) {
          return;
        }
      }

      // Ignore if Ctrl, Alt or Meta (Command/Windows) keys are held to not interfere with browser combos
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      const k = e.key;

      // TOP-LEVEL TABS SHORTCUTS: [1]..[5]
      if (k === '1') {
        e.preventDefault();
        if (typeof switchTab === 'function') switchTab('workflow');
        showToast("🎮 Game Flow [1]");
        return;
      }
      if (k === '2') {
        e.preventDefault();
        if (typeof switchTab === 'function') switchTab('chart-k1');
        showToast("🎴 Habilidades K1 [2]");
        return;
      }
      if (k === '3') {
        e.preventDefault();
        if (typeof switchTab === 'function') switchTab('rogu-bukku');
        showToast("📜 Rogu Bukku [3]");
        return;
      }
      if (k === '4') {
        e.preventDefault();
        if (typeof switchTab === 'function') switchTab('dock');
        showToast("⚓ Submarines (18) [4]");
        return;
      }
      if (k === '5') {
        e.preventDefault();
        if (typeof switchTab === 'function') switchTab('compendium');
        showToast("📚 Todas las Tablas [5]");
        return;
      }
      if (k === '6') {
        e.preventDefault();
        if (typeof switchTab === 'function') switchTab('operations-map');
        showToast("🗺️ Mapa de Operaciones [6]");
        return;
      }

      // HELP / ABOUT MODAL: [?] or [h] or [H]
      if (k === '?' || k === 'h' || k === 'H') {
        e.preventDefault();
        const aboutModal = document.getElementById('modal-about');
        if (aboutModal && aboutModal.style.display !== 'none' && aboutModal.style.display !== '') {
          closeAboutModal();
        } else {
          openAboutModal();
        }
        return;
      }

      // WORKFLOW PHASE STEPPER SHORTCUTS:
      // Works directly when on Game Flow tab (or switches to it if called)
      const currentTab = document.querySelector('.tab-pane.active');
      const isWorkflowTab = currentTab && currentTab.id === 'tab-workflow';

      // Phase 0: [0]
      if (k === '0') {
        e.preventDefault();
        if (!isWorkflowTab && typeof switchTab === 'function') switchTab('workflow');
        if (typeof setWorkflowPhase === 'function') setWorkflowPhase(0);
        showToast("🚢 Fase 0: Selección de Submarino");
        return;
      }

      // Phase School: [e] or [E]
      if (k === 'e' || k === 'E') {
        e.preventDefault();
        if (!isWorkflowTab && typeof switchTab === 'function') switchTab('workflow');
        if (typeof setWorkflowPhase === 'function') setWorkflowPhase('school');
        showToast("🏫 Escuelas Navales [E]");
        return;
      }

      // Phase 1: [F1] or [z] or [Z] (Zarpe)
      if (k === 'F1' || k === 'z' || k === 'Z') {
        e.preventDefault();
        if (!isWorkflowTab && typeof switchTab === 'function') switchTab('workflow');
        if (typeof setWorkflowPhase === 'function') setWorkflowPhase(1);
        showToast("⚓ Fase 1: Zarpe [1]");
        return;
      }

      // Phase 2: [F2] or [t] or [T] (Trayecto)
      if (k === 'F2' || k === 't' || k === 'T') {
        e.preventDefault();
        if (!isWorkflowTab && typeof switchTab === 'function') switchTab('workflow');
        if (typeof setWorkflowPhase === 'function') setWorkflowPhase(2);
        showToast("🌊 Fase 2: Trayecto y Patrulla [2]");
        return;
      }

      // Phase 3: [F3] or [c] or [C] (Combate)
      if (k === 'F3' || k === 'c' || k === 'C') {
        e.preventDefault();
        if (!isWorkflowTab && typeof switchTab === 'function') switchTab('workflow');
        if (typeof setWorkflowPhase === 'function') setWorkflowPhase(3);
        showToast("⚔️ Fase 3: Combate Naval [3]");
        return;
      }

      // Phase 4: [F4] or [a] or [A] (Averías)
      if (k === 'F4' || k === 'a' || k === 'A') {
        e.preventDefault();
        if (!isWorkflowTab && typeof switchTab === 'function') switchTab('workflow');
        if (typeof setWorkflowPhase === 'function') setWorkflowPhase(4);
        showToast("💥 Fase 4: Averías y Reparaciones [4]");
        return;
      }

      // Phase 5: [F5] or [r] or [R] (Refit)
      if (k === 'F5' || k === 'r' || k === 'R') {
        e.preventDefault();
        if (!isWorkflowTab && typeof switchTab === 'function') switchTab('workflow');
        if (typeof setWorkflowPhase === 'function') setWorkflowPhase(5);
        showToast("🔧 Fase 5: Fin de Patrulla y Refit [5]");
        return;
      }
    });

    // CLICK OUTSIDE BACKDROP HANDLER
    window.addEventListener('DOMContentLoaded', () => {
      const modalViewer = document.getElementById('modal-viewer');
      if (modalViewer) {
        modalViewer.addEventListener('click', (e) => {
          if (e.target === modalViewer) closeModalViewer();
        });
      }
      const modalTargetEditor = document.getElementById('modal-target-editor');
      if (modalTargetEditor) {
        modalTargetEditor.addEventListener('click', (e) => {
          if (e.target === modalTargetEditor) closeTargetEditor();
        });
      }
      const modalAbout = document.getElementById('modal-about');
      if (modalAbout) {
        modalAbout.addEventListener('click', (e) => {
          if (e.target === modalAbout) closeAboutModal();
        });
      }
    });

    function saveState() {
      localStorage.setItem('sensuikan_campaign_state', JSON.stringify(campaignState));
    }

    function loadSavedState() {
      const saved = localStorage.getItem('sensuikan_campaign_state');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          campaignState = Object.assign(campaignState, parsed);
        } catch(e) {
          console.error("Error loading state", e);
        }
      }
    }

    function exportCampaignJSON() {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(campaignState, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `Sensuikan_Campaign_Save_${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast("Copia de seguridad descargada en JSON.");
    }

    function triggerImportJSON() {
      document.getElementById('importFileInput').click();
    }

    function importCampaignJSON(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const imported = JSON.parse(e.target.result);
          campaignState = imported;
          saveState();
          initApp();
          showToast("¡Campaña importada con éxito!");
        } catch(err) {
          alert("Error al leer el archivo JSON: " + err.message);
        }
      };
      reader.readAsText(file);
    }

    function resetCampaign() {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en');
      const confirmMsg = isEn
        ? "Are you sure you want to reset all campaign and patrol data back to Phase 0?"
        : "¿Estás seguro de poner a 0 todos los datos de patrullas y volver a la Fase 0?";
      if (confirm(confirmMsg)) {
        campaignState.tokens = {};
        campaignState.patrols = {};
        campaignState.workflow.currentPhase = 0;
        campaignState.workflow.currentBoxIndex = 0;
        saveState();
        initApp();
        if (typeof switchTab === 'function') switchTab('workflow');
        setWorkflowPhase(0);
        showToast(isEn ? "Campaign reset to Phase 0." : "Campaña reseteada a Fase 0.");
      }
    }

    function showToast(msg) {
      const t = document.getElementById('toast');
      document.getElementById('toast-msg').innerText = msg;
      t.classList.add('show');
      setTimeout(() => t.classList.remove('show'), 2400);
    }

    // CHART B7: SUBMARINE DAMAGE & CREW INJURY FUNCTIONS
    


    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('./sw.js')
          .then(function(reg) {
            console.log('Sensuikan PWA ServiceWorker registrado en:', reg.scope);
          })
          .catch(function(err) {
            console.log('Error registrando ServiceWorker:', err);
          });
      });
    }
  
  // =========================================================================
  // LOGIN SECURITY GATE LOGIC (USER / PWD AUTHENTICATION)
  // =========================================================================
  function checkLoginGate() {
    const isAuth = localStorage.getItem('sensuikan_auth_state');
    const gateEl = document.getElementById('security-login-gate');
    if (!gateEl) return;
    if (isAuth === 'granted') {
      gateEl.style.display = 'none';
    } else {
      gateEl.style.display = 'flex';
      setTimeout(() => {
        const uInp = document.getElementById('gate-user-input');
        if (uInp) uInp.focus();
      }, 300);
    }
  }

  function executeLoginGate() {
    const uInp = document.getElementById('gate-user-input');
    const pInp = document.getElementById('gate-pwd-input');
    const remChk = document.getElementById('gate-remember-chk');
    const errEl = document.getElementById('gate-error-msg');
    
    const userVal = uInp ? uInp.value.trim().toLowerCase() : '';
    const pwdVal = pInp ? pInp.value.trim() : '';

    const expectedUser = (localStorage.getItem('sensuikan_sec_user') || 'admin').toLowerCase();
    const expectedPwd = localStorage.getItem('sensuikan_sec_pwd') || 'sensuikan';

    // Check credentials (allows admin/sensuikan or user/sensuikan or custom)
    const isUserOk = (userVal === expectedUser || userVal === 'comandante' || userVal === 'admin');
    const isPwdOk = (pwdVal === expectedPwd);

    if (isUserOk && isPwdOk) {
      if (errEl) errEl.style.display = 'none';
      if (remChk && remChk.checked) {
        localStorage.setItem('sensuikan_auth_state', 'granted');
      } else {
        sessionStorage.setItem('sensuikan_auth_state', 'granted');
      }
      const gateEl = document.getElementById('security-login-gate');
      if (gateEl) {
        gateEl.style.opacity = '0';
        gateEl.style.transition = 'opacity 0.3s ease';
        setTimeout(() => gateEl.style.display = 'none', 300);
      }
      showToast("⚓ Acceso autorizado. Bienvenido, Comandante.");
    } else {
      if (errEl) errEl.style.display = 'block';
      if (pInp) {
        pInp.value = '';
        pInp.focus();
      }
    }
  }

  function logoutApp() {
    localStorage.removeItem('sensuikan_auth_state');
    sessionStorage.removeItem('sensuikan_auth_state');
    const gateEl = document.getElementById('security-login-gate');
    if (gateEl) {
      gateEl.style.display = 'flex';
      gateEl.style.opacity = '1';
    }
    const pInp = document.getElementById('gate-pwd-input');
    if (pInp) pInp.value = '';
    showToast("Terminal bloqueado");
  }

  function promptChangeCredentials() {
    const currentPwd = localStorage.getItem('sensuikan_sec_pwd') || 'sensuikan';
    const old = prompt("Introduce tu clave actual:");
    if (old === null) return;
    if (old.trim() !== currentPwd) {
      alert("❌ Clave actual incorrecta.");
      return;
    }
    const newUser = prompt("Introduce tu nuevo nombre de usuario:", localStorage.getItem('sensuikan_sec_user') || 'admin');
    if (!newUser || !newUser.trim()) return;
    const newPwd = prompt("Introduce tu nueva contraseña:");
    if (!newPwd || !newPwd.trim()) return;

    localStorage.setItem('sensuikan_sec_user', newUser.trim());
    localStorage.setItem('sensuikan_sec_pwd', newPwd.trim());
    alert("✅ Credenciales actualizadas con éxito.\nUsuario: " + newUser + "\nNueva clave guardada.");
  }

  // Auto check on load
  document.addEventListener('DOMContentLoaded', checkLoginGate);

