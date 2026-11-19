import os

path = 'app/js/gameflow_phase4_5.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = "    function rollB7CrewInjury() {"
end_marker = "      showToast(isEn ? `Casualty recorded: ${role} (${sev})` : `Baja registrada: ${role} (${sev})`);\n    }"

idx1 = content.find(start_marker)
idx2 = content.find(end_marker, idx1)

if idx1 == -1 or idx2 == -1:
    print(f"Error: idx1={idx1}, idx2={idx2}")
    exit(1)

replacement = """    function renderB7CasualtyTableHtml(sum, d1, d2, role, sevRoll, sevKey, sev, sevDesc, penalty, isEn) {
      let sevBg = 'rgba(56, 189, 248, 0.2)';
      let sevColor = '#38bdf8';
      let sevBorder = 'rgba(56, 189, 248, 0.4)';
      if (sevKey === 'SW') {
        sevBg = 'rgba(245, 158, 11, 0.25)';
        sevColor = '#fbbf24';
        sevBorder = 'rgba(245, 158, 11, 0.5)';
      } else if (sevKey === 'KIA') {
        sevBg = 'rgba(239, 68, 68, 0.25)';
        sevColor = '#f87171';
        sevBorder = 'rgba(239, 68, 68, 0.5)';
      }

      return `
        <table class="table-sub-data" style="width:100%; border-collapse:collapse; margin-top:8px; font-size:0.75rem; text-align:left; background:rgba(15,23,42,0.7); border:1px solid rgba(239,68,68,0.4); border-radius:6px; overflow:hidden;">
          <thead>
            <tr style="background:rgba(239,68,68,0.22); color:#fca5a5; font-size:0.72rem; text-transform:uppercase;">
              <th style="padding:5px 8px; border:1px solid rgba(239,68,68,0.3); width:32%;">${isEn ? 'Station (2d6)' : 'Puesto Afectado (2d6)'}</th>
              <th style="padding:5px 8px; border:1px solid rgba(239,68,68,0.3); width:28%;">${isEn ? 'Severity (1d6)' : 'Gravedad (1d6)'}</th>
              <th style="padding:5px 8px; border:1px solid rgba(239,68,68,0.3); width:40%;">${isEn ? 'Operational Effect' : 'Efecto Operativo'}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding:6px 8px; border:1px solid rgba(239,68,68,0.25); font-weight:bold; color:var(--gold-300); vertical-align:top;">
                <div style="font-size:0.72rem; color:#94a3b8;">2d6 = ${sum} [${d1}+${d2}]</div>
                <div style="color:#ffffff; font-size:0.80rem; margin-top:2px;">${role}</div>
              </td>
              <td style="padding:6px 8px; border:1px solid rgba(239,68,68,0.25); vertical-align:top;">
                <div style="font-size:0.72rem; color:#94a3b8;">1d6 = ${sevRoll}</div>
                <span style="display:inline-block; padding:2px 6px; border-radius:4px; font-weight:bold; font-size:0.72rem; background:${sevBg}; color:${sevColor}; border:1px solid ${sevBorder}; margin-top:2px;">${sev}</span>
                <div style="font-size:0.70rem; color:#cbd5e1; margin-top:3px;">${sevDesc}</div>
              </td>
              <td style="padding:6px 8px; border:1px solid rgba(239,68,68,0.25); color:#e2e8f0; font-size:0.73rem; line-height:1.4; vertical-align:top;">
                ${penalty}
              </td>
            </tr>
          </tbody>
        </table>
      `;
    }
    window.renderB7CasualtyTableHtml = renderB7CasualtyTableHtml;

    function applyP4B7Tabletop() {
      const posVal = parseInt(document.getElementById('p4-b7-pos-tabletop')?.value || '7', 10);
      const sevVal = parseInt(document.getElementById('p4-b7-sev-tabletop')?.value || '4', 10);
      rollB7CrewInjury(posVal, sevVal);
    }
    window.applyP4B7Tabletop = applyP4B7Tabletop;

    function rollB7CrewInjury(manualSum, manualSev) {
      const isEn = window.currentLang === 'en';
      let d1, d2, sum;
      if (typeof manualSum === 'number' && manualSum >= 2 && manualSum <= 12) {
        sum = manualSum;
        d1 = Math.floor(sum / 2);
        d2 = sum - d1;
      } else {
        d1 = Math.floor(Math.random() * 6) + 1;
        d2 = Math.floor(Math.random() * 6) + 1;
        sum = d1 + d2;
      }

      let sevRoll;
      if (typeof manualSev === 'number' && manualSev >= 1 && manualSev <= 6) {
        sevRoll = manualSev;
      } else {
        sevRoll = Math.floor(Math.random() * 6) + 1;
      }

      let role = isEn ? "Crew (Generic)" : "Dotación genérica";
      let roleKey = "crew";
      let penalty = isEn ? "If all generic crew boxes are SW/KIA: +1 torpedo To-Hit." : "Si todas las casillas genéricas quedan SW o KIA: +1 a impactar con torpedos.";

      if (sum === 2) {
        role = isEn ? "Captain" : "Comandante";
        roleKey = "captain";
        penalty = isEn ? "The Executive Officer takes command. Penalties: Detection +1, To-Hit +1." : "El oficial ejecutivo toma el mando. Penalizaciones: detección +1, impactar +1.";
      } else if (sum === 3) {
        role = isEn ? "Engineer" : "Ingeniero";
        roleKey = "engineer";
        penalty = isEn ? "All repair and flooding containment rolls receive +1 DRM." : "Todas las tiradas de reparación y contención de inundación reciben +1 DRM.";
      } else if (sum === 4) {
        role = isEn ? "Executive Officer (XO)" : "Oficial ejecutivo (XO)";
        roleKey = "exec";
        penalty = isEn ? "If the XO was in command, the 3rd Officer takes command: Detection +1, To-Hit +1." : "Si el XO estaba al mando, el tercer oficial toma el mando: detección +1, impactar +1.";
      } else if (sum === 5) {
        role = isEn ? "Medic" : "Médico";
        roleKey = "medic";
        penalty = isEn ? "All crew with Serious Wounds (SW) become KIA after each zone on 1d6 >= 4." : "Todos los tripulantes con herida grave (SW) mueren (KIA) tras cada zona con 1d6 >= 4.";
      } else if (sum >= 6 && sum <= 10) {
        role = isEn ? `Crew (generic, box #${sum - 5})` : `Dotación genérica (casilla #${sum - 5})`;
        roleKey = "crew";
        penalty = isEn ? "If all generic crew boxes are SW or KIA: torpedo To-Hit worsens by +1." : "Si todas las casillas genéricas quedan SW o KIA: impactar con torpedos empeora en +1.";
      } else if (sum === 11) {
        role = isEn ? "Navigator" : "Navegante";
        roleKey = "navigator";
        penalty = isEn ? "The submarine must abort if the Navigator was acting as Captain." : "El submarino debe abortar si el navegante estaba ejerciendo de capitán.";
      } else if (sum === 12) {
        role = isEn ? "Pilot / Midget / Kaiten crew" : "Dotación de piloto / Midget / Kaiten";
        roleKey = "pilot";
        penalty = isEn ? "The special mission fails automatically if all are SW or KIA." : "La misión especial fracasa automáticamente si todos quedan SW o KIA.";
      }

      let sevKey = 'LW';
      let sev = isEn ? "LW (Light Wound)" : "LW (Herida leve)";
      let sevDesc = isEn ? "No adverse combat effect." : "Sin efecto negativo en combate.";
      if (sevRoll >= 4 && sevRoll <= 5) {
        sevKey = 'SW';
        sev = isEn ? "SW (Serious Wound)" : "SW (Herida grave)";
        sevDesc = isEn ? "Incapacitated for service." : "Incapacitado para el servicio.";
      } else if (sevRoll === 6) {
        sevKey = 'KIA';
        sev = isEn ? "KIA (Killed in Action)" : "KIA (Muerto en combate)";
        sevDesc = isEn ? "Permanent combat casualty." : "Baja definitiva en combate.";
      }

      campaignState.crewInjuries = campaignState.crewInjuries || {};
      if (sevKey === 'SW' || sevKey === 'KIA') {
        campaignState.crewInjuries[roleKey] = true;
      }

      const el = document.getElementById('wf-b7-crew-res');
      if (el) {
        el.innerHTML = renderB7CasualtyTableHtml(sum, d1, d2, role, sevRoll, sevKey, sev, sevDesc, penalty, isEn);
      }
      showToast(isEn ? `Casualty recorded: ${role} (${sev})` : `Baja registrada: ${role} (${sev})`);
      saveState();
    }"""

new_content = content[:idx1] + replacement + content[idx2 + len(end_marker):]

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Updated gameflow_phase4_5.js successfully")
