import shutil

print("Applying Fanmade UI updates...")

# 1. Update data.js
with open("app/js/data.js", "r", encoding="utf-8") as f:
    data_content = f.read()

fanmade_descriptions_code = '''  "Type_B2_Class": {
    "es": "Variante simplificada en tiempo de guerra del afamado Type B (I-40 a I-45). Submarino crucero con hidroavión de exploración Yokosuka E14Y Glen y 6 tubos de proa con 17 torpedos Tipo 95. El I-41 torpedeó y averió gravemente al crucero USS Reno; el I-44 fue convertido en 1945 para transportar 4 Kaiten.",
    "en": "Simplified wartime variant of the famed Type B (I-40 to I-45). Cruiser submarine carrying a Yokosuka E14Y Glen scout floatplane and 6 bow tubes with 17 Type 95 torpedoes. I-41 torpedoed and heavily damaged cruiser USS Reno; I-44 was converted in 1945 to carry 4 Kaiten."
  },
  "Type_C2_Class": {
    "es": "Submarino de ataque pesado oceánico (I-46 a I-48). Eliminó las instalaciones del minisubmarino para maximizar autonomía y capacidad de torpedos (6 tubos de proa y 13 recargas = 19 torpedos). Muy activo como nodriza Kaiten; el I-47 hundió al petrolero USS Mississinewa en Ulithi.",
    "en": "Heavy ocean attack submarine (I-46 to I-48). Omitted midget submarine gear to maximize range and torpedo magazine (6 bow tubes and 13 reloads = 19 torpedoes). Highly active Kaiten carrier; I-47 sank fleet oiler USS Mississinewa at Ulithi."
  },
  "Type_A2_Class": {
    "es": "Submarino portaaviones de ataque (I-13 e I-14). Clase hermana del Sen-Toku (I-400), modificada con un gran hangar cilíndrico para transportar 2 bombarderos de ataque Aichi M6A1 Seiran. Equipado con radar Type 22 y Type 13. Requiere rango de Commander (中佐).",
    "en": "Attack aircraft carrier submarine (I-13 and I-14). Sister class to Sen-Toku (I-400), modified with an enlarged cylindrical hangar to carry 2 Aichi M6A1 Seiran strike bombers. Equipped with Type 22 and Type 13 radars. Requires Commander rank."
  },
  "Type_D1_Class": {
    "es": "Submarino de transporte y suministro especializado (I-361 a I-372). Diseñado para romper el bloqueo naval en islas sitiadas transportando 1 barcaza de desembarco Daihatsu de 14m y 82 toneladas de carga. Solo 2 tubos de proa sin recargas. En late-1944 convertidos para transportar 5 Kaiten.",
    "en": "Dedicated supply and transport submarine (I-361 to I-372). Built to run island blockade missions carrying 1 Daihatsu 14m landing craft on aft deck and 82 tons of cargo. Only 2 bow torpedoes with 0 reloads. Converted to 5 Kaiten in late 1944."
  },
  "Kaichu_VII_Class": {
    "es": "El submarino costero y de flota medio por excelencia de la Armada Imperial (Ro-35 a Ro-56). Rápido tiempo de inmersión y excepcional maniobrabilidad en aguas restringidas de las Islas Salomón y Marianas. 4 tubos de proa con 6 recargas (10 torpedos) y 1 cañón de 76,2 mm.",
    "en": "The quintessential medium coastal/fleet submarine of the IJN during WWII (Ro-35 to Ro-56). Fast diving speed and outstanding maneuverability in island archipelagos. 4 bow tubes with 6 reloads (10 torpedoes) and 1x 76.2mm deck gun."
  },
  "Junsen_J1_Class": {
    "es": "Submarino crucero original de preguerra (I-1 a I-4) sin hangar de avión. Armamento de artillería muy pesado con cañones gemelos de 140 mm (proa y popa) y 20 torpedos (6 tubos + 14 recargas). Gigantesco radio de acción de 24.400 millas náuticas.",
    "en": "Original pre-war cruiser submarine (I-1 to I-4) without aircraft hangar. Heavily armed with twin 140mm deck guns (fore and aft) and 20 torpedoes (6 tubes + 14 reloads). Massive 24,400 nm operational range."
  },'''

if '"Type_B2_Class"' not in data_content:
    data_content = data_content.replace('const SUB_DESCRIPTIONS = {', 'const SUB_DESCRIPTIONS = {\n' + fanmade_descriptions_code)
    with open("app/js/data.js", "w", encoding="utf-8") as f:
        f.write(data_content)
    print("✓ SUB_DESCRIPTIONS updated with 6 fanmade entries in app/js/data.js")

