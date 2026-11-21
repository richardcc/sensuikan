# -*- coding: utf-8 -*-
import os
import re

def update_partial():
    path = os.path.join('app', 'partials', '02_workflow_04_phase2_transit.html')
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()

    spec_wrapper_html = '''              <!-- Dedicated Special Module View (Shown when in a Special Mission box that uses its own module and doesn't require Table A3) -->
              <div id="p2-spec-module-controls-wrapper" style="display:none; background:rgba(15,23,42,0.85); border:1px solid #38bdf8; border-radius:6px; padding:12px;">
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                  <span id="p2-spec-module-icon" style="font-size:1.4rem;">🎯</span>
                  <div>
                    <div id="p2-spec-module-title" style="font-weight:800; color:#38bdf8; font-size:0.95rem;">MISIÓN ESPECIAL TÁCTICA ACTIVA</div>
                    <div id="p2-spec-module-sub" style="font-size:0.75rem; color:#94a3b8;">Módulo táctico dedicado • No se utiliza la Tabla [A3] en esta casilla</div>
                  </div>
                </div>
                <div id="p2-spec-module-desc" style="font-size:0.80rem; color:var(--slate-300); line-height:1.45; margin-bottom:12px;">
                  En esta casilla se ejecuta la operación de Misión Especial dedicada mediante su propio módulo.
                </div>
                <div id="p2-spec-module-btn-container" style="display:flex; flex-direction:column; gap:8px;">
                  <!-- Botón dinámico al módulo táctico -->
                </div>
                <div style="margin-top:10px; font-size:0.74rem; color:#94a3b8; border-top:1px dashed #334155; padding-top:8px;">
                  ℹ️ <span id="p2-spec-module-footer-note">Una vez resuelta la misión táctica, pulsa <strong>Avanzar Casilla ▶</strong> para continuar hacia las estaciones de patrulla ordinarias donde sí se aplicará la Tabla [A3].</span>
                </div>
              </div>
'''

    if 'p2-spec-module-controls-wrapper' not in html:
        target = '<!-- Hidden container for backwards-compatibility -->'
        html = html.replace(target, spec_wrapper_html + '\n              ' + target)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(html)
        print("Updated 02_workflow_04_phase2_transit.html with p2-spec-module-controls-wrapper")
    else:
        print("p2-spec-module-controls-wrapper already present in 02_workflow_04_phase2_transit.html")

