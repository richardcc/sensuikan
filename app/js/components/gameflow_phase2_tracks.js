// =========================================================================
// SENSUiKAN: SUBMARINE PATROL & DAMAGE TRACK RENDERER
// Visual track renderer for submarine mats, stations, flooding and hull tracks.
// =========================================================================

function getTrackAssetUrl(relPath) {
  if (typeof window !== 'undefined' && typeof window.resolveAsset === 'function') {
    return window.resolveAsset(relPath);
  }
  return relPath;
}

// =========================================================================
// SENSUiKAN: GAME FLOW - PHASE 2: NAVIGATION & CANONICAL PATROL TRACK
// Official Submarine Mat track renderer, adaptive route stepper, encounter rolls A1-A4 & Ko-Hyoteki M5-M8 operations.
// =========================================================================

    // Shared track artwork definitions (matching official submarine mat cards)
    const TRACK_ARTWORK = {
      baseNaval: "assets/tracks/track_base_naval.jpg",
      transit: "assets/tracks/track_transit.jpg",
      station: "assets/tracks/track_station.jpg"
    };

    function renderSubmarinePatrolTrack(subKey) {
      const sub = (SUB_DB.submarines || {})[subKey];
      if (!sub) return;
      const isEn = (typeof currentLang !== "undefined" && currentLang === "en") || (typeof window !== "undefined" && window.currentLang === "en");

      const phases = sub.patrol_phases || ["Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Transit", "N/A", "N/A", "N/A"];
      const dmg = sub.damage_capacity || { flooding: 8, hull: 8 };

      const stCount = phases.filter(p => p && p.startsWith('Stat')).length;
      const sumBadge = document.getElementById('sub-mat-phases-summary');
      if (sumBadge) {
        if (subKey.includes('Midget')) {
          sumBadge.innerText = 'Operación Especial: 5 Fases';
        } else {
          sumBadge.innerText = isEn ? `Route: ${stCount} Stations (${phases.filter(p => p !== 'N/A').length} Boxes)` : `Ruta: ${stCount} Estaciones (${phases.filter(p => p !== 'N/A').length} Casillas)`;
        }
      }

      const dmgBadge = document.getElementById('sub-mat-damage-summary');
      if (dmgBadge) {
        dmgBadge.innerText = isEn ? `Capacity: ${dmg.flooding || 8} Flooding • ${dmg.hull || 8} Hull` : `Capacidad: ${dmg.flooding || 8} Inundación • ${dmg.hull || 8} Casco`;
      }

      const trackContainer = document.getElementById('sub-mat-patrol-track-row');
      if (!trackContainer) return;

      let html = '';

      // Box 0: At Port (Base Naval)
      html += `
        <div style="flex:1; min-width:86px; max-width:105px; height:136px; background:#0f172a; border:2px solid #b89f68; border-radius:6px; display:flex; flex-direction:column; justify-content:space-between; padding:4px; box-shadow:0 3px 8px rgba(0,0,0,0.4); box-sizing:border-box; overflow:hidden;">
          <div style="height:84px; position:relative; border-radius:4px; overflow:hidden; border:1px solid #334155; background:#1e293b; display:flex; align-items:center; justify-content:center;">
            <img src="${getTrackAssetUrl("assets/tracks/track_base_naval.jpg")}" onerror="this.style.display='none'" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; display:block;" alt="Base Naval">
            <div style="position:absolute; bottom:0; left:0; right:0; background:rgba(15,23,42,0.85); font-size:0.6rem; color:#fde047; font-weight:800; text-align:center; padding:2px 0; letter-spacing:0.5px; z-index:2;">${isEn ? "HOME PORT" : "BASE NAVAL"}</div>
          </div>
          <div style="background:#0b1320; border:1px solid #d4af37; border-radius:4px; padding:3px 2px; text-align:center; box-shadow:0 1px 3px rgba(0,0,0,0.6); margin-top:3px;">
            <span style="font-family:'Cinzel', serif; font-size:0.72rem; font-weight:800; color:#fde047; text-transform:uppercase; letter-spacing:0.5px; display:block;">${isEn ? "At Port" : "En Puerto"}</span>
          </div>
        </div>
      `;

      // Boxes 1 to 9 (patrol_phases)
      phases.forEach((phase, idx) => {
        if (!phase || phase === 'N/A') {
          html += `
            <div style="flex:1; min-width:86px; max-width:105px; height:136px; background:rgba(215,200,175,0.35); border:2px dashed #b8a98c; border-radius:6px; display:flex; flex-direction:column; justify-content:center; align-items:center; opacity:0.6; box-sizing:border-box;" title="Casilla inactiva en esta ruta">
              <span style="font-size:1.6rem; color:#8c7853; opacity:0.5;">—</span>
              <span style="font-family:'Cinzel', serif; font-size:0.68rem; font-weight:700; color:#8c7853; text-transform:uppercase; margin-top:4px;">N / A</span>
            </div>
          `;
        } else if (phase === 'Transit') {
          const isReturn = (idx > 1);
          html += `
            <div style="flex:1; min-width:86px; max-width:105px; height:136px; background:#0f172a; border:2px solid #2563eb; border-radius:6px; display:flex; flex-direction:column; justify-content:space-between; padding:4px; box-shadow:0 3px 8px rgba(0,0,0,0.4); box-sizing:border-box; overflow:hidden;">
              <div style="height:84px; position:relative; border-radius:4px; overflow:hidden; border:1px solid #1e3a8a; background:#1e293b; display:flex; align-items:center; justify-content:center;">
                <img src="${getTrackAssetUrl("assets/tracks/track_transit.jpg")}" onerror="this.style.display='none'" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; display:block;" alt="Transit">
                <div style="position:absolute; bottom:0; left:0; right:0; background:rgba(12,26,46,0.85); font-size:0.6rem; color:#93c5fd; font-weight:800; text-align:center; padding:2px 0; letter-spacing:0.5px; z-index:2;">${isReturn ? (isEn ? 'RETURN' : 'REGRESO') : (isEn ? 'OPEN SEAS' : 'ALTA MAR')}</div>
              </div>
              <div style="background:#0b1320; border:1px solid #d4af37; border-radius:4px; padding:3px 2px; text-align:center; box-shadow:0 1px 3px rgba(0,0,0,0.6); margin-top:3px;">
                <span style="font-family:'Cinzel', serif; font-size:0.72rem; font-weight:800; color:#fde047; text-transform:uppercase; letter-spacing:0.5px; display:block;">${isEn ? "Transit" : "Tránsito"}</span>
              </div>
            </div>
          `;
        } else if (phase.startsWith('Stat')) {
          const statNum = phase.replace('Stat', '').trim();
          html += `
            <div style="flex:1; min-width:86px; max-width:105px; height:136px; background:#0f172a; border:2px solid #059669; border-radius:6px; display:flex; flex-direction:column; justify-content:space-between; padding:4px; box-shadow:0 3px 8px rgba(0,0,0,0.4); box-sizing:border-box; overflow:hidden;">
              <div style="height:84px; position:relative; border-radius:4px; overflow:hidden; border:1px solid #065f46; background:#1e293b; display:flex; align-items:center; justify-content:center;">
                <img src="${getTrackAssetUrl("assets/tracks/track_station.jpg")}" onerror="this.style.display='none'" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; display:block;" alt="On Station">
                <div style="position:absolute; bottom:0; left:0; right:0; background:rgba(2,44,34,0.85); font-size:0.6rem; color:#6ee7b7; font-weight:800; text-align:center; padding:2px 0; letter-spacing:0.5px; z-index:2;">${isEn ? 'STAT ' : 'ESTACIÓN '}${statNum}</div>
              </div>
              <div style="background:#0b1320; border:1px solid #d4af37; border-radius:4px; padding:3px 2px; text-align:center; box-shadow:0 1px 3px rgba(0,0,0,0.6); margin-top:3px;">
                <span style="font-family:'Cinzel', serif; font-size:0.68rem; font-weight:800; color:#fde047; text-transform:uppercase; letter-spacing:0.3px; display:block;">${isEn ? "On Station" : "En Estación"}</span>
              </div>
            </div>
          `;
        } else {
          const specMap = {
            'Penetrate': 'penetrate',
            'Attack': 'attack',
            'Egress': 'egress',
            'Recover': 'recover'
          };
          const fileKey = specMap[phase] || 'station';
          html += `
            <div style="flex:1; min-width:86px; max-width:105px; height:136px; background:#0f172a; border:2px solid #ea580c; border-radius:6px; display:flex; flex-direction:column; justify-content:space-between; padding:4px; box-shadow:0 3px 8px rgba(0,0,0,0.4); box-sizing:border-box; overflow:hidden;">
              <div style="height:84px; position:relative; border-radius:4px; overflow:hidden; border:1px solid #7c2d12; background:#1e293b; display:flex; align-items:center; justify-content:center;">
                <img src="${getTrackAssetUrl("assets/tracks/track_" + fileKey + ".jpg")}" onerror="this.style.display='none'" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; display:block;" alt="${phase}">
                <div style="position:absolute; bottom:0; left:0; right:0; background:rgba(69,26,3,0.85); font-size:0.6rem; color:#fed7aa; font-weight:800; text-align:center; padding:2px 0; letter-spacing:0.5px; z-index:2;">${phase.toUpperCase()}</div>
              </div>
              <div style="background:#0b1320; border:1px solid #d4af37; border-radius:4px; padding:3px 2px; text-align:center; box-shadow:0 1px 3px rgba(0,0,0,0.6); margin-top:3px;">
                <span style="font-family:'Cinzel', serif; font-size:0.68rem; font-weight:800; color:#fde047; text-transform:uppercase; letter-spacing:0.3px; display:block;">Special Ops</span>
              </div>
            </div>
          `;
        }
      });

      trackContainer.innerHTML = html;

      // Damage Tracks: Flooding and Hull
      const dmgContainer = document.getElementById('sub-mat-damage-track-row');
      if (dmgContainer) {
        const maxFlood = dmg.flooding || 8;
        const maxHull = dmg.hull || 8;

        let floodBoxes = '';
        for (let i = 1; i <= 9; i++) {
          if (i <= maxFlood) {
            floodBoxes += `
              <div style="flex:1; min-width:38px; max-width:62px; height:54px; background:#0a192f; border:1.5px solid #3b82f6; border-radius:5px; position:relative; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,0.35);" title="${isEn ? 'Flooding Level ' + i : 'Inundación Nivel ' + i}">
                <img src="${getTrackAssetUrl("assets/tracks/track_flood_" + i + ".jpg")}" onerror="this.style.display='none'" style="width:100%; height:100%; object-fit:cover; display:block;" alt="Flood ${i}">
              </div>
            `;
          } else if (i === maxFlood + 1) {
            floodBoxes += `
              <div style="flex:1; min-width:38px; max-width:62px; height:54px; background:#0a192f; border:1.5px solid #f59e0b; border-radius:5px; position:relative; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,0.35);" title="${isEn ? 'Critical Flooding (Emergency Surface mandatory)' : 'Inundación Crítica (Superficie de Emergencia obligatoria)'}">
                <img src="${getTrackAssetUrl("assets/tracks/track_emergency.jpg")}" onerror="this.style.display='none'" style="width:100%; height:100%; object-fit:cover; display:block;" alt="Emergency Surface">
                <div style="position:absolute; bottom:2px; right:3px; background:rgba(15,23,42,0.92); border:1px solid #f59e0b; border-radius:3px; padding:0 3px; font-size:0.58rem; font-weight:900; color:#fde047; text-transform:uppercase; text-shadow:0 1px 2px #000; z-index:2; line-height:1.2;">${isEn ? "SURFACE" : "EMERG"}</div>
              </div>
            `;
          } else {
            floodBoxes += `
              <div style="flex:1; min-width:38px; max-width:62px; height:54px; background:rgba(215,200,175,0.35); border:1px dashed #b8a98c; border-radius:5px; display:flex; align-items:center; justify-content:center; color:#8c7853; font-size:0.75rem; opacity:0.5;">
                —
              </div>
            `;
          }
        }

        let hullBoxes = '';
        for (let i = 1; i <= 9; i++) {
          if (i <= maxHull) {
            hullBoxes += `
              <div style="flex:1; min-width:38px; max-width:62px; height:54px; background:#1c0a0a; border:1.5px solid #ef4444; border-radius:5px; position:relative; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,0.35);" title="${isEn ? 'Hull Damage ' + i : 'Daño de Casco ' + i}">
                <img src="${getTrackAssetUrl("assets/tracks/track_hull_" + i + ".jpg")}" onerror="this.style.display='none'" style="width:100%; height:100%; object-fit:cover; display:block;" alt="Hull ${i}">
              </div>
            `;
          } else if (i === maxHull + 1) {
            hullBoxes += `
              <div style="flex:1; min-width:38px; max-width:62px; height:54px; background:#1c0a0a; border:1.5px solid #991b1b; border-radius:5px; position:relative; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,0.35);" title="${isEn ? 'Lethal Hull Damage (Submarine Sunk)' : 'Daño de Casco Letal (Submarino Hundido)'}">
                <img src="${getTrackAssetUrl("assets/tracks/track_sunk.jpg")}" onerror="this.style.display='none'" style="width:100%; height:100%; object-fit:cover; display:block;" alt="Sunk">
                <div style="position:absolute; bottom:2px; right:3px; background:rgba(15,23,42,0.92); border:1px solid #ef4444; border-radius:3px; padding:0 3px; font-size:0.58rem; font-weight:900; color:#ef4444; text-transform:uppercase; text-shadow:0 1px 2px #000; z-index:2; line-height:1.2;">${isEn ? "SUNK" : "HUNDIDO"}</div>
              </div>
            `;
          } else {
            hullBoxes += `
              <div style="flex:1; min-width:38px; max-width:62px; height:54px; background:rgba(215,200,175,0.35); border:1px dashed #b8a98c; border-radius:5px; display:flex; align-items:center; justify-content:center; color:#8c7853; font-size:0.75rem; opacity:0.5;">
                —
              </div>
            `;
          }
        }

        dmgContainer.innerHTML = `
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="width:142px; display:flex; align-items:center; gap:8px; flex-shrink:0;">
              <div style="width:38px; height:38px; border-radius:5px; overflow:hidden; border:2px solid #2563eb; box-shadow:0 2px 5px rgba(0,0,0,0.4); flex-shrink:0; background:#0f172a; box-sizing:border-box;">
                <img src="${getTrackAssetUrl("assets/tracks/track_flood_marker.jpg")}" onerror="this.style.display='none'" style="width:100%; height:100%; object-fit:cover;" alt="Flooding Marker">
              </div>
              <div style="min-width:0; flex:1;">
                <div style="font-family:'Cinzel', serif; font-size:0.71rem; font-weight:800; color:#1e40af; line-height:1.2; white-space:nowrap; letter-spacing:0.3px;">${isEn ? "FLOODING" : "INUNDACIÓN"}</div>
                <div style="font-size:0.65rem; color:#64748b; font-weight:700;">${maxFlood} ${isEn ? "Levels" : "Niveles"}</div>
              </div>
            </div>
            <div style="display:flex; gap:6px; flex:1;">${floodBoxes}</div>
          </div>
          <div style="display:flex; align-items:center; gap:8px; margin-top:6px;">
            <div style="width:142px; display:flex; align-items:center; gap:8px; flex-shrink:0;">
              <div style="width:38px; height:38px; border-radius:5px; overflow:hidden; border:2px solid #b91c1c; box-shadow:0 2px 5px rgba(0,0,0,0.4); flex-shrink:0; background:#0f172a; box-sizing:border-box;">
                <img src="${getTrackAssetUrl("assets/tracks/track_hull_marker.jpg")}" onerror="this.style.display='none'" style="width:100%; height:100%; object-fit:cover;" alt="Hull Damage Marker">
              </div>
              <div style="min-width:0; flex:1;">
                <div style="font-family:'Cinzel', serif; font-size:0.71rem; font-weight:800; color:#991b1b; line-height:1.2; white-space:nowrap; letter-spacing:0.3px;">${isEn ? "HULL HITS" : "CASCO"}</div>
                <div style="font-size:0.65rem; color:#64748b; font-weight:700;">${maxHull} ${isEn ? "Hits" : "Daños"}</div>
              </div>
            </div>
            <div style="display:flex; gap:6px; flex:1;">${hullBoxes}</div>
          </div>
        `;
      }
    }

    // =========================================================================
    // CANONICAL PATROL TRACK GENERATOR (BASED ON OFFICIAL SUBMARINE MAT)
    // =========================================================================

if (typeof window !== 'undefined') {
  window.renderSubmarinePatrolTrack = renderSubmarinePatrolTrack;
  window.getTrackAssetUrl = getTrackAssetUrl;
}