# 2. Update buildWorkflowSubClassSelect in gameflow_phase0.js
with open("app/js/gameflow_phase0.js", "r", encoding="utf-8") as f:
    p0_content = f.read()

target_str = """      keys.forEach((k) => {
        const sub = subs[k];
        const dateMatch = sub.available_date || '1941';
        const option = document.createElement('option');
        option.value = k;
        option.textContent = `${sub.class_name || k} (${dateMatch})`;
        if (k === targetSub) option.selected = true;
        select.appendChild(option);
      });"""

replacement_str = """      const officialGroup = document.createElement('optgroup');
      officialGroup.label = isEn ? "⚓ Official Submarines (Compass Games)" : "⚓ Submarinos Oficiales (Compass Games)";
      
      const fanmadeGroup = document.createElement('optgroup');
      fanmadeGroup.label = isEn ? "⭐ Real Historical Variants [Fanmade]" : "⭐ Variantes Históricas Reales [Fanmade]";

      keys.forEach((k) => {
        const sub = subs[k];
        const dateMatch = sub.available_date || '1941';
        const isFan = !!sub.is_fanmade;
        const option = document.createElement('option');
        option.value = k;
        option.textContent = isFan 
          ? `${sub.class_name || k} [Fanmade] (${dateMatch})`
          : `${sub.class_name || k} (${dateMatch})`;
        
        if (isFan) {
          option.style.color = '#fbbf24';
          fanmadeGroup.appendChild(option);
        } else {
          officialGroup.appendChild(option);
        }

        if (k === targetSub) option.selected = true;
      });

      if (officialGroup.children.length > 0) select.appendChild(officialGroup);
      if (fanmadeGroup.children.length > 0) select.appendChild(fanmadeGroup);"""

if target_str in p0_content:
    p0_content = p0_content.replace(target_str, replacement_str)
    with open("app/js/gameflow_phase0.js", "w", encoding="utf-8") as f:
        f.write(p0_content)
    print("✓ gameflow_phase0.js buildWorkflowSubClassSelect updated")

# 3. Update gameflow_phase4_5.js
with open("app/js/gameflow_phase4_5.js", "r", encoding="utf-8") as f:
    p4_content = f.read()

p4_target = """        keys.forEach(k => {
          const sub = subs[k];
          const startMonth = getSubmarineStartMonth(k);
          const isDateValid = (startMonth <= curMonth);
          const requiresCdr = (s && s.commander_rank_required === 'Commander') || (subKey === 'Sen_Toku_Class' || subKey === 'Type_A_Modified');
          const isRankBlocked = requiresCdr && !isCdrPlus;

          const opt = document.createElement('option');
          opt.value = k;"""

p4_replacement = """        keys.forEach(k => {
          const sub = subs[k];
          const startMonth = getSubmarineStartMonth(k);
          const isDateValid = (startMonth <= curMonth);
          const requiresCdr = (sub && sub.commander_rank_required === 'Commander') || (k === 'Sen_Toku_Class' || k === 'Type_A_Modified' || k === 'Type_A2_Class');
          const isRankBlocked = requiresCdr && !isCdrPlus;
          const isFan = !!sub.is_fanmade;
          const fanTag = isFan ? " [Fanmade]" : "";

          const opt = document.createElement('option');
          opt.value = k;"""

if p4_target in p4_content:
    p4_content = p4_content.replace(p4_target, p4_replacement)
    p4_content = p4_content.replace("${sub.class_name || k} (Not available", "${sub.class_name || k}${fanTag} (Not available")
    p4_content = p4_content.replace("${sub.class_name || k} (Disponible a partir", "${sub.class_name || k}${fanTag} (Disponible a partir")
    p4_content = p4_content.replace("${sub.class_name || k} (Requires Commander", "${sub.class_name || k}${fanTag} (Requires Commander")
    p4_content = p4_content.replace("${sub.class_name || k} (Requiere rango Commander", "${sub.class_name || k}${fanTag} (Requiere rango Commander")
    p4_content = p4_content.replace("${sub.class_name || k} (Available", "${sub.class_name || k}${fanTag} (Available")
    p4_content = p4_content.replace("${sub.class_name || k} (Disponible ${sub.available_date", "${sub.class_name || k}${fanTag} (Disponible ${sub.available_date")
    p4_content = p4_content.replace("opt.style.color = '#a7f3d0';", "opt.style.color = isFan ? '#fbbf24' : '#a7f3d0';")
    with open("app/js/gameflow_phase4_5.js", "w", encoding="utf-8") as f:
        f.write(p4_content)
    print("✓ gameflow_phase4_5.js sub-upgrade-select updated")