def update_gameflow_phase2():
    code_helper = '''
    function getAssignedSpecialMissionKeySafe() {
      if (typeof getCurrentAssignedMissionKey === 'function') {
        const k = getCurrentAssignedMissionKey();
        if (k) return k;
      }
      if (typeof campaignState !== 'undefined' && campaignState.workflow) {
        const wf = campaignState.workflow;
        if (wf.assignedSpecialMissionKey) return wf.assignedSpecialMissionKey;
        const str = ((wf.specialMissionAssigned || '') + ' ' + (wf.assignedMissionLine || '') + ' ' + (wf.assignedMissionType || '')).toLowerCase();
        if (str.includes('recon') || str.includes('aéreo') || str.includes('glen') || str.includes('seiran')) return 'recon';
        if (str.includes('midget') || str.includes('ko-hyoteki') || str.includes('mini')) return 'midget';
        if (str.includes('bomb') || str.includes('panama') || str.includes('oregon')) return 'bombing';
        if (str.includes('kaiten')) return 'kaiten';
        if (str.includes('transport') || str.includes('tokyo') || str.includes('supply') || str.includes('suministro')) return 'transport';
        if (str.includes('yanagi') || str.includes('europe') || str.includes('europa')) return 'yanagi';
        if (str.includes('evac') || str.includes('kiska')) return 'evacuation';
        if (str.includes('shore') || str.includes('bombard') || str.includes('costero')) return 'shore_bombardment';
        if (str.includes('mine') || str.includes('mina')) return 'minelaying';
        if (str.includes('pass') || str.includes('vip') || str.includes('agente')) return 'passenger';
        if (str.includes('picket') || str.includes('piquete')) return 'picket';
      }
      return null;
    }
'''

    for fp in [os.path.join('app', 'js', 'gameflow_phase2.js'), os.path.join('app', 'js', 'components', 'gameflow_phase2.js')]:
        with open(fp, 'r', encoding='utf-8') as f:
            js = f.read()

        if 'function getAssignedSpecialMissionKeySafe' not in js:
            # Add helper right before updateBoxDisplay
            target = 'function updateBoxDisplay() {'
            js = js.replace(target, code_helper + '\n    ' + target)

        # Update updateBoxDisplay to handle noA3Needed and specWrapper
        old_block = '''      if (a3Wrapper) a3Wrapper.style.display = 'block';
      if (portWrapper) portWrapper.style.display = 'none';
      const a3MainContainer = document.getElementById('p2-a3-main-container');
      if (a3MainContainer) a3MainContainer.style.display = 'block';
      if (c2Title) c2Title.innerText = isEn ? "2. Encounter Roll on Chart [A3]" : "2. Tirada de Encuentros en Tabla [A3]";
      if (c2Help) c2Help.innerText = isEn ? "Roll 2d6 in each patrol station or transit box:" : "Lanza 2d6 en cada casilla de estación o tránsito:";'''

        new_block = '''      const specWrapper = document.getElementById('p2-spec-module-controls-wrapper');
      const boxNameCheck = list[idx] || "";
      const isSpecBoxCheck = boxNameCheck.includes("Mission") || boxNameCheck.includes("Misión");
      const specKeyCheck = getAssignedSpecialMissionKeySafe();
      const noA3NeededCheck = isSpecBoxCheck && (specKeyCheck === 'recon' || specKeyCheck === 'midget' || specKeyCheck === 'bombing' || specKeyCheck === 'kaiten');

      const a3MainContainer = document.getElementById('p2-a3-main-container');

      if (noA3NeededCheck) {
        if (a3MainContainer) a3MainContainer.style.display = 'none';
        if (a3Wrapper) a3Wrapper.style.display = 'none';
        if (portWrapper) portWrapper.style.display = 'none';
        if (specWrapper) {
          specWrapper.style.display = 'block';
          const iconEl = document.getElementById('p2-spec-module-icon');
          const titleEl = document.getElementById('p2-spec-module-title');
          const descElM = document.getElementById('p2-spec-module-desc');
          const btnCont = document.getElementById('p2-spec-module-btn-container');

          if (specKeyCheck === 'recon') {
            if (iconEl) iconEl.innerText = '✈️';
            if (titleEl) titleEl.innerText = isEn ? 'Aerial Reconnaissance [Rule 7.1 / 7.17]' : 'Reconocimiento Aéreo con Hidroavión [Regla 7.1 / 7.17]';
            if (descElM) descElM.innerText = isEn 
              ? 'In this box, the submarine deploys its onboard floatplane to conduct aerial reconnaissance over enemy anchorages. Table [A3] does not apply.' 
              : 'En esta casilla el buque despliega su hidroavión embarcado para explorar el fondeadero enemigo. No aplica tirada en Tabla [A3].';
            if (btnCont) btnCont.innerHTML = `<button type="button" class="action-btn" onclick="openAircraftDisplayMatModal()" style="width:100%; justify-content:center; background:linear-gradient(135deg, #0284c7, #0369a1); border-color:#38bdf8; color:#fff; font-weight:800; padding:8px 12px; font-size:0.86rem; box-shadow:0 2px 8px rgba(0,0,0,0.5);">✈️ ${isEn ? 'Open Aircraft Mat [Chart P] / Resolve Flight' : 'Abrir Tablero de Hidroavión [Chart P] / Resolver Vuelo'}</button>`;
          } else if (specKeyCheck === 'midget') {
            if (iconEl) iconEl.innerText = '🚀';
            if (titleEl) titleEl.innerText = isEn ? 'Ko-Hyoteki Midget Sub Attack [Rule 7.3]' : 'Ataque Minisumergibles Ko-Hyoteki [Regla 7.3]';
            if (descElM) descElM.innerText = isEn 
              ? 'The mother submarine covertly releases its 46-ton Ko-Hyoteki midget submarine outside the harbor entrance. Resolved on Charts M1–M7. Table [A3] does not apply.' 
              : 'El submarino nodriza suelta su minisubmarino Ko-Hyoteki ante el puerto enemigo. Se resuelve en las Tablas M1–M7. No aplica Tabla [A3].';
            if (btnCont) btnCont.innerHTML = `<button type="button" class="action-btn" onclick="openSpecialMissionResolver('midget')" style="width:100%; justify-content:center; background:linear-gradient(135deg, #7c3aed, #6d28d9); border-color:#a855f7; color:#fff; font-weight:800; padding:8px 12px; font-size:0.86rem; box-shadow:0 2px 8px rgba(0,0,0,0.5);">🚀 ${isEn ? 'Resolve Ko-Hyoteki Strike [Charts M1-M7]' : 'Resolver Ataque Ko-Hyoteki [Tablas M1-M7]'}</button>`;
          } else if (specKeyCheck === 'kaiten') {
            if (iconEl) iconEl.innerText = '💥';
            if (titleEl) titleEl.innerText = isEn ? 'Kaiten Suicide Torpedo Strike [Rule 7.8]' : 'Ataque de Torpedos Suicidas Kaiten [Regla 7.8]';
            if (descElM) descElM.innerText = isEn 
              ? 'Submerged approach and release of Kaiten manned torpedoes against enemy fleet vessels. Resolved via Kaiten Module. Table [A3] does not apply.' 
              : 'Aproximación en inmersión y lanzamiento de torpedos tripulados Kaiten. Resuelto en el Módulo Kaiten. No aplica Tabla [A3].';
            if (btnCont) btnCont.innerHTML = `<button type="button" class="action-btn" onclick="openSpecialMissionResolver('kaiten')" style="width:100%; justify-content:center; background:linear-gradient(135deg, #b91c1c, #991b1b); border-color:#ef4444; color:#fff; font-weight:800; padding:8px 12px; font-size:0.86rem; box-shadow:0 2px 8px rgba(0,0,0,0.5);">💥 ${isEn ? 'Resolve Kaiten Strike [Rule 7.8]' : 'Resolver Ataque Kaiten [Regla 7.8]'}</button>`;
          } else if (specKeyCheck === 'bombing') {
            if (iconEl) iconEl.innerText = '💣';
            if (titleEl) titleEl.innerText = isEn ? 'Strategic Aerial Bombing [Rule 7.7]' : 'Bombardeo Aéreo Estratégico [Regla 7.7]';
            if (descElM) descElM.innerText = isEn 
              ? 'Catapult floatplane loaded with bombs against strategic targets. Table [A3] does not apply.' 
              : 'Catapulta el hidroavión cargado con bombas contra el objetivo estratégico. No aplica Tabla [A3].';
            if (btnCont) btnCont.innerHTML = `<button type="button" class="action-btn" onclick="openAircraftDisplayMatModal()" style="width:100%; justify-content:center; background:linear-gradient(135deg, #b45309, #92400e); border-color:#f59e0b; color:#fff; font-weight:800; padding:8px 12px; font-size:0.86rem; box-shadow:0 2px 8px rgba(0,0,0,0.5);">💣 ${isEn ? 'Open Aircraft Mat / Execute Bombing Run' : 'Abrir Tablero de Hidroavión / Ejecutar Bombardeo'}</button>`;
          }
        }
        if (c2Title) c2Title.innerText = isEn ? "2. Special Mission Operation [Rule 7.0]" : "2. Operación de Misión Especial [Regla 7.0]";
        if (c2Help) c2Help.innerText = isEn ? "Dedicated tactical module active. Table [A3] is not used in this box." : "Módulo táctico dedicado activo. La Tabla [A3] no se utiliza en esta casilla.";
      } else {
        if (a3Wrapper) a3Wrapper.style.display = 'block';
        if (portWrapper) portWrapper.style.display = 'none';
        if (specWrapper) specWrapper.style.display = 'none';
        if (a3MainContainer) a3MainContainer.style.display = 'block';

        if (isSpecBoxCheck && (specKeyCheck === 'transport' || specKeyCheck === 'minelaying' || specKeyCheck === 'passenger' || specKeyCheck === 'evacuation' || specKeyCheck === 'shore_bombardment' || specKeyCheck === 'yanagi')) {
          campaignState.workflow.useA3SpecialMissionColumn = true;
          if (c2Title) c2Title.innerText = isEn ? "2. Special Mission Detection Check [Chart A3]" : "2. Comprobación en Columna Misión Especial [Tabla A3]";
          if (c2Help) c2Help.innerText = isEn ? "Roll 2d6 in Special Mission column (4-11: Clear/Objective Accomplished):" : "Lanza 2d6 en la columna de Misión Especial (4-11: Despejado/Objetivo Cumplido):";
        } else {
          campaignState.workflow.useA3SpecialMissionColumn = false;
          if (c2Title) c2Title.innerText = isEn ? "2. Encounter Roll on Chart [A3]" : "2. Tirada de Encuentros en Tabla [A3]";
          if (c2Help) c2Help.innerText = isEn ? "Roll 2d6 in each patrol station or transit box:" : "Lanza 2d6 en cada casilla de estación o tránsito:";
        }
      }'''

        if old_block in js:
            js = js.replace(old_block, new_block)
            print(f"Updated updateBoxDisplay in {fp}")
        else:
            print(f"Target block not found in {fp}")

        # Update rollBoxEncounter guard
        old_roll_start = '''    function rollBoxEncounter(manualRoll) {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
      const idx = (typeof campaignState.workflow.currentBoxIndex === 'number') ? campaignState.workflow.currentBoxIndex : -1;
      if (idx === -1) {
        showToast(isEn ? "The submarine is moored in port. Click 'Advance' to set sail on Box 1!" : "El submarino está amarrado en puerto. ¡Pulsa 'Avanzar' para zarpar hacia la Casilla 1!");
        return;
      }
      const list = campaignState.workflow.boxList || [];
      const boxName = list[idx] || "Patrulla";
      const isTransit = boxName.includes("Transit") || boxName.includes("Tránsito") || boxName.includes("Return") || boxName.includes("Retorno");
      const isSpecialBox = boxName.includes("Mission") || boxName.includes("Misión");'''

        new_roll_start = '''    function rollBoxEncounter(manualRoll) {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
      const idx = (typeof campaignState.workflow.currentBoxIndex === 'number') ? campaignState.workflow.currentBoxIndex : -1;
      if (idx === -1) {
        showToast(isEn ? "The submarine is moored in port. Click 'Advance' to set sail on Box 1!" : "El submarino está amarrado en puerto. ¡Pulsa 'Avanzar' para zarpar hacia la Casilla 1!");
        return;
      }
      const list = campaignState.workflow.boxList || [];
      const boxName = list[idx] || "Patrulla";
      const isTransit = boxName.includes("Transit") || boxName.includes("Tránsito") || boxName.includes("Return") || boxName.includes("Retorno");
      const isSpecialBox = boxName.includes("Mission") || boxName.includes("Misión");

      const specKeyRoll = getAssignedSpecialMissionKeySafe();
      const noA3NeededRoll = isSpecialBox && (specKeyRoll === 'recon' || specKeyRoll === 'midget' || specKeyRoll === 'bombing' || specKeyRoll === 'kaiten');
      if (noA3NeededRoll) {
        showToast(isEn ? "Table [A3] is not used in this box. Please resolve the dedicated tactical mission above." : "En esta casilla no aplica la Tabla [A3]. Resuelve la misión táctica arriba.");
        return;
      }'''

        if old_roll_start in js:
            js = js.replace(old_roll_start, new_roll_start)
            print(f"Updated rollBoxEncounter guard in {fp}")

        with open(fp, 'w', encoding='utf-8') as f:
            f.write(js)

