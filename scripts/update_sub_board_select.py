import shutil

with open("app/js/sub_board.js", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update SUB_CLASS_NAMES_ES
old_es = '''  "Type_C3_Class": "Clase Tipo C-3 (Submarino de Transporte de Carga I-52)",
  "Type_A_Midget_Submarine___Ko_Hyoteki": "Tipo A Midget / Ko-Hyoteki (Sumergible Especial)"
};'''

new_es = '''  "Type_C3_Class": "Clase Tipo C-3 (Submarino de Transporte de Carga I-52)",
  "Type_A_Midget_Submarine___Ko_Hyoteki": "Tipo A Midget / Ko-Hyoteki (Sumergible Especial)",
  "Type_B2_Class": "Clase Type B2 (Crucero Submarino Serie I-40)",
  "Type_C2_Class": "Clase Type C2 (Submarino Ataque Pesado Serie I-46)",
  "Type_A2_Class": "Clase Type A2 (Submarino Portaaviones Seiran Serie I-13)",
  "Type_D1_Class": "Clase Type D1 (Submarino Transporte y Kaiten Serie I-361)",
  "Kaichu_VII_Class": "Clase Kaichu VII (Submarino Medio Flotilla Serie Ro-35)",
  "Junsen_J1_Class": "Clase Junsen J1 (Crucero Doble Cañón 140mm Serie I-1)"
};'''

content = content.replace(old_es, new_es)

# 2. Update SUB_CLASS_NAMES_EN
old_en = '''  "Type_C3_Class": "Type C-3 Class (Long-Range Cargo Submarine I-52)",
  "Type_A_Midget_Submarine___Ko_Hyoteki": "Type A Midget / Ko-Hyoteki (Special Attack Submersible)"
};'''

new_en = '''  "Type_C3_Class": "Type C-3 Class (Long-Range Cargo Submarine I-52)",
  "Type_A_Midget_Submarine___Ko_Hyoteki": "Type A Midget / Ko-Hyoteki (Special Attack Submersible)",
  "Type_B2_Class": "Type B2 Class (Cruiser Submarine I-40 Series)",
  "Type_C2_Class": "Type C2 Class (Heavy Attack Submarine I-46 Series)",
  "Type_A2_Class": "Type A2 Class (Seiran Carrier Submarine I-13 Series)",
  "Type_D1_Class": "Type D1 Class (Transport & Kaiten Submarine I-361 Series)",
  "Kaichu_VII_Class": "Kaichu VII Class (Medium Fleet Submarine Ro-35 Series)",
  "Junsen_J1_Class": "Junsen J1 Class (Twin 140mm Guns Cruiser Submarine I-1 Series)"
};'''

content = content.replace(old_en, new_en)

# 3. Update populateBoardSubSelect
old_fn = '''function populateBoardSubSelect() {
  const sel = document.getElementById('board-sub-select');
  if (!sel) return;
  const isEn = (window.currentLang === 'en');
  const names = isEn ? SUB_CLASS_NAMES_EN : SUB_CLASS_NAMES_ES;

  sel.innerHTML = '';
  const placeholderOpt = document.createElement('option');
  placeholderOpt.value = "";
  placeholderOpt.textContent = isEn ? "-- Select Submarine --" : "-- Selecciona Submarino --";
  if (!currentBoardSubKey) placeholderOpt.selected = true;
  sel.appendChild(placeholderOpt);

  for (const [k, name] of Object.entries(names)) {
    const opt = document.createElement('option');
    opt.value = k;
    opt.textContent = name;
    if (k === currentBoardSubKey) opt.selected = true;
    sel.appendChild(opt);
  }
}'''

new_fn = '''function populateBoardSubSelect() {
  const sel = document.getElementById('board-sub-select');
  if (!sel) return;
  const isEn = (window.currentLang === 'en');
  const subs = (typeof SUB_DB !== 'undefined' && SUB_DB.submarines) ? SUB_DB.submarines : {};

  sel.innerHTML = '';
  const placeholderOpt = document.createElement('option');
  placeholderOpt.value = "";
  placeholderOpt.textContent = isEn ? "-- Select Submarine --" : "-- Selecciona Submarino --";
  if (!currentBoardSubKey) placeholderOpt.selected = true;
  sel.appendChild(placeholderOpt);

  const officialGroup = document.createElement('optgroup');
  officialGroup.label = isEn ? "⚓ Official Submarines (Compass Games)" : "⚓ Submarinos Oficiales (Compass Games)";

  const fanmadeGroup = document.createElement('optgroup');
  fanmadeGroup.label = isEn ? "⭐ Real Historical Variants [Fanmade]" : "⭐ Variantes Históricas Reales [Fanmade]";

  for (const [k, sub] of Object.entries(subs)) {
    const opt = document.createElement('option');
    opt.value = k;
    const isFan = !!sub.is_fanmade;
    
    let label = isEn 
      ? (SUB_CLASS_NAMES_EN[k] || sub.full_title || sub.class_name)
      : (SUB_CLASS_NAMES_ES[k] || sub.full_title || sub.class_name);
    
    if (isFan && !label.includes('[Fanmade]')) {
      label += " [Fanmade]";
    }
    opt.textContent = label;
    if (isFan) opt.style.color = '#fbbf24';
    if (k === currentBoardSubKey) opt.selected = true;

    if (isFan) {
      fanmadeGroup.appendChild(opt);
    } else {
      officialGroup.appendChild(opt);
    }
  }

  if (officialGroup.children.length > 0) sel.appendChild(officialGroup);
  if (fanmadeGroup.children.length > 0) sel.appendChild(fanmadeGroup);
}'''

content = content.replace(old_fn, new_fn)

with open("app/js/sub_board.js", "w", encoding="utf-8") as f:
    f.write(content)

shutil.copyfile("app/js/sub_board.js", "app/js/components/sub_board.js")
print("✓ app/js/sub_board.js updated and mirrored to components!")