# 4. Update dock.js
with open("app/js/dock.js", "r", encoding="utf-8") as f:
    dock_content = f.read()

dock_target = """        const activeTag = isCommissioned
          ? `<span class="badge-sub-active" style="font-size:0.65rem; color:#86efac; background:rgba(22,163,74,0.35); border:1px solid #16a34a; padding:1px 5px; border-radius:3px; font-weight:800; margin-left:4px; flex-shrink:0;">⚓ ${isEn ? 'ACTIVE' : 'ACTIVO'}</span>`
          : '';"""

dock_replacement = """        const isFan = !!s.is_fanmade;
        const fanBadge = isFan
          ? `<span class="badge-sub-fanmade" style="font-size:0.60rem; color:#fbbf24; background:rgba(245,158,11,0.25); border:1px solid #f59e0b; padding:1px 4px; border-radius:3px; font-weight:800; margin-left:4px; flex-shrink:0;">FANMADE</span>`
          : '';
        const activeTag = (isCommissioned
          ? `<span class="badge-sub-active" style="font-size:0.65rem; color:#86efac; background:rgba(22,163,74,0.35); border:1px solid #16a34a; padding:1px 5px; border-radius:3px; font-weight:800; margin-left:4px; flex-shrink:0;">⚓ ${isEn ? 'ACTIVE' : 'ACTIVO'}</span>`
          : '') + fanBadge;"""

if dock_target in dock_content:
    dock_content = dock_content.replace(dock_target, dock_replacement)
    print("✓ dock.js grid button updated with fanBadge")

dock_sub_target = """      const subTitleEl = document.getElementById('sub-subtitle');
      if (subTitleEl) {
        if (isCurrentlyActive) {
          subTitleEl.innerText = isEn 
            ? `${s.full_title || s.class_name} • [Active Commissioned Boat]`
            : `${s.full_title || s.class_name} • [Buque Activo Comisionado]`;
          subTitleEl.style.color = '#86efac';
        } else {
          subTitleEl.innerText = isEn
            ? `${s.full_title || s.class_name} • [Class Preview - Click to Assign]`
            : `${s.full_title || s.class_name} • [Vista Previa - Clic para Asignar]`;
          subTitleEl.style.color = 'var(--gold-400)';
        }
      }"""

dock_sub_replacement = """      const subTitleEl = document.getElementById('sub-subtitle');
      if (subTitleEl) {
        const fanPrefix = s.is_fanmade ? (isEn ? "⭐ [Historical Fanmade Variant] • " : "⭐ [Variante Histórica Fanmade] • ") : "";
        if (isCurrentlyActive) {
          subTitleEl.innerText = isEn 
            ? `${fanPrefix}${s.full_title || s.class_name} • [Active Commissioned Boat]`
            : `${fanPrefix}${s.full_title || s.class_name} • [Buque Activo Comisionado]`;
          subTitleEl.style.color = '#86efac';
        } else {
          subTitleEl.innerText = isEn
            ? `${fanPrefix}${s.full_title || s.class_name} • [Class Preview - Click to Assign]`
            : `${fanPrefix}${s.full_title || s.class_name} • [Vista Previa - Clic para Asignar]`;
          subTitleEl.style.color = s.is_fanmade ? '#fbbf24' : 'var(--gold-400)';
        }
      }"""

if dock_sub_target in dock_content:
    dock_content = dock_content.replace(dock_sub_target, dock_sub_replacement)
    print("✓ dock.js subtitle card updated with fanPrefix")

with open("app/js/dock.js", "w", encoding="utf-8") as f:
    f.write(dock_content)

# 5. Update app/i18n.js
with open("app/i18n.js", "r", encoding="utf-8") as f:
    i18n_content = f.read()

i18n_content = i18n_content.replace('navDock: "⚓ Submarinos (18)"', 'navDock: "⚓ Submarinos (24)"')
i18n_content = i18n_content.replace('navDock: "⚓ Submarines (18)"', 'navDock: "⚓ Submarines (24)"')

with open("app/i18n.js", "w", encoding="utf-8") as f:
    f.write(i18n_content)
print("✓ app/i18n.js navDock updated to 24")

# 6. Mirror files
for fn in ["data.js", "dock.js", "gameflow_phase0.js", "gameflow_phase4_5.js", "i18n.js"]:
    src = f"app/js/{fn}" if fn != "i18n.js" else "app/i18n.js"
    dst = f"app/js/components/{fn}"
    shutil.copyfile(src, dst)
    print(f"✓ Mirrored {src} -> {dst}")

print("All Fanmade updates applied cleanly!")