def update_tables_js():
    for fp in [os.path.join('app', 'js', 'tables.js'), os.path.join('app', 'js', 'components', 'tables.js')]:
        with open(fp, 'r', encoding='utf-8') as f:
            js = f.read()

        old_start = '''      const a3MainContainer = document.getElementById('p2-a3-main-container');
      if (idx === -1) {
        if (a3MainContainer) a3MainContainer.style.display = 'none';
        return;
      }
      if (a3MainContainer) a3MainContainer.style.display = 'block';
      const list = campaignState.workflow.boxList || [];
      const boxName = list[idx] || "Patrulla";
      const isTransit = boxName.includes("Transit") || boxName.includes("Tránsito") || boxName.includes("Return") || boxName.includes("Retorno");
      const isSpecialBox = boxName.includes("Mission") || boxName.includes("Misión");
      
      const assignedArea = campaignState.workflow.assignedArea || "Pearl Harbor";
      const mappedAreaZone = mapA1ToA3Zone(assignedArea);
      const useSpecialCol = !!(isSpecialBox && campaignState.workflow.useA3SpecialMissionColumn);'''

        new_start = '''      const a3MainContainer = document.getElementById('p2-a3-main-container');
      if (idx === -1) {
        if (a3MainContainer) a3MainContainer.style.display = 'none';
        return;
      }

      const list = campaignState.workflow.boxList || [];
      const boxName = list[idx] || "Patrulla";
      const isTransit = boxName.includes("Transit") || boxName.includes("Tránsito") || boxName.includes("Return") || boxName.includes("Retorno");
      const isSpecialBox = boxName.includes("Mission") || boxName.includes("Misión");

      const specKey = (typeof getAssignedSpecialMissionKeySafe === 'function') 
        ? getAssignedSpecialMissionKeySafe() 
        : ((typeof getCurrentAssignedMissionKey === 'function') ? getCurrentAssignedMissionKey() : null);

      const noA3Needed = isSpecialBox && (specKey === 'recon' || specKey === 'midget' || specKey === 'bombing' || specKey === 'kaiten');
      if (noA3Needed) {
        if (a3MainContainer) a3MainContainer.style.display = 'none';
        return;
      }

      if (a3MainContainer) a3MainContainer.style.display = 'block';

      if (isSpecialBox && (specKey === 'transport' || specKey === 'minelaying' || specKey === 'passenger' || specKey === 'evacuation' || specKey === 'shore_bombardment' || specKey === 'yanagi')) {
        campaignState.workflow.useA3SpecialMissionColumn = true;
      }

      const assignedArea = campaignState.workflow.assignedArea || "Pearl Harbor";
      const mappedAreaZone = mapA1ToA3Zone(assignedArea);
      const useSpecialCol = !!(isSpecialBox && campaignState.workflow.useA3SpecialMissionColumn);'''

        if old_start in js:
            js = js.replace(old_start, new_start)
            print(f"Updated updatePhase2TableDisplay in {fp}")
        else:
            print(f"Target start block not found in {fp}")

        with open(fp, 'w', encoding='utf-8') as f:
            f.write(js)

def main():
    update_partial()
    update_gameflow_phase2()
    update_tables_js()
    print("Done applying dynamic hiding of Table A3 for dedicated special missions!")

if __name__ == '__main__':
    main()
