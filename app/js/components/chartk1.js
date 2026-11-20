// =========================================================================
// SENSUiKAN: CHART K1 SKILLS & IJN OFFICER TRACKS
// Command hierarchy, skills, tokens, medals and uniform rank tracks.
// =========================================================================

    function toggleToken(tokenId) {
      campaignState.tokens[tokenId] = !campaignState.tokens[tokenId];
      renderTokens();
      saveState();
      showToast("Ficha actualizada: " + tokenId);
    }

    function getRankChitImage(rankIdx) {
      const map = [
        'assets/tokens/Rank_SubLt.jpg',
        'assets/tokens/Rank_Lt.jpg',
        'assets/tokens/Rank1.jpg',
        'assets/tokens/Rank2.jpg',
        'assets/tokens/Rank3.jpg',
        'assets/tokens/Rank_RearAdmiral.jpg'
      ];
      const p = map[rankIdx] || map[2];
      return (typeof resolveAsset === 'function') ? resolveAsset(p) : p;
    }

    function cycleRank() {
      campaignState.currentRankIdx = (campaignState.currentRankIdx + 1) % RANKS.length;
      document.getElementById('rank-text').innerText = RANKS[campaignState.currentRankIdx];
      const rankImg = document.getElementById('k1-rank-chit-img');
      if (rankImg) rankImg.src = getRankChitImage(campaignState.currentRankIdx);
      saveState();
      showToast("Rango actualizado: " + RANKS[campaignState.currentRankIdx]);
    }

    
    function highlightSchoolBox(elementId, styleType) {
      const el = document.getElementById(elementId);
      if (!el) return;
      document.querySelectorAll('.sch-table-row, .sch-depth-box, .sch-m-row').forEach(node => {
        node.style.boxShadow = '';
        node.style.backgroundColor = '';
      });
      if (styleType === 'green') {
        el.style.backgroundColor = 'rgba(16, 185, 129, 0.45)';
        el.style.boxShadow = '0 0 14px rgba(16, 185, 129, 0.85)';
        el.style.borderColor = '#34d399';
      } else if (styleType === 'red') {
        el.style.backgroundColor = 'rgba(239, 68, 68, 0.45)';
        el.style.boxShadow = '0 0 14px rgba(239, 68, 68, 0.85)';
        el.style.borderColor = '#f87171';
      } else {
        el.style.backgroundColor = 'rgba(217, 119, 6, 0.45)';
        el.style.boxShadow = '0 0 14px rgba(245, 158, 11, 0.85)';
        el.style.borderColor = 'var(--gold-400)';
      }
    }

    function setK1Token(tokenKey, active) {
      const clean = tokenKey.replace(/^token-/, '');
      campaignState.tokens[clean] = !!active;
      campaignState.tokens['token-' + clean] = !!active;
    }

    function toggleKaitenPilot(pilotNum) {
      if (!Array.isArray(campaignState.kaitenPilots)) campaignState.kaitenPilots = [];
      let pilotObj = campaignState.kaitenPilots.find(p => p.pilot === pilotNum);
      const cycle = ['senninbari', 'hachimaki', 'ashes', ''];
      if (!pilotObj) {
        pilotObj = { pilot: pilotNum, benefit: 'senninbari' };
        campaignState.kaitenPilots.push(pilotObj);
      } else {
        const curIdx = cycle.indexOf(pilotObj.benefit || '');
        pilotObj.benefit = cycle[(curIdx + 1) % cycle.length];
      }
      const sel = document.getElementById(`sel-f4-pilot-${pilotNum}`);
      if (sel) {
        sel.value = pilotObj.benefit || 'senninbari';
      }
      renderTokens();
      saveState();
      const isEn = (window.currentLang === 'en');
      const benefitLabels = {
        senninbari: isEn ? "Senninbari Belt (+1 drm)" : "Cinturón Senninbari (+1 drm)",
        hachimaki: isEn ? "Hachimaki Headband (Reroll)" : "Cinta Hachimaki (Repite tirada)",
        ashes: isEn ? "Classmates' Ashes (Immune Attack)" : "Cenizas Compañeros (Inmune Ataque)"
      };
      const name = pilotObj.benefit && benefitLabels[pilotObj.benefit] ? benefitLabels[pilotObj.benefit] : (isEn ? 'Unassigned' : 'Sin asignar');
      showToast((isEn ? 'Kaiten Pilot #' : 'Piloto Kaiten #') + pilotNum + ': ' + name);
    }

    function renderTokens() {
      const rankEl = document.getElementById('rank-text');
      if (rankEl && RANKS[campaignState.currentRankIdx]) {
        rankEl.innerText = RANKS[campaignState.currentRankIdx];
      }
      const rankImg = document.getElementById('k1-rank-chit-img');
      if (rankImg) {
        rankImg.src = getRankChitImage(campaignState.currentRankIdx);
      }

      // Iterate through every standard token slot on Chart K1
      document.querySelectorAll('.wargame-token').forEach(el => {
        const id = el.id; // e.g. "token-cap-torp"
        if (!id || id === 'token-rank' || id.startsWith('token-kaiten-')) return;
        const clean = id.replace(/^token-/, ''); // e.g. "cap-torp"

        const isActive = !!(campaignState.tokens[clean] || campaignState.tokens[id]);
        if (isActive) {
          el.classList.remove('inactive');
          el.classList.add('active');
        } else {
          el.classList.remove('active');
          el.classList.add('inactive');
        }
      });

      // Render Kaiten pilot tokens (Escuela F4 Otsujima)
      const benefitLabels = {
        senninbari: { es: "Senninbari (+1 drm)", en: "Senninbari (+1 drm)" },
        hachimaki: { es: "Hachimaki (Repite tirada)", en: "Hachimaki (Reroll)" },
        ashes: { es: "Cenizas Compañeros", en: "Classmates' Ashes" }
      };
      const kaitenBenefitImages = {
        senninbari: 'assets/tokens/Senninhari.jpg',
        hachimaki: 'assets/tokens/Hachimaki.jpg',
        ashes: 'assets/tokens/Blessings of the Emperor.jpg'
      };
      const isEn = (window.currentLang === 'en');
      const kaitenTitleEl = document.getElementById('k1-kaiten-title');
      if (kaitenTitleEl) {
        kaitenTitleEl.innerText = isEn
          ? "Kaiten Suicide Torpedo Pilots • Spiritual Benefits [School F4 Otsujima]"
          : "Pilotos de Torpedos Suicidas Kaiten • Beneficios Espirituales [Escuela F4 Otsujima]";
      }

      for (let i = 1; i <= 6; i++) {
        const tokEl = document.getElementById(`token-kaiten-${i}`);
        const lblEl = document.getElementById(`lbl-kaiten-benefit-${i}`);
        const imgEl = document.getElementById(`img-kaiten-${i}`);
        if (!tokEl || !lblEl) continue;

        let benefit = '';
        if (Array.isArray(campaignState.kaitenPilots)) {
          const kp = campaignState.kaitenPilots.find(p => p.pilot === i);
          if (kp && kp.benefit) benefit = kp.benefit;
        }
        if (!benefit) {
          const sel = document.getElementById(`sel-f4-pilot-${i}`);
          if (sel && sel.value) benefit = sel.value;
        }

        if (benefit && benefitLabels[benefit]) {
          lblEl.innerText = isEn ? benefitLabels[benefit].en : benefitLabels[benefit].es;
          if (imgEl && kaitenBenefitImages[benefit]) {
            imgEl.src = kaitenBenefitImages[benefit];
          }
          tokEl.classList.remove('inactive');
          tokEl.classList.add('active');
        } else {
          lblEl.innerText = isEn ? "Unassigned" : "Sin Asignar";
          if (imgEl) {
            imgEl.src = `assets/tokens/Kaiten-${i}.jpg`;
          }
          tokEl.classList.remove('active');
          tokEl.classList.add('inactive');
        }
      }

      // Check submarine aircraft capabilities to update air crew section on K1
      const sub = (typeof SUB_DB !== 'undefined' && SUB_DB && SUB_DB.submarines && campaignState.activeSubKey)
        ? SUB_DB.submarines[campaignState.activeSubKey]
        : ((typeof SUBMARINES_DB !== 'undefined' && campaignState.activeSubKey) ? SUBMARINES_DB[campaignState.activeSubKey] : null);
      const hasPlane = Boolean(sub && (sub.has_aircraft === true || sub.aircraft_type || sub.plane === 1));
      const hasKaiten = Boolean(sub && (sub.has_kaiten === true || (sub.kaiten_note && sub.kaiten_note.toLowerCase().includes('kaiten'))));
      const planeName = sub ? (sub.aircraft_type || sub.plane_class || 'Yokosuka E14Y Glen') : 'E14Y Glen';

      const air1Sec = document.getElementById('k1-sec-air1');
      if (air1Sec) {
        if (hasPlane) {
          air1Sec.innerText = isEn ? `Air Crew (${planeName} #1)` : `Dotación Aérea (${planeName} #1)`;
          air1Sec.style.opacity = "1";
        } else {
          air1Sec.innerText = isEn ? "Air Crew (No Floatplane on Submarine)" : "Dotación Aérea (Sin Hidroavión en este Submarino)";
          air1Sec.style.opacity = "0.5";
        }
      }
      ['token-air1-weap', 'token-air1-maint', 'token-air1-acm', 'token-air1-nav'].forEach(tokId => {
        const tokEl = document.getElementById(tokId);
        if (tokEl) {
          if (!hasPlane) {
            tokEl.style.opacity = "0.35";
            tokEl.style.pointerEvents = "none";
          } else {
            tokEl.style.opacity = "";
            tokEl.style.pointerEvents = "";
          }
        }
      });

      // Update Kaiten pilots strip on K1 based on submarine capability
      const kaitenStrip = document.getElementById('k1-kaiten-strip');
      if (kaitenStrip) {
        if (hasKaiten) {
          kaitenStrip.style.opacity = "1";
          kaitenStrip.style.pointerEvents = "auto";
        } else {
          kaitenStrip.style.opacity = "0.4";
          kaitenStrip.style.pointerEvents = "none";
          if (kaitenTitleEl) {
            kaitenTitleEl.innerText = isEn
              ? "Kaiten Suicide Torpedoes (Not Available on this Submarine Class)"
              : "Torpedos Suicidas Kaiten (Sin Capacidad Kaiten en este Submarino)";
          }
        }
      }
    }

    if (typeof window !== 'undefined') {
      window.toggleKaitenPilot = toggleKaitenPilot;
    }

    // =========================================================================
    // ROGU BUKKU LOGIC (OFFICIAL SENSUiKAN SUBMARINE PATROL LOG AUTO-GENERATION)
    // =========================================================================

