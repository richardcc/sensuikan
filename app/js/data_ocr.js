// =========================================================================
// SENSUiKAN: OCR CHART TRANSCRIPTS & REFERENCE TEMPLATES
// Authentic rules & charts transcriptions for tactical lookup.
// =========================================================================

const OCR_CHART_TEMPLATES = {
            "F1": `<div class="ocr-board-f1" style="background:#0f172a; border:2px solid #eab308; border-radius:10px; padding:16px; color:#f1f5f9; font-family:'Segoe UI', Roboto, sans-serif; box-shadow:0 8px 30px rgba(0,0,0,0.7);">
  <!-- HEADER -->
  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #eab308; padding-bottom:8px; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
    <div>
      <span style="background:#b91c1c; color:#fff; font-size:0.75rem; font-weight:900; padding:3px 8px; border-radius:4px; letter-spacing:1px;">REGLA 4.8</span>
      <h2 style="margin:4px 0 0 0; font-family:'Cinzel', serif; font-size:1.35rem; color:#fde047;">CHART F1: SUBMARINE SCHOOL (KURE)</h2>
      <div style="font-size:0.8rem; color:#94a3b8;">Escuela Naval de Submarinos de Kure • Formación de Oficiales y Especialidades</div>
    </div>
    <div style="display:flex; gap:8px;">
      <button type="button" onclick="openModalViewer('Tablas B1 a B6 (Combate)', '', 'B1_B6')" class="action-btn" style="border-color:#ef4444; color:#fca5a5; font-size:0.75rem; padding:4px 10px;">🎯 Ver Tablas B1 / B6</button>
    </div>
  </div>

  <!-- CONTENT GRID -->
  <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
    <!-- Captain & XO -->
    <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:12px;">
      <h4 style="margin:0 0 8px 0; color:#38bdf8; font-size:0.95rem; border-bottom:1px solid #334155; padding-bottom:4px;">1. CAPTAIN (Koshu gakusei) - TORPEDO TRAINING</h4>
                <p style="font-size:0.8rem; margin:0 0 6px 0; color:#cbd5e1;"><strong>Tirada:</strong> 3 tiradas de 2d6 en <strong>Tabla [B1]</strong> (Larga Distancia). En Sensuikan <em>la tirada baja impacta</em>: <strong>2 a 6 es impacto</strong> (&le; 6).</p>
                <p style="font-size:0.8rem; margin:0 0 8px 0; color:#cbd5e1;"><strong>Éxito (&ge; 2 impactos):</strong> Gana la ficha <em>Torpedo Gunnery</em> en Chart [K1] (permite repetir 1 tirada de torpedo fallido en [B1] por patrulla, Regla 8.7.1).</p>
                <h4 style="margin:12px 0 8px 0; color:#38bdf8; font-size:0.95rem; border-bottom:1px solid #334155; padding-bottom:4px;">2. EXECUTIVE OFFICER (XO Otsushu) - DECK GUN TRAINING</h4>
                <p style="font-size:0.8rem; margin:0 0 6px 0; color:#cbd5e1;"><strong>Tirada:</strong> 3 tiradas de 2d6 en <strong>Tabla [B1]</strong> (Larga Distancia: <strong>2 a 6 es impacto</strong>).</p>
                <p style="font-size:0.8rem; margin:0 0 8px 0; color:#cbd5e1;"><strong>Éxito (&ge; 2 impactos):</strong> Gana la ficha <em>Deck Gun Expert</em> en Chart [K1] (-1 a todas las tiradas de impacto de cañón de cubierta en [B1], Regla 8.7.1).</p>
                </div>

    <!-- Engineer & Navigator -->
    <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:12px;">
      <h4 style="margin:0 0 8px 0; color:#38bdf8; font-size:0.95rem; border-bottom:1px solid #334155; padding-bottom:4px;">3. ENGINEER - JUDGMENT TRAINING</h4>
                <p style="font-size:0.8rem; margin:0 0 6px 0; color:#cbd5e1;"><strong>Tirada [Regla 8.2.6]:</strong> Simulando daño acumulado de casco en 3 pruebas (3, 4 y 5 daños). Tira 2d6: si el resultado es <strong>menor que el daño acumulado</strong> (&lt; D), el barco implosiona. Si es &ge; D, supera la prueba.</p>
                <p style="font-size:0.8rem; margin:0 0 8px 0; color:#cbd5e1;"><strong>Éxito (sin implosión en las 3 pruebas):</strong> Gana la ficha <em>Keen Judgment</em> en Chart [K1] (el 1.er exceso de profundidad de prueba en cada patrulla no produce daño al casco, Regla 8.7.1).</p>
                <h4 style="margin:12px 0 8px 0; color:#38bdf8; font-size:0.95rem; border-bottom:1px solid #334155; padding-bottom:4px;">4. NAVIGATOR - ESPECIALIDAD K1</h4>
      <p style="font-size:0.8rem; margin:0; color:#cbd5e1;">Elige libremente 1 habilidad de la tripulación en Chart [K1] (<em>Torpedo Expert</em>, <em>Expert Lookout</em>, <em>Silent Runner</em>, etc.).</p>
    </div>
  </div>

  <!-- SPARE TIME ACTIVITIES & GRADUATION -->
  <div style="margin-top:14px; background:#1e293b; border:1px solid #334155; border-radius:8px; padding:12px;">
    <h4 style="margin:0 0 6px 0; color:#fde047; font-size:0.95rem;">ACTIVIDADES DE TIEMPO LIBRE DEL CAPITÁN (SPARE TIME)</h4>
    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; font-size:0.78rem;">
      <div style="background:#0f172a; padding:8px; border-radius:4px; border-left:3px solid #eab308;">
        <strong style="color:#fde047;">1. Kendo / Martial Arts:</strong> Gana la ficha <em>Shibumi</em> (permite superar automáticamente 1 tirada de dados por patrulla).
      </div>
      <div style="background:#0f172a; padding:8px; border-radius:4px; border-left:3px solid #38bdf8;">
        <strong style="color:#38bdf8;">2. Extra Study Time:</strong> 1 mejora de submarino gratis y -2 al primer intento de ascenso militar.
      </div>
      <div style="background:#0f172a; padding:8px; border-radius:4px; border-left:3px solid #22c55e;">
        <strong style="color:#22c55e;">3. Gosei (Meditación):</strong> Inicia con el amuleto de la buena suerte <em>Maneki Neko</em> a bordo (permite repetir cualquier tirada de dados de 1d6 o 2d6).
      </div>
    </div>
    <div style="margin-top:10px; font-size:0.78rem; color:#94a3b8; border-top:1px solid #334155; padding-top:6px;">
      🎖️ <strong>Graduación en Kure:</strong> Se coloca la insignia <strong>Sub Badge</strong> en el uniforme en Chart [K1].
    </div>
  </div>
</div>`,

      "F2_F3": `<div class="ocr-board-f2-f3" style="background:#0f172a; border:2px solid #38bdf8; border-radius:10px; padding:16px; color:#f1f5f9; font-family:'Segoe UI', Roboto, sans-serif; box-shadow:0 8px 30px rgba(0,0,0,0.7);">
  <!-- HEADER -->
  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #38bdf8; padding-bottom:8px; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
    <div>
      <span style="background:#0369a1; color:#fff; font-size:0.75rem; font-weight:900; padding:3px 8px; border-radius:4px; letter-spacing:1px;">ESCUELAS ESPECIALES</span>
      <h2 style="margin:4px 0 0 0; font-family:'Cinzel', serif; font-size:1.35rem; color:#38bdf8;">CHART F2 &amp; F3: MIDGET SUB &amp; NAVAL AIR SCHOOL</h2>
      <div style="font-size:0.8rem; color:#94a3b8;">Escuela de Minisubmarinos Ko-Hyoteki [F2] y Escuela Naval de Aviación de Kasumigaura [F3]</div>
    </div>
    <div style="display:flex; gap:8px;">
      <button type="button" onclick="openModalViewer('Tablas M5 a M7', '', 'M5_M7')" class="action-btn" style="border-color:#38bdf8; color:#38bdf8; font-size:0.75rem; padding:4px 10px;">⚓ Ver Tablas M5 a M7</button>
    </div>
  </div>

  <!-- 2 COLUMNS: F2 & F3 -->
  <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
    <!-- CHART F2: MIDGET SUB -->
    <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:12px;">
      <h3 style="margin:0 0 8px 0; color:#ef4444; font-size:1.05rem; border-bottom:1px solid #334155; padding-bottom:4px;">🤿 CHART F2: MIDGET SUBMARINE SCHOOL</h3>
      
      <div style="margin-bottom:10px;">
        <h4 style="margin:0 0 4px 0; color:#fde047; font-size:0.85rem;">1. TORPEDO TRAINING</h4>
        <p style="font-size:0.78rem; margin:0; color:#cbd5e1;">3 tiradas en <strong>Tabla [B1]</strong> a Larga Distancia. Si &ge; 2 impactos (2 a 6 / &le; 6) ➔ gana la ficha <em>Midget Torpedo Gunnery</em>.</p>
      </div>

      <div style="margin-bottom:10px;">
        <h4 style="margin:0 0 4px 0; color:#fde047; font-size:0.85rem;">2. COMMUNICATIONS</h4>
        <p style="font-size:0.78rem; margin:0; color:#cbd5e1;">2 tiradas en Tabla de Recuperación <strong>[M7]</strong>. Si no hay fallos ➔ gana <em>Superior Comms (+1 drm en recuperación)</em>.</p>
      </div>

      <div>
        <h4 style="margin:0 0 4px 0; color:#fde047; font-size:0.85rem;">3. BOAT HANDLING / NET INFILTRATION</h4>
        <p style="font-size:0.78rem; margin:0; color:#cbd5e1;">3 tiradas en Tabla de Redes <strong>[M5]</strong>. Si ningún resultado es 2–4 ➔ gana <em>Boat Handling (resultado 4 en M5 = Cruza la red)</em>.</p>
      </div>
    </div>

    <!-- CHART F3: KASUMIGAURA AIR SCHOOL -->
    <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:12px;">
      <h3 style="margin:0 0 8px 0; color:#38bdf8; font-size:1.05rem; border-bottom:1px solid #334155; padding-bottom:4px;">🛩️ CHART F3: KASUMIGAURA NAVAL AIR SCHOOL</h3>
      <p style="font-size:0.76rem; color:#94a3b8; margin:0 0 8px 0;">Elige hasta 2 especialidades para el hidroavión de reconocimiento embarcado:</p>

      <div style="display:flex; flex-direction:column; gap:8px; font-size:0.78rem; color:#cbd5e1;">
        <div style="background:#0f172a; padding:6px 8px; border-radius:4px; border-left:3px solid #38bdf8;">
          <strong style="color:#93c5fd;">• Weapons Expert:</strong> +1 al bombardeo aéreo; ametralladora trasera a -1 to-hit.
        </div>
        <div style="background:#0f172a; padding:6px 8px; border-radius:4px; border-left:3px solid #22c55e;">
          <strong style="color:#86efac;">• Flawless Maintenance:</strong> Repite 1 fallo mecánico / percance por misión de vuelo.
        </div>
        <div style="background:#0f172a; padding:6px 8px; border-radius:4px; border-left:3px solid #eab308;">
          <strong style="color:#fde047;">• Air Combat Maneuvering (ACM):</strong> El primer daño recibido en combate aéreo se reduce en 1.
        </div>
        <div style="background:#0f172a; padding:6px 8px; border-radius:4px; border-left:3px solid #a855f7;">
          <strong style="color:#c084fc;">• Aerial Navigation:</strong> Tirada de recuperación del hidroavión recibe +1 DRM permanente.
        </div>
      </div>
    </div>
  </div>
</div>`,
      "B1_B6": `<div class="ocr-board-b1-b6" style="background:#0f172a; border:2px solid #38bdf8; border-radius:10px; padding:16px; color:#f1f5f9; font-family:'Segoe UI', Roboto, sans-serif; box-shadow:0 8px 30px rgba(0,0,0,0.7);">
  <!-- BOARD HEADER -->
  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #38bdf8; padding-bottom:8px; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
    <div style="display:flex; align-items:center; gap:12px;">
      <span style="background:#b91c1c; color:#fff; font-size:0.75rem; font-weight:900; padding:3px 8px; border-radius:4px; letter-spacing:1px;">AYUDA TÁCTICA IJN</span>
      <div>
        <h2 style="margin:0; font-family:'Cinzel', serif; font-size:1.35rem; color:#fde047; letter-spacing:1px; line-height:1.2;">SENSUIKAN <span style="font-size:0.85rem; color:#94a3b8; font-weight:normal;">(Submarinos de Flota Japoneses 1941–45)</span></h2>
        <div style="font-size:0.75rem; color:#38bdf8; font-weight:600;">TABLAS DE COMBATE Y DAÑOS: B1 A B6 (TRANSCRIPCIÓN DIGITAL OFICIAL)</div>
      </div>
    </div>
    <div style="display:flex; gap:6px; align-items:center;">
      <span style="font-size:0.72rem; color:#94a3b8; background:rgba(0,0,0,0.4); padding:3px 8px; border-radius:4px; border:1px solid #334155;">Oficial Compass Games</span>
    </div>
  </div>

  <!-- TOP ROW: CHART B1 & CHART B2 -->
  <div style="display:grid; grid-template-columns: 2fr 1fr; gap:14px; margin-bottom:14px;">
    <!-- CHART B1: TO HIT -->
    <div style="background:#1e293b; border:1px solid #475569; border-radius:8px; padding:12px; border-top:3px solid #fde047;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <h3 style="margin:0; font-size:1rem; color:#fde047; font-weight:800; display:flex; align-items:center; gap:6px;">
          <span>TABLA [B1]</span> <span>DISPARO DE TORPEDOS Y CAÑÓN DE CUBIERTA (IMPACTO)</span>
        </h3>
        <span style="background:#0f172a; border:1px solid #64748b; color:#fde047; font-size:0.75rem; font-weight:bold; padding:2px 8px; border-radius:4px;">🎲 2d6 (Tirada Baja)</span>
      </div>

      <!-- Range Boxes -->
      <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:8px; margin-bottom:10px; text-align:center;">
        <div style="background:#0f172a; border:1px solid #38bdf8; border-radius:6px; padding:6px;">
          <div style="font-size:0.75rem; color:#7dd3fc; font-weight:bold;">Corta (Close)</div>
          <div style="font-size:0.68rem; color:#94a3b8;">0 – 1,500 m</div>
          <div style="font-size:1.1rem; color:#4ade80; font-weight:900; margin:2px 0;">2–8 <span style="font-size:0.75rem; color:#a7f3d0;">Impacto</span></div>
          <div style="font-size:0.7rem; color:#f87171;">9–12 Fallo</div>
        </div>
        <div style="background:#0f172a; border:1px solid #38bdf8; border-radius:6px; padding:6px;">
          <div style="font-size:0.75rem; color:#7dd3fc; font-weight:bold;">Media (Medium)</div>
          <div style="font-size:0.68rem; color:#94a3b8;">1,500 – 3,000 m</div>
          <div style="font-size:1.1rem; color:#4ade80; font-weight:900; margin:2px 0;">2–7 <span style="font-size:0.75rem; color:#a7f3d0;">Impacto</span></div>
          <div style="font-size:0.7rem; color:#f87171;">8–12 Fallo</div>
        </div>
        <div style="background:#0f172a; border:1px solid #38bdf8; border-radius:6px; padding:6px;">
          <div style="font-size:0.75rem; color:#7dd3fc; font-weight:bold;">Larga (Long) ★</div>
          <div style="font-size:0.68rem; color:#94a3b8;">&gt; 3,000 m</div>
          <div style="font-size:1.1rem; color:#4ade80; font-weight:900; margin:2px 0;">2–6 <span style="font-size:0.75rem; color:#a7f3d0;">Impacto</span></div>
          <div style="font-size:0.7rem; color:#f87171;">7–12 Fallo</div>
        </div>
      </div>

      <!-- Modifiers -->
      <div style="background:#0f172a; border-radius:6px; padding:8px; font-size:0.75rem;">
        <div style="font-weight:bold; color:#cbd5e1; margin-bottom:4px;">Modificadores a la Tirada de Impacto (DRM):</div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:4px 10px; color:#94a3b8;">
          <div><strong style="color:#4ade80;">-1</strong> Torpedo en superficie nocturno</div>
          <div><strong style="color:#f87171;">+1</strong> Torpedo Tipo 92 a Media Distancia</div>
          <div><strong style="color:#f87171;">+1</strong> Comandante Muerto (KIA) o Grave (SW)</div>
          <div><strong style="color:#f87171;">+2</strong> Torpedo Tipo 92 a Larga Distancia</div>
          <div><strong style="color:#4ade80;">-1</strong> Torpedo de Minisubmarino</div>
          <div><strong style="color:#f87171;">+1</strong> Buque Capital Rápido (Fast Capital)</div>
          <div><strong style="color:#f87171;">+1</strong> Dotación Novata (Green Crew)</div>
          <div><strong style="color:#f87171;">+2</strong> Disparo a Escolta / Destructor / DE</div>
        </div>
        <div style="margin-top:6px; padding-top:4px; border-top:1px dashed #334155; color:#fde047; font-weight:700; font-size:0.72rem;">
          ★ Tirada natural de "2" con torpedos = Impacto Crítico (si no es inerte): +3 daños adicionales.
        </div>
      </div>
    </div>

    <!-- CHART B2: DUD -->
    <div style="background:#1e293b; border:1px solid #475569; border-radius:8px; padding:12px; border-top:3px solid #f87171; display:flex; flex-direction:column; justify-content:space-between;">
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <h3 style="margin:0; font-size:1rem; color:#f87171; font-weight:800; display:flex; align-items:center; gap:6px;">
            <span>TABLA [B2]</span> <span>TORPEDOS INERTES (DUDS)</span>
          </h3>
          <span style="background:#0f172a; border:1px solid #64748b; color:#f87171; font-size:0.75rem; font-weight:bold; padding:2px 8px; border-radius:4px;">🎲 1d6</span>
        </div>
        <div style="background:#0f172a; border-radius:6px; padding:8px; font-size:0.78rem; color:#cbd5e1; margin-bottom:10px;">
          Todos los modelos fallan o resultan inertes con una tirada de <strong style="color:#ef4444; font-size:0.95rem;">"1"</strong> en 1d6. De 2 a 6 detonan con normalidad.
        </div>
      </div>

      <!-- Special A/C Attack -->
      <div style="background:#0f172a; border:1px solid #991b1b; border-radius:6px; padding:8px; font-size:0.74rem;">
        <div style="color:#fca5a5; font-weight:bold; margin-bottom:3px; display:flex; justify-content:space-between;">
          <span>Ataque Aéreo Especial FIDO (desde 5/44)</span>
          <span style="color:#fde047;">🎲 1d6</span>
        </div>
        <div style="color:#94a3b8; font-size:0.7rem; margin-bottom:4px;">Avión enemigo lanza torpedo acústico guiado FIDO. Tirar 1d6:</div>
        <div style="display:flex; justify-content:space-between; text-align:center;">
          <span style="background:#450a0a; color:#f87171; padding:2px 6px; border-radius:4px;"><strong>1</strong> = Hundido</span>
          <span style="background:#451a03; color:#fdba74; padding:2px 6px; border-radius:4px;"><strong>2</strong> = 7 impactos</span>
          <span style="background:#0f172a; color:#94a3b8; padding:2px 6px; border-radius:4px; border:1px solid #334155;"><strong>3–6</strong> = Fallo / Inerte</span>
        </div>
      </div>
    </div>
  </div>

  <!-- MIDDLE ROW: 3 COLUMNS (CHART B3, CHART B4, CHART B5) -->
  <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:14px; margin-bottom:14px;">
    
    <!-- CHART B3: ATTACK DAMAGE -->
    <div style="background:#1e293b; border:1px solid #475569; border-radius:8px; padding:12px; border-top:3px solid #38bdf8;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <h3 style="margin:0; font-size:0.92rem; color:#38bdf8; font-weight:800;">TABLA [B3]: DAÑOS AL BLANCO</h3>
        <span style="background:#0f172a; border:1px solid #64748b; color:#38bdf8; font-size:0.72rem; font-weight:bold; padding:2px 6px; border-radius:4px;">🎲 1d6</span>
      </div>

      <table style="width:100%; border-collapse:collapse; font-size:0.72rem; text-align:center; margin-bottom:8px;">
        <thead>
          <tr style="background:#0f172a; color:#fde047;">
            <th style="padding:4px; border:1px solid #334155;">1d6</th>
            <th style="padding:4px; border:1px solid #334155;">Torpedo</th>
            <th style="padding:4px; border:1px solid #334155;">Cañón Cubierta</th>
          </tr>
        </thead>
        <tbody style="color:#e2e8f0;">
          <tr style="border-bottom:1px solid #334155;"><td><strong>1</strong></td><td style="color:#f87171; font-weight:bold;">4 Daños</td><td style="color:#fdba74; font-weight:bold;">3 Daños</td></tr>
          <tr style="border-bottom:1px solid #334155;"><td><strong>2</strong></td><td style="color:#fdba74; font-weight:bold;">3 Daños</td><td style="color:#fde047;">2 Daños</td></tr>
          <tr style="border-bottom:1px solid #334155;"><td><strong>3</strong></td><td style="color:#fdba74; font-weight:bold;">3 Daños</td><td style="color:#fde047;">2 Daños</td></tr>
          <tr style="border-bottom:1px solid #334155;"><td><strong>4</strong></td><td style="color:#fde047;">2 Daños</td><td>1 Daño</td></tr>
          <tr style="border-bottom:1px solid #334155;"><td><strong>5</strong></td><td>1 Daño</td><td>1 Daño</td></tr>
          <tr style="border-bottom:1px solid #334155;"><td><strong>6</strong></td><td>1 Daño</td><td>1 Daño</td></tr>
          <tr><td><strong>7+</strong></td><td>1 Daño</td><td>1 Daño</td></tr>
        </tbody>
      </table>

      <div style="background:#0f172a; border-radius:6px; padding:6px; font-size:0.68rem; margin-bottom:6px;">
        <div style="font-weight:bold; color:#cbd5e1; margin-bottom:2px;">Modificadores de Daño (DRM):</div>
        <div style="color:#94a3b8;">
          • <strong style="color:#4ade80;">+1</strong> Cañón de cubierta de 127 mm<br>
          • <strong style="color:#4ade80;">+1</strong> Torpedos Tipo 89, Tipo 92 o Tipo 6<br>
          • <strong style="color:#f87171;">-1</strong> Torpedo Tipo 97 de Minisubmarino
        </div>
      </div>

      <div style="background:#0f172a; border-radius:6px; padding:6px; font-size:0.68rem;">
        <div style="font-weight:bold; color:#fde047; margin-bottom:2px;">Daño necesario para HUNDIR:</div>
        <div style="color:#94a3b8; line-height:1.35;">
          <strong>5–7 Daños:</strong> Buque Capital (Acorazado / CV)<br>
          <strong>4 Daños:</strong> Buques de 10,000+ t<br>
          <strong>3 Daños:</strong> Buques de 5,001–9,999 t<br>
          <strong>2 Daños:</strong> Buques de 1,001–5,000 t<br>
          <strong>1 Daño:</strong> Buques de 1,000 t o menos
        </div>
      </div>
    </div>

    <!-- CHART B4: ESCORT DETECTION -->
    <div style="background:#1e293b; border:1px solid #475569; border-radius:8px; padding:12px; border-top:3px solid #fbbf24;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <h3 style="margin:0; font-size:0.92rem; color:#fbbf24; font-weight:800;">TABLA [B4]: DETECCIÓN POR ESCOLTAS</h3>
        <span style="background:#0f172a; border:1px solid #64748b; color:#fbbf24; font-size:0.72rem; font-weight:bold; padding:2px 6px; border-radius:4px;">🎲 2d6</span>
      </div>

      <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:4px; margin-bottom:8px; text-align:center;">
        <div style="background:#0f172a; border:1px solid #334155; border-radius:4px; padding:4px;">
          <div style="font-size:0.95rem; color:#4ade80; font-weight:bold;">2–8</div>
          <div style="font-size:0.65rem; color:#94a3b8;">No Detectado</div>
        </div>
        <div style="background:#0f172a; border:1px solid #334155; border-radius:4px; padding:4px;">
          <div style="font-size:0.95rem; color:#fbbf24; font-weight:bold;">9–10</div>
          <div style="font-size:0.65rem; color:#94a3b8;">Detectado</div>
        </div>
        <div style="background:#0f172a; border:1px solid #334155; border-radius:4px; padding:4px;">
          <div style="font-size:0.95rem; color:#f87171; font-weight:bold;">11+</div>
          <div style="font-size:0.65rem; color:#fca5a5;">Detectado (+1 Ataque)</div>
        </div>
      </div>

      <div style="background:#0f172a; border-radius:6px; padding:6px; font-size:0.68rem; line-height:1.4;">
        <div style="font-weight:bold; color:#cbd5e1; margin-bottom:2px;">Modificadores a la Detección (DRM):</div>
        <div style="color:#94a3b8;">
          <strong style="color:#f87171;">+1</strong> Tanques de combustible dañados<br>
          <strong style="color:#f87171;">+1</strong> Planos de inmersión averiados<br>
          <strong style="color:#f87171;">+1</strong> Presencia de Buque Capital<br>
          <strong style="color:#f87171;">+1</strong> Submarino a vapor / de día<br>
          <strong style="color:#f87171;">+1</strong> Torpedo T.95 de día a corta distancia<br>
          <strong style="color:#f87171;">+1</strong> Detección previa en el turno<br>
          <strong style="color:#f87171;">+1</strong> A corta distancia (Close Range)<br>
          <strong style="color:#4ade80;">-1</strong> A larga distancia (Long Range)<br>
          <strong style="color:#f87171;">+1</strong> Ataque nocturno en superficie<br>
          <strong style="color:#f87171;">+1</strong> Disparo simultáneo proa + popa (1.er turno)<br>
          <strong style="color:#4ade80;">-1</strong> Exceder profundidad de test (Test Depth)<br>
          <strong style="color:#4ade80;">-1</strong> En el Océano Índico<br>
          <strong style="color:#f87171;">+1 / +2 / +3</strong> en los años 1943 / 1944 / 1945
        </div>
        <div style="margin-top:4px; color:#94a3b8; font-size:0.65rem; font-style:italic;">
          Ataques normales con 1d6 (1–5); Especial con 6 a partir de 5/44.
        </div>
      </div>
    </div>

    <!-- CHART B5: ESCORT / AIR ATTACK -->
    <div style="background:#1e293b; border:1px solid #475569; border-radius:8px; padding:12px; border-top:3px solid #ef4444;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <h3 style="margin:0; font-size:0.92rem; color:#f87171; font-weight:800;">TABLA [B5]: ATAQUE DE ESCOLTAS</h3>
        <span style="background:#0f172a; border:1px solid #64748b; color:#f87171; font-size:0.72rem; font-weight:bold; padding:2px 6px; border-radius:4px;">🎲 2d6</span>
      </div>

      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; font-size:0.7rem; margin-bottom:8px;">
        <div style="background:#0f172a; border-radius:4px; padding:4px;">
          <table style="width:100%; border-collapse:collapse; text-align:center;">
            <tr style="border-bottom:1px solid #1e293b;"><td>2–3</td><td style="color:#4ade80;">Ineficaz</td></tr>
            <tr style="border-bottom:1px solid #1e293b;"><td>4–6</td><td style="color:#fde047;">1 impacto</td></tr>
            <tr style="border-bottom:1px solid #1e293b;"><td>7–8</td><td style="color:#fdba74;">2 impactos</td></tr>
            <tr style="border-bottom:1px solid #1e293b;"><td>9–10</td><td style="color:#f87171;">3 impactos</td></tr>
            <tr style="border-bottom:1px solid #1e293b;"><td>11</td><td style="color:#ef4444; font-weight:bold;">4 impactos</td></tr>
            <tr style="border-bottom:1px solid #1e293b;"><td>12</td><td style="color:#dc2626; font-weight:bold;">5 impactos</td></tr>
            <tr><td>13+</td><td style="background:#450a0a; color:#f87171; font-weight:bold;">Hundido</td></tr>
          </table>
        </div>

        <div style="background:#0f172a; border-radius:4px; padding:6px; font-size:0.67rem; line-height:1.35;">
          <div style="font-weight:bold; color:#cbd5e1; margin-bottom:2px;">Modificadores al Ataque (DRM):</div>
          <div style="color:#94a3b8;">
            <strong style="color:#f87171;">+1</strong> Tanques combustible dañados<br>
            <strong style="color:#f87171;">+1</strong> Hidrófonos averiados<br>
            <strong style="color:#f87171;">+1</strong> Baterías dañadas<br>
            <strong style="color:#f87171;">+1/+2</strong> Motores eléctricos averiados<br>
            <strong style="color:#f87171;">+1</strong> Ataque nocturno en superficie (1.er turno)<br>
            <strong style="color:#f87171;">+1</strong> Por detección con 11+<br>
            <strong style="color:#f87171;">+2</strong> Ataque de aviación
          </div>
        </div>
      </div>

      <!-- Special Hedgehog -->
      <div style="background:#0f172a; border:1px solid #dc2626; border-radius:6px; padding:6px; font-size:0.68rem;">
        <div style="color:#fca5a5; font-weight:bold; margin-bottom:2px;">Especial: Lanzador HEDGEHOG (desde 5/44)</div>
        <div style="color:#94a3b8; font-size:0.66rem;">
          <strong>1–2 = Impacto, 3–6 = Fallo</strong><br>
          Si impacta, tirar 1d6 de nuevo:<br>
          <span style="color:#fdba74;">1 = 5 impactos</span> | <span style="color:#f87171;">2 = 7 impactos</span> | <span style="color:#ef4444; font-weight:bold;">3–6 = Hundido</span>
        </div>
      </div>
    </div>
  </div>

  <!-- BOTTOM ROW: CHART B6 SUBMARINE DAMAGE (d66) -->
  <div style="background:#1e293b; border:1px solid #475569; border-radius:8px; padding:12px; border-top:3px solid #a855f7;">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
      <h3 style="margin:0; font-size:1.05rem; color:#c084fc; font-weight:800; display:flex; align-items:center; gap:6px;">
        <span>TABLA [B6]</span> <span>CASILLAS DE DAÑO AL SUBMARINO (d66)</span>
      </h3>
      <span style="background:#0f172a; border:1px solid #64748b; color:#c084fc; font-size:0.75rem; font-weight:bold; padding:2px 8px; border-radius:4px;">
        🎲 1d6 (Decenas) + 1d6 (Unidades) ➔ d66
      </span>
    </div>

    <!-- 6 Column Grid of 36 entries -->
    <div style="display:grid; grid-template-columns: repeat(6, 1fr); gap:6px; font-size:0.72rem; margin-bottom:10px;">
      <!-- Col 1 -->
      <div style="display:flex; flex-direction:column; gap:4px;">
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">11</strong> Baterías</div>
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">12</strong> <span style="color:#38bdf8;">Inundación</span></div>
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">13</strong> Radar</div>
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">14</strong> Periscopio</div>
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">15</strong> Planos Inmersión</div>
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">16</strong> Motor Eléctrico 1</div>
      </div>
      <!-- Col 2 -->
      <div style="display:flex; flex-direction:column; gap:4px;">
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">21</strong> <span style="color:#38bdf8;">Inundación</span></div>
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">22</strong> Motor Eléctrico 2</div>
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">23</strong> Motor Diésel 1</div>
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">24</strong> Hangar Hidroavión</div>
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">25</strong> Motor Diésel 2</div>
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">26</strong> Grúa Catapulta</div>
      </div>
      <!-- Col 3 -->
      <div style="display:flex; flex-direction:column; gap:4px;">
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">31</strong> <span style="color:#38bdf8;">Inundación</span></div>
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">32</strong> Minisubmarino</div>
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">33</strong> Casco (Hull)</div>
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">34</strong> <span style="color:#fca5a5;">Baja Dotación (Herido/KIA)</span></div>
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">35</strong> Casco (Hull)</div>
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">36</strong> Cañón de Cubierta</div>
      </div>
      <!-- Col 4 -->
      <div style="display:flex; flex-direction:column; gap:4px;">
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">41</strong> Casco (Hull)</div>
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">42</strong> Radio Transmisor</div>
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">43</strong> <span style="color:#38bdf8;">Inundación</span></div>
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">44</strong> <span style="color:#38bdf8;">Inundación</span></div>
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">45</strong> Casco (Hull)</div>
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">46</strong> Cañón Antiaéreo</div>
      </div>
      <!-- Col 5 -->
      <div style="display:flex; flex-direction:column; gap:4px;">
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">51</strong> <span style="color:#38bdf8;">Inundación</span></div>
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">52</strong> Casco (Hull)</div>
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">53</strong> <span style="color:#f87171; font-weight:bold;">Baja Dotación x2</span></div>
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">54</strong> <span style="color:#38bdf8; font-weight:bold;">Inundación x2</span></div>
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">55</strong> Casco (Hull)</div>
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">56</strong> Cañón de Cubierta</div>
      </div>
      <!-- Col 6 -->
      <div style="display:flex; flex-direction:column; gap:4px;">
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">61</strong> Hidrófonos</div>
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">62</strong> Compuerta Torpedo Popa</div>
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">63</strong> Compuertas Proa (Impares)</div>
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">64</strong> Compuertas Proa (Pares)</div>
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">65</strong> <span style="color:#ef4444; font-weight:bold;">Casco x2 (Hull x2)</span></div>
        <div style="background:#0f172a; border:1px solid #334155; padding:5px 6px; border-radius:4px;"><strong style="color:#fde047;">66</strong> <span style="color:#fdba74;">Tanque Combustible</span></div>
      </div>
    </div>

    <!-- Official Notes footer -->
    <div style="background:#0f172a; border-radius:6px; padding:8px; font-size:0.72rem; color:#94a3b8; border-left:3px solid #c084fc;">
      <strong>Notas oficiales:</strong> Un impacto contra un sistema no presente en el submarino "no tiene efecto", excepto que un impacto en Cañón de Cubierta cuenta siempre como impacto a Kaiten si estuviese instalado.<br>
      Un impacto en Minisubmarino cuenta como impacto a Lancha Daihatsu si estuviese instalada.
    </div>
  </div>
</div>`,

    "M5_M7": `<div class="ocr-board-m5-m7" style="background:#0f172a; border:2px solid #38bdf8; border-radius:10px; padding:16px; color:#f1f5f9; font-family:'Segoe UI', Roboto, sans-serif; box-shadow:0 8px 30px rgba(0,0,0,0.7);">
  <!-- HEADER -->
  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #38bdf8; padding-bottom:8px; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
    <div style="display:flex; align-items:center; gap:12px;">
      <span style="background:#0284c7; color:#fff; font-size:0.75rem; font-weight:900; padding:3px 8px; border-radius:4px; letter-spacing:1px;">OPERACIONES ESPECIALES KO-HYOTEKI</span>
      <div>
        <h2 style="margin:0; font-family:'Cinzel', serif; font-size:1.35rem; color:#38bdf8; letter-spacing:1px; line-height:1.2;">SENSUIKAN <span style="font-size:0.85rem; color:#94a3b8; font-weight:normal;">(Submarinos de Flota Japoneses 1941–45)</span></h2>
        <div style="font-size:0.75rem; color:#7dd3fc; font-weight:600;">TABLAS M5, M6, M7: CONTACTOS, EVENTOS Y RECUPERACIÓN DE MINISUBMARINOS</div>
      </div>
    </div>
    <span style="font-size:0.72rem; color:#94a3b8; background:rgba(0,0,0,0.4); padding:3px 8px; border-radius:4px; border:1px solid #334155;">Oficial Compass Games</span>
  </div>

  <!-- CHART M5 -->
  <div style="background:#1e293b; border:1px solid #475569; border-radius:8px; padding:12px; margin-bottom:14px; border-top:3px solid #38bdf8;">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
      <h3 style="margin:0; font-size:1rem; color:#38bdf8; font-weight:800;">TABLA [M5]: CONTACTOS Y REDES DEFENSIVAS DE MINISUBMARINOS</h3>
      <span style="background:#0f172a; border:1px solid #64748b; color:#38bdf8; font-size:0.75rem; font-weight:bold; padding:2px 8px; border-radius:4px;">🎲 2d6</span>
    </div>

    <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:12px; font-size:0.73rem;">
      <!-- Transit Circle -->
      <div style="background:#0f172a; border:1px solid #334155; border-radius:6px; padding:8px;">
        <div style="color:#7dd3fc; font-weight:bold; border-bottom:1px solid #334155; padding-bottom:4px; margin-bottom:6px; text-align:center;">Círculo de Tránsito (2d6)</div>
        <table style="width:100%; border-collapse:collapse; text-align:center;">
          <tr><td style="color:#fde047; font-weight:bold; width:35px;">2</td><td style="color:#f87171;">Aviación (Aircraft)</td></tr>
          <tr><td style="color:#fde047; font-weight:bold;">3</td><td style="color:#64748b;">-- (Sin contacto)</td></tr>
          <tr><td style="color:#fde047; font-weight:bold;">4</td><td style="color:#fdba74;">Evento Especial [M6]</td></tr>
          <tr><td style="color:#fde047; font-weight:bold;">5–6</td><td style="color:#64748b;">-- (Sin contacto)</td></tr>
          <tr><td style="color:#fde047; font-weight:bold;">7</td><td style="color:#fdba74;">Evento Especial [M6]</td></tr>
          <tr><td style="color:#fde047; font-weight:bold;">8–9</td><td style="color:#64748b;">-- (Sin contacto)</td></tr>
          <tr><td style="color:#fde047; font-weight:bold;">10</td><td style="color:#fdba74;">Evento Especial [M6]</td></tr>
          <tr><td style="color:#fde047; font-weight:bold;">11</td><td style="color:#64748b;">-- (Sin contacto)</td></tr>
          <tr><td style="color:#fde047; font-weight:bold;">12</td><td style="color:#f87171; font-weight:bold;">Buque de Guerra</td></tr>
        </table>
      </div>

      <!-- Target Circle -->
      <div style="background:#0f172a; border:1px solid #334155; border-radius:6px; padding:8px;">
        <div style="color:#7dd3fc; font-weight:bold; border-bottom:1px solid #334155; padding-bottom:4px; margin-bottom:6px; text-align:center;">Círculo del Objetivo / Puerto (2d6)</div>
        <table style="width:100%; border-collapse:collapse; text-align:center;">
          <tr><td style="color:#fde047; font-weight:bold; width:35px;">2</td><td style="color:#93c5fd;">1 Mercante</td></tr>
          <tr><td style="color:#fde047; font-weight:bold;">3</td><td style="color:#93c5fd;">2 Mercantes</td></tr>
          <tr><td style="color:#fde047; font-weight:bold;">4</td><td style="color:#93c5fd;">1 Mercante (P), 1 Mercante</td></tr>
          <tr><td style="color:#fde047; font-weight:bold;">5</td><td style="color:#fdba74;">1 Buque Guerra, 1 Mercante</td></tr>
          <tr><td style="color:#fde047; font-weight:bold;">6</td><td style="color:#93c5fd;">3 Mercantes</td></tr>
          <tr><td style="color:#fde047; font-weight:bold;">7–8</td><td style="color:#fdba74;">1 Buque Guerra, 2 Mercantes</td></tr>
          <tr><td style="color:#fde047; font-weight:bold;">9</td><td style="color:#fdba74;">1 Buque Guerra, 3 Mercantes</td></tr>
          <tr><td style="color:#fde047; font-weight:bold;">10</td><td style="color:#fde047; font-weight:bold;">1 Buque Capital, 1 Buque Guerra</td></tr>
          <tr><td style="color:#fde047; font-weight:bold;">11</td><td style="color:#fde047; font-weight:bold;">1 Buque Capital, 2 Buques Guerra</td></tr>
          <tr><td style="color:#fde047; font-weight:bold;">12</td><td style="color:#f87171; font-weight:bold;">3 Buques Capitales</td></tr>
        </table>
      </div>

      <!-- Anti-Sub Net -->
      <div style="background:#0f172a; border:1px solid #334155; border-radius:6px; padding:8px;">
        <div style="color:#7dd3fc; font-weight:bold; border-bottom:1px solid #334155; padding-bottom:4px; margin-bottom:6px; text-align:center;">Red Antisubmarina (2d6)</div>
        <table style="width:100%; border-collapse:collapse; font-size:0.7rem;">
          <tr style="border-bottom:1px solid #1e293b;"><td style="color:#ef4444; font-weight:bold; width:28px;">2</td><td style="color:#f87171;"><strong>Atrapado:</strong> Sin escape posible. ¡Grito de Banzai al Emperador y Seppuku!</td></tr>
          <tr style="border-bottom:1px solid #1e293b;"><td style="color:#fdba74; font-weight:bold;">3</td><td style="color:#fde047;"><strong>Atrapado:</strong> Detectado por patrulla ASV. Tirar de nuevo con DRM -1.</td></tr>
          <tr style="border-bottom:1px solid #1e293b;"><td style="color:#fde047; font-weight:bold;">4</td><td style="color:#e2e8f0;"><strong>Atrapado:</strong> Si tiene <em>Boat Handling</em>, pasa la red. Si no, atrapado y destruido.</td></tr>
          <tr style="border-bottom:1px solid #1e293b;"><td style="color:#38bdf8; font-weight:bold;">5–6</td><td style="color:#bae6fd;"><strong>Atrapado temporal:</strong> Tira 1d6 daños. Si sobrevive, supera la red.</td></tr>
          <tr><td style="color:#4ade80; font-weight:bold;">7–12</td><td style="color:#a7f3d0;"><strong>Franqueada con éxito:</strong> Pasa la red sin sufrir percance ni ser detectado.</td></tr>
        </table>
      </div>
    </div>
  </div>

  <!-- BOTTOM: CHART M6 & CHART M7 -->
  <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px;">
    <!-- CHART M6 -->
    <div style="background:#1e293b; border:1px solid #475569; border-radius:8px; padding:12px; border-top:3px solid #38bdf8;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <h3 style="margin:0; font-size:0.95rem; color:#38bdf8; font-weight:800;">TABLA [M6]: EVENTOS DE MINISUBMARINOS</h3>
        <span style="background:#0f172a; border:1px solid #64748b; color:#38bdf8; font-size:0.72rem; font-weight:bold; padding:2px 6px; border-radius:4px;">🎲 2d6</span>
      </div>
      <table style="width:100%; border-collapse:collapse; font-size:0.71rem;">
        <tr style="border-bottom:1px solid #334155;"><td style="color:#fde047; font-weight:bold; width:30px;">2:</td><td style="color:#f87171;">Tromba marina / Mar picado: Minisubmarino volcado y perdido.</td></tr>
        <tr style="border-bottom:1px solid #334155;"><td style="color:#fde047; font-weight:bold;">3:</td><td style="color:#fdba74;">Interceptación ULTRA: Defensas en máxima alerta. Ignora buques capitales.</td></tr>
        <tr style="border-bottom:1px solid #334155;"><td style="color:#fde047; font-weight:bold;">4:</td><td style="color:#fde047;">Emergencia involuntaria a superficie: Tira detección 2d6; con 10+, destruido por baterías costeras.</td></tr>
        <tr style="border-bottom:1px solid #334155;"><td style="color:#fde047; font-weight:bold;">5:</td><td style="color:#e2e8f0;">Fallo de gobierno o timón: Aplica 1 casilla de avería aleatoria inmediata.</td></tr>
        <tr style="border-bottom:1px solid #334155;"><td style="color:#fde047; font-weight:bold;">6:</td><td style="color:#38bdf8;">Vía de agua: Marca 1 casilla de inundación (no se extiende).</td></tr>
        <tr style="border-bottom:1px solid #334155;"><td style="color:#fde047; font-weight:bold;">7:</td><td style="color:#a7f3d0;">Sin novedad (No event): Navegación encubierta perfecta.</td></tr>
        <tr style="border-bottom:1px solid #334155;"><td style="color:#fde047; font-weight:bold;">8:</td><td style="color:#e2e8f0;">Fallo de girocompás: Desorientado; añade +1 casilla de tránsito.</td></tr>
        <tr style="border-bottom:1px solid #334155;"><td style="color:#fde047; font-weight:bold;">9:</td><td style="color:#e2e8f0;">Baterías defectuosas: Velocidad reducida (-1 al franqueo de redes).</td></tr>
        <tr style="border-bottom:1px solid #334155;"><td style="color:#fde047; font-weight:bold;">10:</td><td style="color:#fde047;">Varada en arrecife: Encallado temporalmente; tira 1d6 daños de casco.</td></tr>
        <tr style="border-bottom:1px solid #334155;"><td style="color:#fde047; font-weight:bold;">11:</td><td style="color:#fdba74;">Detector de campo magnético activado: Búsqueda activa de patrulleras.</td></tr>
        <tr><td style="color:#fde047; font-weight:bold;">12:</td><td style="color:#f87171;">Colisión con patrullera portuaria: Minisubmarino destruido.</td></tr>
      </table>
    </div>

    <!-- CHART M7 -->
    <div style="background:#1e293b; border:1px solid #475569; border-radius:8px; padding:12px; border-top:3px solid #10b981;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <h3 style="margin:0; font-size:0.95rem; color:#10b981; font-weight:800;">TABLA [M7]: RECUPERACIÓN EN PUNTO DE ENCUENTRO</h3>
        <span style="background:#0f172a; border:1px solid #64748b; color:#10b981; font-size:0.72rem; font-weight:bold; padding:2px 6px; border-radius:4px;">🎲 2d6</span>
      </div>
      <table style="width:100%; border-collapse:collapse; font-size:0.71rem;">
        <tr style="border-bottom:1px solid #334155;"><td style="color:#fde047; font-weight:bold; width:30px;">2–3:</td><td style="color:#f87171;">Sin rastro del minisubmarino. Tripulación declarada MIA / Desaparecida en acción.</td></tr>
        <tr style="border-bottom:1px solid #334155;"><td style="color:#fde047; font-weight:bold;">4–5:</td><td style="color:#fdba74;">Minisubmarino echado a pique por su dotación. Tripulantes nadaron y fueron rescatados (+1 mes de refit).</td></tr>
        <tr style="border-bottom:1px solid #334155;"><td style="color:#fde047; font-weight:bold;">6–8:</td><td style="color:#fde047;">Recuperación con daños leves en amarre: Minisubmarino recuperado a bordo con éxito.</td></tr>
        <tr style="border-bottom:1px solid #334155;"><td style="color:#fde047; font-weight:bold;">9–10:</td><td style="color:#a7f3d0;">Recuperación impecable: Minisubmarino y tripulación intactos.</td></tr>
        <tr><td style="color:#fde047; font-weight:bold;">11–12:</td><td style="color:#22c55e; font-weight:bold;">Éxito extraordinario: Recuperación perfecta y condecoración a los tripulantes.</td></tr>
      </table>
      <div style="margin-top:8px; font-size:0.68rem; color:#94a3b8; border-top:1px dashed #334155; padding-top:4px;">
        <strong>Modificadores (DRM):</strong> +1 si el Comandante posee la habilidad <em>Superior Comms</em>. -1 si el submarino nodriza está bajo ataque aéreo o de superficie.
      </div>
    </div>
  </div>
</div>`,

    "M8_M9": `<div class="ocr-board-m8-m9" style="background:#0f172a; border:2px solid #38bdf8; border-radius:10px; padding:16px; color:#f1f5f9; font-family:'Segoe UI', Roboto, sans-serif; box-shadow:0 8px 30px rgba(0,0,0,0.7);">
  <!-- HEADER -->
  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #38bdf8; padding-bottom:8px; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
    <div style="display:flex; align-items:center; gap:12px;">
      <span style="background:#0284c7; color:#fff; font-size:0.75rem; font-weight:900; padding:3px 8px; border-radius:4px; letter-spacing:1px;">OPERACIONES ESPECIALES KO-HYOTEKI</span>
      <div>
        <h2 style="margin:0; font-family:'Cinzel', serif; font-size:1.35rem; color:#38bdf8; letter-spacing:1px; line-height:1.2;">SENSUIKAN <span style="font-size:0.85rem; color:#94a3b8; font-weight:normal;">(Submarinos de Flota Japoneses 1941–45)</span></h2>
        <div style="font-size:0.75rem; color:#7dd3fc; font-weight:600;">TABLAS M8 Y M9: ATAQUES DE ESCOLTA Y DAÑOS A MINISUBMARINOS</div>
      </div>
    </div>
    <span style="font-size:0.72rem; color:#94a3b8; background:rgba(0,0,0,0.4); padding:3px 8px; border-radius:4px; border:1px solid #334155;">Oficial Compass Games</span>
  </div>

  <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px;">
    <!-- CHART M8: ESCORT ATTACK -->
    <div style="background:#1e293b; border:1px solid #475569; border-radius:8px; padding:12px; border-top:3px solid #ef4444;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <h3 style="margin:0; font-size:1rem; color:#f87171; font-weight:800;">TABLA [M8]: ATAQUE DE ESCOLTAS A MINISUBMARINO</h3>
        <span style="background:#0f172a; border:1px solid #64748b; color:#f87171; font-size:0.75rem; font-weight:bold; padding:2px 8px; border-radius:4px;">🎲 2d6</span>
      </div>

      <table style="width:100%; border-collapse:collapse; font-size:0.73rem; text-align:center;">
        <tr style="border-bottom:1px solid #334155; background:#0f172a;"><th style="padding:4px;">Tirada 2d6</th><th style="padding:4px;">Resultado del Ataque</th></tr>
        <tr style="border-bottom:1px solid #334155;"><td><strong>2–4</strong></td><td style="color:#4ade80;">Sin Daños: Cargas de profundidad lejanas.</td></tr>
        <tr style="border-bottom:1px solid #334155;"><td><strong>5–7</strong></td><td style="color:#fde047;">1 Daño: Tira 1d6 en Tabla M9.</td></tr>
        <tr style="border-bottom:1px solid #334155;"><td><strong>8–9</strong></td><td style="color:#fdba74;">2 Daños: Tira 2 veces en Tabla M9.</td></tr>
        <tr style="border-bottom:1px solid #334155;"><td><strong>10–11</strong></td><td style="color:#f87171; font-weight:bold;">3 Daños: Tira 3 veces en Tabla M9.</td></tr>
        <tr><td><strong>12+</strong></td><td style="background:#450a0a; color:#ef4444; font-weight:bold;">¡HUNDIDO DIRECTAMENTE!</td></tr>
      </table>
      <div style="margin-top:8px; font-size:0.68rem; color:#94a3b8; border-top:1px dashed #334155; padding-top:4px;">
        <strong>Modificadores (DRM):</strong> +1 si el ataque es diurno en aguas poco profundas. -1 si es de noche.
      </div>
    </div>

    <!-- CHART M9: MINISUB DAMAGE -->
    <div style="background:#1e293b; border:1px solid #475569; border-radius:8px; padding:12px; border-top:3px solid #a855f7;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <h3 style="margin:0; font-size:1rem; color:#c084fc; font-weight:800;">TABLA [M9]: CASILLAS DE DAÑO DEL MINISUBMARINO</h3>
        <span style="background:#0f172a; border:1px solid #64748b; color:#c084fc; font-size:0.75rem; font-weight:bold; padding:2px 8px; border-radius:4px;">🎲 1d6</span>
      </div>

      <table style="width:100%; border-collapse:collapse; font-size:0.73rem;">
        <tr style="border-bottom:1px solid #334155; background:#0f172a;"><th style="padding:4px; width:35px; text-align:center;">1d6</th><th style="padding:4px;">Avería Sufrida</th></tr>
        <tr style="border-bottom:1px solid #334155;"><td style="text-align:center; color:#fde047; font-weight:bold;">1</td><td style="color:#38bdf8;"><strong>Inundación:</strong> Vía de agua severa en cámara de baterías.</td></tr>
        <tr style="border-bottom:1px solid #334155;"><td style="text-align:center; color:#fde047; font-weight:bold;">2</td><td style="color:#fdba74;"><strong>Motor Eléctrico:</strong> Pérdida de propulsión principal (-2 nudos).</td></tr>
        <tr style="border-bottom:1px solid #334155;"><td style="text-align:center; color:#fde047; font-weight:bold;">3</td><td style="color:#fde047;"><strong>Timón / Planos:</strong> Pérdida de control de profundidad.</td></tr>
        <tr style="border-bottom:1px solid #334155;"><td style="text-align:center; color:#fde047; font-weight:bold;">4</td><td style="color:#e2e8f0;"><strong>Periscopio:</strong> Ciego bajo el agua (+2 a todas las tiradas de tiro).</td></tr>
        <tr style="border-bottom:1px solid #334155;"><td style="text-align:center; color:#fde047; font-weight:bold;">5</td><td style="color:#fca5a5;"><strong>Baja de Dotación:</strong> 1 de los 2 tripulantes herido o KIA.</td></tr>
        <tr><td style="text-align:center; color:#fde047; font-weight:bold;">6</td><td style="color:#ef4444; font-weight:bold;"><strong>Casco (Hull):</strong> Grieta estructural grave. Si acumula 2 daños de casco, se hunde.</td></tr>
      </table>
    </div>
  </div>
</div>`,

    "B7": `<div class="ocr-board-b7" style="background:#0f172a; border:2px solid #ef4444; border-radius:10px; padding:16px; color:#f1f5f9; font-family:'Segoe UI', Roboto, sans-serif; box-shadow:0 8px 30px rgba(0,0,0,0.7);">
  <!-- HEADER -->
  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #ef4444; padding-bottom:8px; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
    <div style="display:flex; align-items:center; gap:12px;">
      <span style="background:#b91c1c; color:#fff; font-size:0.75rem; font-weight:900; padding:3px 8px; border-radius:4px; letter-spacing:1px;">CHART B7</span>
      <div>
        <h2 style="margin:0; font-family:'Cinzel', serif; font-size:1.35rem; color:#f87171; letter-spacing:1px; line-height:1.2;">SUBMARINE DAMAGE LISTINGS & CASUALTIES</h2>
        <div style="font-size:0.75rem; color:#fca5a5; font-weight:600;">CONTROL DE AVERÍAS, REPARACIONES EN EL MAR Y BAJAS (REGLAS OFICIALES 8.5 Y 8.6)</div>
      </div>
    </div>
    <span style="font-size:0.72rem; color:#94a3b8; background:rgba(0,0,0,0.4); padding:3px 8px; border-radius:4px; border:1px solid #334155;">Compass Games Official</span>
  </div>

  <!-- DAMAGE REPAIR LISTINGS GRID -->
  <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:10px; font-size:0.74rem; line-height:1.4; margin-bottom:14px;">
    <div style="background:#1e293b; border:1px solid #38bdf8; border-radius:6px; padding:8px; border-left:4px solid #38bdf8;">
      <strong style="color:#38bdf8; font-size:0.8rem;">Vía de Agua / Inundación (Flooding): 🎲 1d6</strong><br>
      Marca 1 casilla de inundación. Al concluir la ronda de combate, tira 1d6:<br>
      <span style="color:#4ade80;">• 1–4: Inundación Contenida (Halted)</span><br>
      <span style="color:#f87171;">• 5–6: Inundación Adicional (Additional Flooding)</span><br>
      <em>Si se llenan todas las casillas, el submarino debe emerger de inmediato.</em>
    </div>

    <div style="background:#1e293b; border:1px solid #ef4444; border-radius:6px; padding:8px; border-left:4px solid #ef4444;">
      <strong style="color:#f87171; font-size:0.8rem;">Casco (Hull):</strong><br>
      Marca 1 casilla de daño en el casco del Chart K1. Si se llenan todas, el submarino se hunde. <strong>El daño en el casco NO es reparable en el mar</strong>; requiere astillero (Fase 5: Refit).
    </div>

    <div style="background:#1e293b; border:1px solid #fde047; border-radius:6px; padding:8px; border-left:4px solid #fde047;">
      <strong style="color:#fde047; font-size:0.8rem;">Baterías (Batteries): 🎲 1d6</strong><br>
      Al finalizar el combate tira 1d6:<br>
      <span style="color:#4ade80;">• 1–2: Reparadas (Fixed)</span> | <span style="color:#f87171;">• 3–6: Inoperativas</span>.<br>
      +1 DRM a la detección de escoltas. Si ambas están destruidas, debe emerger.
    </div>

    <div style="background:#1e293b; border:1px solid #fbbf24; border-radius:6px; padding:8px; border-left:4px solid #fbbf24;">
      <strong style="color:#fbbf24; font-size:0.8rem;">Periscopio (Periscope): 🎲 1d6</strong><br>
      Tirada de reparación 1d6: 1–2 Reparado, 3–6 Inoperativo.<br>
      Si está inoperativo, <strong>no se pueden realizar ataques de torpedos sumergido</strong>.
    </div>

    <div style="background:#1e293b; border:1px solid #a855f7; border-radius:6px; padding:8px; border-left:4px solid #a855f7;">
      <strong style="color:#c084fc; font-size:0.8rem;">Hidrófonos (Hydrophones): 🎲 1d6</strong><br>
      Tirada 1d6: 1–2 Reparados, 3–6 Inoperativos.<br>
      Si están inoperativos, los escoltas reciben <strong style="color:#f87171;">+1 al ataque</strong> en Chart B5.
    </div>

    <div style="background:#1e293b; border:1px solid #38bdf8; border-radius:6px; padding:8px; border-left:4px solid #38bdf8;">
      <strong style="color:#38bdf8; font-size:0.8rem;">Radar & Radio: 🎲 1d6</strong><br>
      Tirada 1d6: 1–2 Reparado, 3–6 Inoperativo.<br>
      Radar fuera: sin alerta temprana en superficie. Radio fuera: penalizador a rescates y órdenes de flota.
    </div>

    <div style="background:#1e293b; border:1px solid #10b981; border-radius:6px; padding:8px; border-left:4px solid #10b981;">
      <strong style="color:#34d399; font-size:0.8rem;">Motores Diésel 1 & 2: 🎲 1d6</strong><br>
      Tirada 1d6: 1–2 Reparado, 3–6 Inoperativo.<br>
      Pérdida de propulsión de superficie y velocidad de carga de baterías.
    </div>

    <div style="background:#1e293b; border:1px solid #10b981; border-radius:6px; padding:8px; border-left:4px solid #10b981;">
      <strong style="color:#34d399; font-size:0.8rem;">Motores Eléctricos 1 & 2: 🎲 1d6</strong><br>
      Tirada 1d6: 1–2 Reparado, 3–6 Inoperativo.<br>
      1 motor fuera: +1 ataque de escoltas; 2 motores fuera: <strong style="color:#f87171;">+2 al ataque</strong>.
    </div>

    <div style="background:#1e293b; border:1px solid #fdba74; border-radius:6px; padding:8px; border-left:4px solid #fdba74;">
      <strong style="color:#fdba74; font-size:0.8rem;">Planos de Inmersión (Diveplanes): 🎲 1d6</strong><br>
      Tirada 1d6: 1–2 Reparado, 3–6 Inoperativo.<br>
      Si están fuera, los escoltas reciben <strong style="color:#f87171;">+1 a la detección</strong> en Chart B4.
    </div>

    <div style="background:#1e293b; border:1px solid #fdba74; border-radius:6px; padding:8px; border-left:4px solid #fdba74;">
      <strong style="color:#fdba74; font-size:0.8rem;">Compuertas de Torpedos (F.T. Doors): 🎲 1d6</strong><br>
      Tirada 1d6: 1–2 Reparado, 3–6 Inoperativo.<br>
      Los tubos correspondientes (pares o impares) quedan bloqueados hasta repararse.
    </div>

    <div style="background:#1e293b; border:1px solid #cbd5e1; border-radius:6px; padding:8px; border-left:4px solid #cbd5e1;">
      <strong style="color:#cbd5e1; font-size:0.8rem;">Tanque de Combustible (Fuel Tank):</strong><br>
      Mancha de combustible visible en el mar. <strong style="color:#f87171;">+1 Detección</strong> en B4 y <strong style="color:#f87171;">+1 Ataque</strong> en B5.
    </div>

    <div style="background:#1e293b; border:1px solid #cbd5e1; border-radius:6px; padding:8px; border-left:4px solid #cbd5e1;">
      <strong style="color:#cbd5e1; font-size:0.8rem;">Cañón de Cubierta (Deck Gun):</strong><br>
      Inutilizado para el resto de la patrulla. <em>Si hay Kaiten a bordo, también resulta dañado.</em>
    </div>
  </div>

  <!-- CREW INJURIES (BAJAS DE TRIPULACIÓN) -->
  <div style="background:#1e293b; border:1px solid #dc2626; border-radius:8px; padding:12px; border-top:3px solid #dc2626;">
    <h3 style="margin:0 0 8px 0; font-size:0.95rem; color:#fca5a5; font-weight:800; display:flex; justify-content:space-between; align-items:center;">
      <span>TABLA DE BAJAS Y HERIDAS DE TRIPULACIÓN (REGLA 8.6)</span>
      <span style="background:#0f172a; border:1px solid #64748b; color:#fca5a5; font-size:0.75rem; font-weight:bold; padding:2px 8px; border-radius:4px;">🎲 1d6 + 1d6</span>
    </h3>

    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; font-size:0.75rem;">
      <div style="background:#0f172a; padding:8px; border-radius:6px;">
        <strong style="color:#fde047;">Tirada 1: ¿Quién recibe la baja? (1d6)</strong>
        <div style="margin-top:4px; color:#cbd5e1; line-height:1.4;">
          <strong>1–2:</strong> Oficial (Comandante, 2.º Oficial XO o Jefe de Máquinas)<br>
          <strong>3–6:</strong> Tripulación / Especialistas de guardia
        </div>
      </div>

      <div style="background:#0f172a; padding:8px; border-radius:6px;">
        <strong style="color:#f87171;">Tirada 2: Severidad de la Herida (1d6)</strong>
        <div style="margin-top:4px; color:#cbd5e1; line-height:1.4;">
          <strong>1–3:</strong> Herida Leve (LW - Light Wound)<br>
          <strong>4–5:</strong> Herida Grave (SW - Serious Wound)<br>
          <strong>6:</strong> Muerto en Combate (KIA - Killed in Action)
        </div>
      </div>
    </div>

    <div style="margin-top:8px; background:#0f172a; padding:6px 10px; border-radius:4px; font-size:0.72rem; color:#fde047;">
      ★ <strong>Regla Acumulativa:</strong> Dos Heridas Leves se convierten en Herida Grave (2x LW = SW). Dos Heridas Graves se convierten en Muerte en Combate (2x SW = KIA). Si el Comandante está KIA o SW, aplica +1 DRM a todas las tiradas de ataque de torpedos.
    </div>
  </div>
</div>`,
      "FLOW_0": `<div class="ocr-flow-card" style="background:#0f172a; border:2px solid #fde047; border-radius:10px; padding:16px; color:#f1f5f9; font-family:'Segoe UI', Roboto, sans-serif; box-shadow:0 8px 30px rgba(0,0,0,0.7);">
  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #fde047; padding-bottom:8px; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
    <div style="display:flex; align-items:center; gap:12px;">
      <span style="background:#ca8a04; color:#000; font-size:0.75rem; font-weight:900; padding:3px 8px; border-radius:4px; letter-spacing:1px;">FASE 0</span>
      <div>
        <h2 style="margin:0; font-family:'Cinzel', serif; font-size:1.3rem; color:#fde047; letter-spacing:1px; line-height:1.2;">PREPARACIÓN Y COMISIONADO DEL SUBMARINO</h2>
        <div style="font-size:0.75rem; color:#fef08a; font-weight:600;">Reglas 4.0 & 5.0 (Compass Games)</div>
      </div>
    </div>
    <span style="font-size:0.72rem; color:#94a3b8; background:rgba(0,0,0,0.4); padding:3px 8px; border-radius:4px; border:1px solid #334155;">Secuencia Oficial de Juego</span>
  </div>

  <div style="margin-bottom:10px;">
    
        <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:10px 14px; margin-bottom:8px; border-left:4px solid #fde047;">
          <div style="font-weight:bold; color:#fde047; font-size:0.85rem; margin-bottom:3px;">1. Selección de Submarino</div>
          <div style="font-size:0.75rem; color:#cbd5e1; line-height:1.4;">Elige tu sumergible en el Dique Seco entre las 16 clases históricas de la Armada Imperial Japonesa (Kaidai, Junsen, Tipos A/B/C, Sen-Toku, Sen-Taka, Kirai-sen). Configura su numeral oficial de casco.</div>
        </div>
        
        <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:10px 14px; margin-bottom:8px; border-left:4px solid #fde047;">
          <div style="font-weight:bold; color:#fde047; font-size:0.85rem; margin-bottom:3px;">2. Ficha de Hoja de Servicio (Chart K1)</div>
          <div style="font-size:0.75rem; color:#cbd5e1; line-height:1.4;">Asigna el nombre del Comandante tirando en la Tabla H2 (Apellido y Nombre en kanji y romaji), determina su rango de inicio (Normalmente Kaigun-Chūsa / Comandante) y registra los torpedos asignados a los tubos de proa y popa.</div>
        </div>
        
        <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:10px 14px; margin-bottom:8px; border-left:4px solid #fde047;">
          <div style="font-weight:bold; color:#fde047; font-size:0.85rem; margin-bottom:3px;">3. Escuelas Navales de Adiestramiento (Opcional)</div>
          <div style="font-size:0.75rem; color:#cbd5e1; line-height:1.4;">Tira en la Escuela de Submarinos de Kure (Chart F1) para el Comandante (Tácticas de Torpedos), Oficial Ejecutivo XO (Cañón de Cubierta) y Jefe de Máquinas (Test Depth). Si llevas minisubmarinos tira en Chart F2; si llevas hidroavión Seiran/Glen tira en Chart F3 Kasumigaura.</div>
        </div>
        
  </div>

  <div style="text-align:right; font-size:0.72rem; color:#94a3b8;">
    Pulsa <strong style="color:#fde047;">Esc</strong> o haz clic fuera para cerrar esta ventana.
  </div>
</div>`,
      "FLOW_1": `<div class="ocr-flow-card" style="background:#0f172a; border:2px solid #fde047; border-radius:10px; padding:16px; color:#f1f5f9; font-family:'Segoe UI', Roboto, sans-serif; box-shadow:0 8px 30px rgba(0,0,0,0.7);">
  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #fde047; padding-bottom:8px; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
    <div style="display:flex; align-items:center; gap:12px;">
      <span style="background:#ca8a04; color:#000; font-size:0.75rem; font-weight:900; padding:3px 8px; border-radius:4px; letter-spacing:1px;">FASE 1</span>
      <div>
        <h2 style="margin:0; font-family:'Cinzel', serif; font-size:1.3rem; color:#fde047; letter-spacing:1px; line-height:1.2;">ZARPE Y ASIGNACIÓN DE MISIÓN</h2>
        <div style="font-size:0.75rem; color:#fef08a; font-weight:600;">Reglas 6.0 Paso 1, 7.0 & Tabla A1</div>
      </div>
    </div>
    <span style="font-size:0.72rem; color:#94a3b8; background:rgba(0,0,0,0.4); padding:3px 8px; border-radius:4px; border:1px solid #334155;">Secuencia Oficial de Juego</span>
  </div>

  <div style="margin-bottom:10px;">
    
        <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:10px 14px; margin-bottom:8px; border-left:4px solid #fde047;">
          <div style="font-weight:bold; color:#fde047; font-size:0.85rem; margin-bottom:3px;">1. Elección del Mes Operativo</div>
          <div style="font-size:0.75rem; color:#cbd5e1; line-height:1.4;">Selecciona el mes histórico de salida entre diciembre de 1941 y julio de 1945. Verifica la disponibilidad del submarino y de las bases navales activas.</div>
        </div>
        
        <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:10px 14px; margin-bottom:8px; border-left:4px solid #fde047;">
          <div style="font-weight:bold; color:#fde047; font-size:0.85rem; margin-bottom:3px;">2. Base de Salida</div>
          <div style="font-size:0.75rem; color:#cbd5e1; line-height:1.4;">Selecciona tu base naval oficial [Regla 4.7]: Yokosuka [4.7.1], Paramushiro [4.7.2] (Aleutianas, reasigna a Truk en 7/43), Truk [4.7.3] (cesa en 3/44), New Guinea [4.7.4] (Rabaul / Shortland) o Dutch East Indies (DEI) [4.7.5] (Singapur / Penang / Sabang).</div>
        </div>
        
        <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:10px 14px; margin-bottom:8px; border-left:4px solid #fde047;">
          <div style="font-weight:bold; color:#fde047; font-size:0.85rem; margin-bottom:3px;">3. Asignación de Área (Tabla A1)</div>
          <div style="font-size:0.75rem; color:#cbd5e1; line-height:1.4;">Lanza 2d6 en la columna de la fecha correspondiente de la Tabla A1 para recibir tu zona de patrulla oficial (o solicítala si tu comandante tiene suficiente rango militar según regla 7.14).</div>
        </div>
        
        <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:10px 14px; margin-bottom:8px; border-left:4px solid #fde047;">
          <div style="font-weight:bold; color:#fde047; font-size:0.85rem; margin-bottom:3px;">4. Gran Evento Histórico y Misión Especial [7.0]</div>
          <div style="font-size:0.75rem; color:#cbd5e1; line-height:1.4;">El sistema verifica automáticamente si en esa fecha y área tuvo lugar una operación de flota (Pearl Harbor, Midway, Guadalcanal, Golfo de Leyte, Operación Ten-Gō) o misión Kaiten/Minisubmarinos. Si la hay, se programa una Casilla de Misión Especial.</div>
        </div>
        
  </div>

  <div style="text-align:right; font-size:0.72rem; color:#94a3b8;">
    Pulsa <strong style="color:#fde047;">Esc</strong> o haz clic fuera para cerrar esta ventana.
  </div>
</div>`,
      "FLOW_2": `<div class="ocr-flow-card" style="background:#0f172a; border:2px solid #fde047; border-radius:10px; padding:16px; color:#f1f5f9; font-family:'Segoe UI', Roboto, sans-serif; box-shadow:0 8px 30px rgba(0,0,0,0.7);">
  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #fde047; padding-bottom:8px; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
    <div style="display:flex; align-items:center; gap:12px;">
      <span style="background:#ca8a04; color:#000; font-size:0.75rem; font-weight:900; padding:3px 8px; border-radius:4px; letter-spacing:1px;">FASE 2</span>
      <div>
        <h2 style="margin:0; font-family:'Cinzel', serif; font-size:1.3rem; color:#fde047; letter-spacing:1px; line-height:1.2;">NAVEGACIÓN Y TRAYECTO POR CASILLAS</h2>
        <div style="font-size:0.75rem; color:#fef08a; font-weight:600;">Reglas 6.0 Paso 2, 8.1 & Tabla A3</div>
      </div>
    </div>
    <span style="font-size:0.72rem; color:#94a3b8; background:rgba(0,0,0,0.4); padding:3px 8px; border-radius:4px; border:1px solid #334155;">Secuencia Oficial de Juego</span>
  </div>

  <div style="margin-bottom:10px;">
    
        <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:10px 14px; margin-bottom:8px; border-left:4px solid #fde047;">
          <div style="font-weight:bold; color:#fde047; font-size:0.85rem; margin-bottom:3px;">1. Ruta Dinámica de Casillas</div>
          <div style="font-size:0.75rem; color:#cbd5e1; line-height:1.4;">El plan de navegación se divide en Casillas de Tránsito de Ida, Casilla de Misión Especial (si aplica), Casillas en Estación y Casillas de Retorno según la distancia y autonomía del sumergible.</div>
        </div>
        
        <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:10px 14px; margin-bottom:8px; border-left:4px solid #fde047;">
          <div style="font-weight:bold; color:#fde047; font-size:0.85rem; margin-bottom:3px;">2. Avance de Casilla en Casilla</div>
          <div style="font-size:0.75rem; color:#cbd5e1; line-height:1.4;">Haz clic en "Avanzar Casilla" o usa el Stepper horizontal interactivo para recorrer la patrulla casilla a casilla.</div>
        </div>
        
        <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:10px 14px; margin-bottom:8px; border-left:4px solid #fde047;">
          <div style="font-weight:bold; color:#fde047; font-size:0.85rem; margin-bottom:3px;">3. Tirada de Encuentros (Tabla A3)</div>
          <div style="font-size:0.75rem; color:#cbd5e1; line-height:1.4;">En cada casilla de estación (y en tránsitos a partir de agosto de 1942), lanza 2d6 en la columna correspondiente al teatro naval. Los resultados van desde calma chicha (--) hasta mercantes solitarios, convoyes protegidos o poderosas task forces con portaaviones y acorazados.</div>
        </div>
        
        <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:10px 14px; margin-bottom:8px; border-left:4px solid #fde047;">
          <div style="font-weight:bold; color:#fde047; font-size:0.85rem; margin-bottom:3px;">4. Eventos Aleatorios (8.1.8)</div>
          <div style="font-size:0.75rem; color:#cbd5e1; line-height:1.4;">Un 12 natural en cualquier casilla activa un Evento Inesperado en la Tabla B11 (máximo 1 por patrulla).</div>
        </div>
        
  </div>

  <div style="text-align:right; font-size:0.72rem; color:#94a3b8;">
    Pulsa <strong style="color:#fde047;">Esc</strong> o haz clic fuera para cerrar esta ventana.
  </div>
</div>`,
      "FLOW_3": `<div class="ocr-flow-card" style="background:#0f172a; border:2px solid #fde047; border-radius:10px; padding:16px; color:#f1f5f9; font-family:'Segoe UI', Roboto, sans-serif; box-shadow:0 8px 30px rgba(0,0,0,0.7);">
  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #fde047; padding-bottom:8px; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
    <div style="display:flex; align-items:center; gap:12px;">
      <span style="background:#ca8a04; color:#000; font-size:0.75rem; font-weight:900; padding:3px 8px; border-radius:4px; letter-spacing:1px;">FASE 3</span>
      <div>
        <h2 style="margin:0; font-family:'Cinzel', serif; font-size:1.3rem; color:#fde047; letter-spacing:1px; line-height:1.2;">SECUENCIA DE COMBATE TÁCTICO Y TORPEDOS</h2>
        <div style="font-size:0.75rem; color:#fef08a; font-weight:600;">Reglas 6.0 Paso 3, 8.2 & Tablas B1 a B6</div>
      </div>
    </div>
    <span style="font-size:0.72rem; color:#94a3b8; background:rgba(0,0,0,0.4); padding:3px 8px; border-radius:4px; border:1px solid #334155;">Secuencia Oficial de Juego</span>
  </div>

  <div style="margin-bottom:10px;">
    
        <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:10px 14px; margin-bottom:8px; border-left:4px solid #fde047;">
          <div style="font-weight:bold; color:#fde047; font-size:0.85rem; margin-bottom:3px;">1. Determinación de Blancos (Tablas T1 a T5)</div>
          <div style="font-size:0.75rem; color:#cbd5e1; line-height:1.4;">Tira 1d100 para determinar la identidad exacta, nombre histórico y tonelaje del mercante o buque de guerra avistado.</div>
        </div>
        
        <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:10px 14px; margin-bottom:8px; border-left:4px solid #fde047;">
          <div style="font-weight:bold; color:#fde047; font-size:0.85rem; margin-bottom:3px;">2. Aproximación y Salva de Torpedos</div>
          <div style="font-size:0.75rem; color:#cbd5e1; line-height:1.4;">Elige distancia de disparo (Close, Medium, Long) y condición (Sumergido o Superficie nocturno). Selecciona qué tubos disparar y lanza 2d6 en Chart B1 aplicando los modificadores oficiales.</div>
        </div>
        
        <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:10px 14px; margin-bottom:8px; border-left:4px solid #fde047;">
          <div style="font-weight:bold; color:#fde047; font-size:0.85rem; margin-bottom:3px;">3. Chequeo de Duds y Daño Infligido</div>
          <div style="font-size:0.75rem; color:#cbd5e1; line-height:1.4;">Verifica en Chart B2 (1d6) que el torpedo no sea inerte (falla con un 1). Para cada impacto exitoso, tira 1d6 en Chart B3 para calcular los puntos de daño y comprobar si el objetivo se hunde.</div>
        </div>
        
        <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:10px 14px; margin-bottom:8px; border-left:4px solid #fde047;">
          <div style="font-weight:bold; color:#fde047; font-size:0.85rem; margin-bottom:3px;">4. Reacción y Detección de Escoltas</div>
          <div style="font-size:0.75rem; color:#cbd5e1; line-height:1.4;">Si el convoy cuenta con escolta, tira 2d6 en Chart B4 con modificadores por tecnología enemiga, alcance y año. Si eres detectado, los destructores contraatacan con cargas de profundidad en Chart B5.</div>
        </div>
        
        <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:10px 14px; margin-bottom:8px; border-left:4px solid #fde047;">
          <div style="font-weight:bold; color:#fde047; font-size:0.85rem; margin-bottom:3px;">5. Resolución de Averías en el Submarino (Chart B6)</div>
          <div style="font-size:0.75rem; color:#cbd5e1; line-height:1.4;">Cada impacto enemigo contra tu submarino genera una tirada d66 (1d6 rojo + 1d6 blanco) en Chart B6, registrando averías en baterías, vías de agua, casco o bajas de la tripulación.</div>
        </div>
        
  </div>

  <div style="text-align:right; font-size:0.72rem; color:#94a3b8;">
    Pulsa <strong style="color:#fde047;">Esc</strong> o haz clic fuera para cerrar esta ventana.
  </div>
</div>`,
      "FLOW_4": `<div class="ocr-flow-card" style="background:#0f172a; border:2px solid #fde047; border-radius:10px; padding:16px; color:#f1f5f9; font-family:'Segoe UI', Roboto, sans-serif; box-shadow:0 8px 30px rgba(0,0,0,0.7);">
  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #fde047; padding-bottom:8px; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
    <div style="display:flex; align-items:center; gap:12px;">
      <span style="background:#ca8a04; color:#000; font-size:0.75rem; font-weight:900; padding:3px 8px; border-radius:4px; letter-spacing:1px;">FASE 4</span>
      <div>
        <h2 style="margin:0; font-family:'Cinzel', serif; font-size:1.3rem; color:#fde047; letter-spacing:1px; line-height:1.2;">AVERÍAS, CONTROL DE DAÑOS Y RETORNO</h2>
        <div style="font-size:0.75rem; color:#fef08a; font-weight:600;">Reglas 6.0 Paso 4, 8.5, 8.6 & Chart B7</div>
      </div>
    </div>
    <span style="font-size:0.72rem; color:#94a3b8; background:rgba(0,0,0,0.4); padding:3px 8px; border-radius:4px; border:1px solid #334155;">Secuencia Oficial de Juego</span>
  </div>

  <div style="margin-bottom:10px;">
    
        <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:10px 14px; margin-bottom:8px; border-left:4px solid #fde047;">
          <div style="font-weight:bold; color:#fde047; font-size:0.85rem; margin-bottom:3px;">1. Control de Inundaciones</div>
          <div style="font-size:0.75rem; color:#cbd5e1; line-height:1.4;">Resuelve inmediatamente las vías de agua activas tirando 1d6 por cada compartimento inundado. Con 1–4 la vía de agua se contiene con éxito; con 5–6 la inundación empeora.</div>
        </div>
        
        <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:10px 14px; margin-bottom:8px; border-left:4px solid #fde047;">
          <div style="font-weight:bold; color:#fde047; font-size:0.85rem; margin-bottom:3px;">2. Reparaciones de Emergencia en el Mar</div>
          <div style="font-size:0.75rem; color:#cbd5e1; line-height:1.4;">El Jefe de Máquinas y la dotación técnica intentan reparar periscopios, motores diésel, motores eléctricos, timones e hidrófonos con tiradas de 1d6 en Chart B7.</div>
        </div>
        
        <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:10px 14px; margin-bottom:8px; border-left:4px solid #fde047;">
          <div style="font-weight:bold; color:#fde047; font-size:0.85rem; margin-bottom:3px;">3. Asistencia Médica a Bajas</div>
          <div style="font-size:0.75rem; color:#cbd5e1; line-height:1.4;">Registra el estado de salud del Comandante y la tripulación (Heridas Leves, Graves o Bajas en Combate).</div>
        </div>
        
        <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:10px 14px; margin-bottom:8px; border-left:4px solid #fde047;">
          <div style="font-weight:bold; color:#fde047; font-size:0.85rem; margin-bottom:3px;">4. Navegación de Retorno a Base</div>
          <div style="font-size:0.75rem; color:#cbd5e1; line-height:1.4;">Concluye las casillas de retorno para volver a puerto seguro.</div>
        </div>
        
  </div>

  <div style="text-align:right; font-size:0.72rem; color:#94a3b8;">
    Pulsa <strong style="color:#fde047;">Esc</strong> o haz clic fuera para cerrar esta ventana.
  </div>
</div>`,
      "FLOW_5": `<div class="ocr-flow-card" style="background:#0f172a; border:2px solid #fde047; border-radius:10px; padding:16px; color:#f1f5f9; font-family:'Segoe UI', Roboto, sans-serif; box-shadow:0 8px 30px rgba(0,0,0,0.7);">
  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #fde047; padding-bottom:8px; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
    <div style="display:flex; align-items:center; gap:12px;">
      <span style="background:#ca8a04; color:#000; font-size:0.75rem; font-weight:900; padding:3px 8px; border-radius:4px; letter-spacing:1px;">FASE 5</span>
      <div>
        <h2 style="margin:0; font-family:'Cinzel', serif; font-size:1.3rem; color:#fde047; letter-spacing:1px; line-height:1.2;">REFIT, REGISTRO EN ROGU BUKKU Y CARRERA</h2>
        <div style="font-size:0.75rem; color:#fef08a; font-weight:600;">Reglas 6.0 Paso 5, 7.13, 9.0 & Rogu Bukku</div>
      </div>
    </div>
    <span style="font-size:0.72rem; color:#94a3b8; background:rgba(0,0,0,0.4); padding:3px 8px; border-radius:4px; border:1px solid #334155;">Secuencia Oficial de Juego</span>
  </div>

  <div style="margin-bottom:10px;">
    
        <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:10px 14px; margin-bottom:8px; border-left:4px solid #fde047;">
          <div style="font-weight:bold; color:#fde047; font-size:0.85rem; margin-bottom:3px;">1. Asignación del Cuaderno de Bitácora (Rogu Bukku)</div>
          <div style="font-size:0.75rem; color:#cbd5e1; line-height:1.4;">El sistema asienta automáticamente la patrulla en la cuadrícula oficial de 46 meses con la fecha, el código de área, las bajas enemigas y el tonelaje total hundido.</div>
        </div>
        
        <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:10px 14px; margin-bottom:8px; border-left:4px solid #fde047;">
          <div style="font-weight:bold; color:#fde047; font-size:0.85rem; margin-bottom:3px;">2. Astillero y Reparación Mayor (Refit)</div>
          <div style="font-size:0.75rem; color:#cbd5e1; line-height:1.4;">Repara todos los puntos de daño en el casco, recarga la dotación completa de torpedos y suministros. El submarino pasa un período reglamentario en astillero ("R").</div>
        </div>
        
        <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:10px 14px; margin-bottom:8px; border-left:4px solid #fde047;">
          <div style="font-weight:bold; color:#fde047; font-size:0.85rem; margin-bottom:3px;">3. Evaluación de Condecoraciones y Ascensos</div>
          <div style="font-size:0.75rem; color:#cbd5e1; line-height:1.4;">Comprueba si el Comandante o el submarino cumplen los requisitos de condecoraciones (Submarine Badge, Wound Badge, Orden del Milano de Oro) o ascensos a Capitán (Taisa).</div>
        </div>
        
        <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:10px 14px; margin-bottom:8px; border-left:4px solid #fde047;">
          <div style="font-weight:bold; color:#fde047; font-size:0.85rem; margin-bottom:3px;">4. Paso a la Siguiente Patrulla</div>
          <div style="font-size:0.75rem; color:#cbd5e1; line-height:1.4;">Avanza el calendario operativo e inicia la siguiente misión en Fase 1.</div>
        </div>
        
  </div>

  <div style="text-align:right; font-size:0.72rem; color:#94a3b8;">
    Pulsa <strong style="color:#fde047;">Esc</strong> o haz clic fuera para cerrar esta ventana.
  </div>
</div>`
    ,

      "P3": {
        es: `<div class="ocr-board-p3" style="background:#0f172a; border:2px solid #0284c7; border-radius:10px; padding:16px; color:#f1f5f9; font-family:'Segoe UI', Roboto, sans-serif; box-shadow:0 8px 30px rgba(0,0,0,0.7);">
  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #0284c7; padding-bottom:10px; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
    <div style="display:flex; align-items:center; gap:10px;">
      <span style="background:#0284c7; color:#fff; font-size:0.75rem; font-weight:900; padding:3px 8px; border-radius:4px; letter-spacing:1px;">REGLA OFICIAL 7.17</span>
      <div>
        <h2 style="margin:0; font-family:'Cinzel', serif; font-size:1.25rem; color:#38bdf8;">TABLA P3: ENCUENTROS DEL HIDROAVIÓN (2d6)</h2>
        <div style="font-size:0.75rem; color:#94a3b8;">Módulo Aeronaval IJN • Misiones de Reconocimiento y Ataque</div>
      </div>
    </div>
    <div style="display:flex; gap:6px; flex-wrap:wrap;">
      <button type="button" onclick="openModalViewer('Tabla P3: Encuentros', '', 'P3')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#38bdf8; color:#7dd3fc; background:rgba(2,132,199,0.35); font-weight:bold;">🔭 Tabla P3: Encuentros</button>
      <button type="button" onclick="openModalViewer('Tabla P4: Combate', '', 'P4')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#f43f5e; color:#fda4af; background:transparent;">⚔️ Tabla P4: Combate</button>
      <button type="button" onclick="openModalViewer('Tabla P5: Fuego AA', '', 'P5')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#f97316; color:#fdba74; background:transparent;">💥 Tabla P5: Fuego AA</button>
      <button type="button" onclick="openModalViewer('Tabla P6: Bombardeo', '', 'P6')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#eab308; color:#fde047; background:transparent;">💣 Tabla P6: Bombardeo</button>
      <button type="button" onclick="openModalViewer('Tablas P3-P6: Todas', '', 'P3_P6')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#a855f7; color:#d8b4fe; background:transparent;">📜 Tablas P3-P6: Todas</button>
    </div>
  </div>
  <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:12px;">
    <div style="font-size:0.84rem; color:#94a3b8; margin-bottom:10px; padding-bottom:6px; border-bottom:1px solid #0369a1;">
      Tirada de 2d6 en cada círculo de aproximación según la fase de vuelo (Tránsito, Reconocimiento u Objetivo):
    </div>

    <!-- Table -->
    <div style="overflow-x:auto;">
      <table style="width:100%; border-collapse:collapse; font-size:0.86rem; text-align:center;">
        <thead>
          <tr style="background:#0369a1; color:#f8fafc;">
            <th style="padding:6px 8px; border:1px solid #0284c7; width:45px;">2d6</th>
            <th style="padding:6px 8px; border:1px solid #0284c7;">Tránsito</th>
            <th style="padding:6px 8px; border:1px solid #0284c7;">Reconocimiento</th>
            <th style="padding:6px 8px; border:1px solid #0284c7; background:#0284c7; color:#fde047;">Objetivo (Recon)</th>
            <th style="padding:6px 8px; border:1px solid #0284c7;">Objetivo (Bombardeo)</th>
          </tr>
        </thead>
        <tbody>
          <tr id="p3-row-2" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">2</td><td style="color:#64748b;">--</td><td style="color:#fda4af; font-weight:bold;">Avión</td><td style="color:#fde047; font-weight:bold;">Buque Capital</td><td style="color:#fda4af; font-weight:bold;">Avión</td></tr>
          <tr id="p3-row-3" class="p3-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">3</td><td style="color:#fda4af; font-weight:bold;">Avión</td><td style="color:#93c5fd;">Buque</td><td style="color:#93c5fd; font-weight:bold;">Buque de Guerra</td><td style="color:#64748b;">--</td></tr>
          <tr id="p3-row-4" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">4</td><td style="color:#64748b;">--</td><td style="color:#64748b;">--</td><td style="color:#93c5fd;">Destructor (DD)</td><td style="color:#64748b;">--</td></tr>
          <tr id="p3-row-5" class="p3-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">5</td><td style="color:#64748b;">--</td><td style="color:#93c5fd;">Buque</td><td style="color:#93c5fd;">Crucero Pesado (CA)</td><td style="color:#64748b;">--</td></tr>
          <tr id="p3-row-6" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">6</td><td style="color:#64748b;">--</td><td style="color:#64748b;">--</td><td style="color:#64748b;">Sin Encuentro</td><td style="color:#64748b;">--</td></tr>
          <tr id="p3-row-7" class="p3-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">7</td><td style="color:#64748b;">--</td><td style="color:#64748b;">--</td><td style="color:#64748b;">Sin Encuentro</td><td style="color:#64748b;">--</td></tr>
          <tr id="p3-row-8" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">8</td><td style="color:#64748b;">--</td><td style="color:#64748b;">--</td><td style="color:#64748b;">Sin Encuentro</td><td style="color:#64748b;">--</td></tr>
          <tr id="p3-row-9" class="p3-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">9</td><td style="color:#64748b;">--</td><td style="color:#93c5fd;">Buque</td><td style="color:#93c5fd;">Crucero Pesado (CA)</td><td style="color:#f87171; font-weight:bold;">Antiaéreo (AA)*</td></tr>
          <tr id="p3-row-10" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">10</td><td style="color:#64748b;">--</td><td style="color:#64748b;">--</td><td style="color:#93c5fd;">Crucero Ligero (CL)</td><td style="color:#64748b;">--</td></tr>
          <tr id="p3-row-11" class="p3-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">11</td><td style="color:#64748b;">--</td><td style="color:#93c5fd;">Grupo de Buques</td><td style="color:#93c5fd; font-weight:bold;">Grupo de Buques</td><td style="color:#64748b;">--</td></tr>
          <tr id="p3-row-12" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">12</td><td style="color:#fda4af; font-weight:bold;">Avión</td><td style="color:#fda4af; font-weight:bold;">Avión</td><td style="color:#fde047; font-weight:bold;">Buque Capital</td><td style="color:#fda4af; font-weight:bold;">Avión*</td></tr>
        </tbody>
      </table>
    </div>

    <div style="font-size:0.80rem; color:#94a3b8; margin-top:10px; line-height:1.4; border-top:1px solid #334155; padding-top:8px;">
      • <em>Los avistamientos de buques durante misiones de reconocimiento no causan combate naval para el hidroavión, pero aportan valor narrativo y de inteligencia.</em><br>
• <strong>* Se aplica exclusivamente en misiones de bombardeo en el Canal de Panamá.</strong>
    </div>
  </div>
</div>`,
        en: `<div class="ocr-board-p3" style="background:#0f172a; border:2px solid #0284c7; border-radius:10px; padding:16px; color:#f1f5f9; font-family:'Segoe UI', Roboto, sans-serif; box-shadow:0 8px 30px rgba(0,0,0,0.7);">
  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #0284c7; padding-bottom:10px; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
    <div style="display:flex; align-items:center; gap:10px;">
      <span style="background:#0284c7; color:#fff; font-size:0.75rem; font-weight:900; padding:3px 8px; border-radius:4px; letter-spacing:1px;">OFFICIAL RULE 7.17</span>
      <div>
        <h2 style="margin:0; font-family:'Cinzel', serif; font-size:1.25rem; color:#38bdf8;">CHART P3: FLOAT-PLANE ENCOUNTERS (2d6)</h2>
        <div style="font-size:0.75rem; color:#94a3b8;">IJN Air Module • Reconnaissance & Strike Missions</div>
      </div>
    </div>
    <div style="display:flex; gap:6px; flex-wrap:wrap;">
      <button type="button" onclick="openModalViewer('Chart P3: Encounters', '', 'P3')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#38bdf8; color:#7dd3fc; background:rgba(2,132,199,0.35); font-weight:bold;">🔭 Chart P3: Encounters</button>
      <button type="button" onclick="openModalViewer('Chart P4: Air Combat', '', 'P4')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#f43f5e; color:#fda4af; background:transparent;">⚔️ Chart P4: Air Combat</button>
      <button type="button" onclick="openModalViewer('Chart P5: AA Flak', '', 'P5')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#f97316; color:#fdba74; background:transparent;">💥 Chart P5: AA Flak</button>
      <button type="button" onclick="openModalViewer('Chart P6: Bombing', '', 'P6')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#eab308; color:#fde047; background:transparent;">💣 Chart P6: Bombing</button>
      <button type="button" onclick="openModalViewer('Charts P3-P6: All', '', 'P3_P6')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#a855f7; color:#d8b4fe; background:transparent;">📜 Charts P3-P6: All</button>
    </div>
  </div>
  <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:12px;">
    <div style="font-size:0.84rem; color:#94a3b8; margin-bottom:10px; padding-bottom:6px; border-bottom:1px solid #0369a1;">
      Roll 2d6 in each approach circle according to the assigned flight phase (Transit, Recon, or Target):
    </div>

    <!-- Table -->
    <div style="overflow-x:auto;">
      <table style="width:100%; border-collapse:collapse; font-size:0.86rem; text-align:center;">
        <thead>
          <tr style="background:#0369a1; color:#f8fafc;">
            <th style="padding:6px 8px; border:1px solid #0284c7; width:45px;">2d6</th>
            <th style="padding:6px 8px; border:1px solid #0284c7;">Transit</th>
            <th style="padding:6px 8px; border:1px solid #0284c7;">Recon</th>
            <th style="padding:6px 8px; border:1px solid #0284c7; background:#0284c7; color:#fde047;">Target (Recon)</th>
            <th style="padding:6px 8px; border:1px solid #0284c7;">Target (Bombing)</th>
          </tr>
        </thead>
        <tbody>
          <tr id="p3-row-2" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">2</td><td style="color:#64748b;">--</td><td style="color:#fda4af; font-weight:bold;">Aircraft</td><td style="color:#fde047; font-weight:bold;">Capital Ship</td><td style="color:#fda4af; font-weight:bold;">Aircraft</td></tr>
          <tr id="p3-row-3" class="p3-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">3</td><td style="color:#fda4af; font-weight:bold;">Aircraft</td><td style="color:#93c5fd;">Ship</td><td style="color:#93c5fd; font-weight:bold;">Warship</td><td style="color:#64748b;">--</td></tr>
          <tr id="p3-row-4" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">4</td><td style="color:#64748b;">--</td><td style="color:#64748b;">--</td><td style="color:#93c5fd;">Destroyer (DD)</td><td style="color:#64748b;">--</td></tr>
          <tr id="p3-row-5" class="p3-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">5</td><td style="color:#64748b;">--</td><td style="color:#93c5fd;">Ship</td><td style="color:#93c5fd;">Heavy Cruiser (CA)</td><td style="color:#64748b;">--</td></tr>
          <tr id="p3-row-6" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">6</td><td style="color:#64748b;">--</td><td style="color:#64748b;">--</td><td style="color:#64748b;">No Encounter</td><td style="color:#64748b;">--</td></tr>
          <tr id="p3-row-7" class="p3-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">7</td><td style="color:#64748b;">--</td><td style="color:#64748b;">--</td><td style="color:#64748b;">No Encounter</td><td style="color:#64748b;">--</td></tr>
          <tr id="p3-row-8" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">8</td><td style="color:#64748b;">--</td><td style="color:#64748b;">--</td><td style="color:#64748b;">No Encounter</td><td style="color:#64748b;">--</td></tr>
          <tr id="p3-row-9" class="p3-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">9</td><td style="color:#64748b;">--</td><td style="color:#93c5fd;">Ship</td><td style="color:#93c5fd;">Heavy Cruiser (CA)</td><td style="color:#f87171; font-weight:bold;">Anti-Aircraft (AA)*</td></tr>
          <tr id="p3-row-10" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">10</td><td style="color:#64748b;">--</td><td style="color:#64748b;">--</td><td style="color:#93c5fd;">Light Cruiser (CL)</td><td style="color:#64748b;">--</td></tr>
          <tr id="p3-row-11" class="p3-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">11</td><td style="color:#64748b;">--</td><td style="color:#93c5fd;">Ship Group</td><td style="color:#93c5fd; font-weight:bold;">Ship Group</td><td style="color:#64748b;">--</td></tr>
          <tr id="p3-row-12" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">12</td><td style="color:#fda4af; font-weight:bold;">Aircraft</td><td style="color:#fda4af; font-weight:bold;">Aircraft</td><td style="color:#fde047; font-weight:bold;">Capital Ship</td><td style="color:#fda4af; font-weight:bold;">Aircraft*</td></tr>
        </tbody>
      </table>
    </div>

    <div style="font-size:0.80rem; color:#94a3b8; margin-top:10px; line-height:1.4; border-top:1px solid #334155; padding-top:8px;">
      • <em>Encounters with ships while conducting Recon Missions in a floatplane have no game effects, but are included for narrative interest.</em><br>
• <strong>* Applies to Panama Canal Bombing Missions only.</strong>
    </div>
  </div>
</div>`,
        toString() { return (typeof window !== 'undefined' && window.currentLang === 'en') ? this.en : this.es; }
      },
      "P4": {
        es: `<div class="ocr-board-p4" style="background:#0f172a; border:2px solid #ef4444; border-radius:10px; padding:16px; color:#f1f5f9; font-family:'Segoe UI', Roboto, sans-serif; box-shadow:0 8px 30px rgba(0,0,0,0.7);">
  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #0284c7; padding-bottom:10px; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
    <div style="display:flex; align-items:center; gap:10px;">
      <span style="background:#0284c7; color:#fff; font-size:0.75rem; font-weight:900; padding:3px 8px; border-radius:4px; letter-spacing:1px;">REGLA OFICIAL 7.17</span>
      <div>
        <h2 style="margin:0; font-family:'Cinzel', serif; font-size:1.25rem; color:#38bdf8;">TABLA P4: COMBATE AÉREO DEFENSIVO Y AMETRALLADORA</h2>
        <div style="font-size:0.75rem; color:#94a3b8;">Módulo Aeronaval IJN • Misiones de Reconocimiento y Ataque</div>
      </div>
    </div>
    <div style="display:flex; gap:6px; flex-wrap:wrap;">
      <button type="button" onclick="openModalViewer('Tabla P3: Encuentros', '', 'P3')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#38bdf8; color:#7dd3fc; background:transparent;">🔭 Tabla P3: Encuentros</button>
      <button type="button" onclick="openModalViewer('Tabla P4: Combate', '', 'P4')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#f43f5e; color:#fda4af; background:rgba(244,63,94,0.35); font-weight:bold;">⚔️ Tabla P4: Combate</button>
      <button type="button" onclick="openModalViewer('Tabla P5: Fuego AA', '', 'P5')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#f97316; color:#fdba74; background:transparent;">💥 Tabla P5: Fuego AA</button>
      <button type="button" onclick="openModalViewer('Tabla P6: Bombardeo', '', 'P6')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#eab308; color:#fde047; background:transparent;">💣 Tabla P6: Bombardeo</button>
      <button type="button" onclick="openModalViewer('Tablas P3-P6: Todas', '', 'P3_P6')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#a855f7; color:#d8b4fe; background:transparent;">📜 Tablas P3-P6: Todas</button>
    </div>
  </div>
  <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:12px;">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid #991b1b; padding-bottom:6px; flex-wrap:wrap; gap:8px;">
      <div>
        <strong style="color:#fca5a5; font-size:0.95rem;">TABLA P4: COMBATE AÉREO DEFENSIVO</strong>
      </div>
      <div style="font-size:0.82rem; color:#fca5a5; background:rgba(239,68,68,0.2); padding:3px 8px; border-radius:4px; border:1px solid #ef4444;">
        1. El caza ataca primero • 2. El hidroavión responde con ametralladora
      </div>
    </div>

    <div style="font-size:0.84rem; color:#cbd5e1; margin-bottom:10px; line-height:1.4;">
      <strong>Reglas de Combate Aéreo:</strong> El combate no es simultáneo y dura un máximo de <strong>3 rondas</strong>. 3 puntos de daño a cualquiera de los aviones lo destruye. Si sigue volando al término de la 3.ª ronda, el hidroavión evade y escapa.
    </div>

    <div style="font-size:0.84rem; color:#fca5a5; margin-bottom:10px; padding-bottom:6px; border-bottom:1px solid #991b1b;">
      El caza ataca primero (1d6 frente a la maniobra elegida del 1 al 6). El hidroavión responde con ametralladora trasera (2d6):
    </div>

    <!-- Matrix -->
    <div style="overflow-x:auto; margin-bottom:10px;">
      <table style="width:100%; border-collapse:collapse; font-size:0.86rem; text-align:center;">
        <thead>
          <tr>
            <th rowspan="2" style="background:#0f172a; color:#94a3b8; border:1px solid #475569; padding:6px; font-size:0.82rem; vertical-align:middle;">
              El hidroavión<br>elige #
            </th>
            <th colspan="6" style="background:#991b1b; color:#f8fafc; border:1px solid #ef4444; padding:5px; font-weight:bold;">
              ...el caza enemigo tira 1d6:
            </th>
          </tr>
          <tr style="background:#7f1d1d; color:#fde047;">
            <th style="padding:4px; border:1px solid #ef4444; width:14%;">1</th>
            <th style="padding:4px; border:1px solid #ef4444; width:14%;">2</th>
            <th style="padding:4px; border:1px solid #ef4444; width:14%;">3</th>
            <th style="padding:4px; border:1px solid #ef4444; width:14%;">4</th>
            <th style="padding:4px; border:1px solid #ef4444; width:14%;">5</th>
            <th style="padding:4px; border:1px solid #ef4444; width:14%;">6</th>
          </tr>
        </thead>
        <tbody>
          <tr id="p4-matrix-row-1" style="border-bottom:1px solid #1e293b;">
            <td style="background:#0f172a; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">1</td>
            <td id="p4-cell-1-1" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
            <td id="p4-cell-1-2" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
            <td id="p4-cell-1-3" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#94a3b8;">0</td>
            <td id="p4-cell-1-4" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
            <td id="p4-cell-1-5" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
            <td id="p4-cell-1-6" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
          </tr>
          <tr id="p4-matrix-row-2" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.2);">
            <td style="background:#0f172a; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">2</td>
            <td id="p4-cell-2-1" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
            <td id="p4-cell-2-2" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
            <td id="p4-cell-2-3" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
            <td id="p4-cell-2-4" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#94a3b8;">0</td>
            <td id="p4-cell-2-5" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
            <td id="p4-cell-2-6" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
          </tr>
          <tr id="p4-matrix-row-3" style="border-bottom:1px solid #1e293b;">
            <td style="background:#0f172a; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">3</td>
            <td id="p4-cell-3-1" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
            <td id="p4-cell-3-2" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#94a3b8;">0</td>
            <td id="p4-cell-3-3" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
            <td id="p4-cell-3-4" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
            <td id="p4-cell-3-5" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
            <td id="p4-cell-3-6" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
          </tr>
          <tr id="p4-matrix-row-4" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.2);">
            <td style="background:#0f172a; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">4</td>
            <td id="p4-cell-4-1" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
            <td id="p4-cell-4-2" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
            <td id="p4-cell-4-3" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#94a3b8;">0</td>
            <td id="p4-cell-4-4" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
            <td id="p4-cell-4-5" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
            <td id="p4-cell-4-6" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
          </tr>
          <tr id="p4-matrix-row-5" style="border-bottom:1px solid #1e293b;">
            <td style="background:#0f172a; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">5</td>
            <td id="p4-cell-5-1" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
            <td id="p4-cell-5-2" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
            <td id="p4-cell-5-3" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
            <td id="p4-cell-5-4" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#94a3b8;">0</td>
            <td id="p4-cell-5-5" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
            <td id="p4-cell-5-6" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
          </tr>
          <tr id="p4-matrix-row-6" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.2);">
            <td style="background:#0f172a; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">6</td>
            <td id="p4-cell-6-1" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
            <td id="p4-cell-6-2" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
            <td id="p4-cell-6-3" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
            <td id="p4-cell-6-4" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
            <td id="p4-cell-6-5" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#94a3b8;">0</td>
            <td id="p4-cell-6-6" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="font-size:0.80rem; color:#94a3b8; display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px; border-top:1px solid #334155; padding-top:8px;">
      <div><strong>#</strong> = Impactos al hidroavión | <strong style="color:#4ade80;">E</strong> = ¡Evasión exitosa! Termina el encuentro.</div>
<div style="color:#7dd3fc;">Ametralladora trasera: <strong>2</strong>=3 impactos (DE) | <strong>3-4</strong>=2 impactos | <strong>5-6</strong>=1 impacto | <strong>7-12</strong>=Fallo</div>
    </div>
  </div>
</div>`,
        en: `<div class="ocr-board-p4" style="background:#0f172a; border:2px solid #ef4444; border-radius:10px; padding:16px; color:#f1f5f9; font-family:'Segoe UI', Roboto, sans-serif; box-shadow:0 8px 30px rgba(0,0,0,0.7);">
  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #0284c7; padding-bottom:10px; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
    <div style="display:flex; align-items:center; gap:10px;">
      <span style="background:#0284c7; color:#fff; font-size:0.75rem; font-weight:900; padding:3px 8px; border-radius:4px; letter-spacing:1px;">OFFICIAL RULE 7.17</span>
      <div>
        <h2 style="margin:0; font-family:'Cinzel', serif; font-size:1.25rem; color:#38bdf8;">CHART P4: DEFENSIVE AIR COMBAT & REAR GUN</h2>
        <div style="font-size:0.75rem; color:#94a3b8;">IJN Air Module • Reconnaissance & Strike Missions</div>
      </div>
    </div>
    <div style="display:flex; gap:6px; flex-wrap:wrap;">
      <button type="button" onclick="openModalViewer('Chart P3: Encounters', '', 'P3')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#38bdf8; color:#7dd3fc; background:transparent;">🔭 Chart P3: Encounters</button>
      <button type="button" onclick="openModalViewer('Chart P4: Air Combat', '', 'P4')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#f43f5e; color:#fda4af; background:rgba(244,63,94,0.35); font-weight:bold;">⚔️ Chart P4: Air Combat</button>
      <button type="button" onclick="openModalViewer('Chart P5: AA Flak', '', 'P5')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#f97316; color:#fdba74; background:transparent;">💥 Chart P5: AA Flak</button>
      <button type="button" onclick="openModalViewer('Chart P6: Bombing', '', 'P6')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#eab308; color:#fde047; background:transparent;">💣 Chart P6: Bombing</button>
      <button type="button" onclick="openModalViewer('Charts P3-P6: All', '', 'P3_P6')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#a855f7; color:#d8b4fe; background:transparent;">📜 Charts P3-P6: All</button>
    </div>
  </div>
  <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:12px;">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid #991b1b; padding-bottom:6px; flex-wrap:wrap; gap:8px;">
      <div>
        <strong style="color:#fca5a5; font-size:0.95rem;">CHART P4: AIR-TO-AIR COMBAT</strong>
      </div>
      <div style="font-size:0.82rem; color:#fca5a5; background:rgba(239,68,68,0.2); padding:3px 8px; border-radius:4px; border:1px solid #ef4444;">
        1. Fighter attacks first • 2. Floatplane returns fire with rear gun
      </div>
    </div>

    <div style="font-size:0.84rem; color:#cbd5e1; margin-bottom:10px; line-height:1.4;">
      <strong>Air Combat Rules:</strong> Combat is non-simultaneous and lasts up to <strong>3 rounds</strong>. 3 damage points destroys either aircraft. If still flying after round 3, the floatplane evades and escapes.
    </div>

    <div style="font-size:0.84rem; color:#fca5a5; margin-bottom:10px; padding-bottom:6px; border-bottom:1px solid #991b1b;">
      Fighter attacks first (1d6 against chosen floatplane maneuver 1-6). Floatplane replies with rear machine gun (2d6):
    </div>

    <!-- Matrix -->
    <div style="overflow-x:auto; margin-bottom:10px;">
      <table style="width:100%; border-collapse:collapse; font-size:0.86rem; text-align:center;">
        <thead>
          <tr>
            <th rowspan="2" style="background:#0f172a; color:#94a3b8; border:1px solid #475569; padding:6px; font-size:0.82rem; vertical-align:middle;">
              Floatplane<br>chooses #
            </th>
            <th colspan="6" style="background:#991b1b; color:#f8fafc; border:1px solid #ef4444; padding:5px; font-weight:bold;">
              ...then enemy Fighter rolls 1d6:
            </th>
          </tr>
          <tr style="background:#7f1d1d; color:#fde047;">
            <th style="padding:4px; border:1px solid #ef4444; width:14%;">1</th>
            <th style="padding:4px; border:1px solid #ef4444; width:14%;">2</th>
            <th style="padding:4px; border:1px solid #ef4444; width:14%;">3</th>
            <th style="padding:4px; border:1px solid #ef4444; width:14%;">4</th>
            <th style="padding:4px; border:1px solid #ef4444; width:14%;">5</th>
            <th style="padding:4px; border:1px solid #ef4444; width:14%;">6</th>
          </tr>
        </thead>
        <tbody>
          <tr id="p4-matrix-row-1" style="border-bottom:1px solid #1e293b;">
            <td style="background:#0f172a; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">1</td>
            <td id="p4-cell-1-1" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
            <td id="p4-cell-1-2" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
            <td id="p4-cell-1-3" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#94a3b8;">0</td>
            <td id="p4-cell-1-4" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
            <td id="p4-cell-1-5" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
            <td id="p4-cell-1-6" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
          </tr>
          <tr id="p4-matrix-row-2" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.2);">
            <td style="background:#0f172a; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">2</td>
            <td id="p4-cell-2-1" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
            <td id="p4-cell-2-2" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
            <td id="p4-cell-2-3" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
            <td id="p4-cell-2-4" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#94a3b8;">0</td>
            <td id="p4-cell-2-5" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
            <td id="p4-cell-2-6" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
          </tr>
          <tr id="p4-matrix-row-3" style="border-bottom:1px solid #1e293b;">
            <td style="background:#0f172a; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">3</td>
            <td id="p4-cell-3-1" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
            <td id="p4-cell-3-2" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#94a3b8;">0</td>
            <td id="p4-cell-3-3" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
            <td id="p4-cell-3-4" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
            <td id="p4-cell-3-5" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
            <td id="p4-cell-3-6" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
          </tr>
          <tr id="p4-matrix-row-4" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.2);">
            <td style="background:#0f172a; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">4</td>
            <td id="p4-cell-4-1" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
            <td id="p4-cell-4-2" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
            <td id="p4-cell-4-3" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#94a3b8;">0</td>
            <td id="p4-cell-4-4" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
            <td id="p4-cell-4-5" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
            <td id="p4-cell-4-6" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
          </tr>
          <tr id="p4-matrix-row-5" style="border-bottom:1px solid #1e293b;">
            <td style="background:#0f172a; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">5</td>
            <td id="p4-cell-5-1" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
            <td id="p4-cell-5-2" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
            <td id="p4-cell-5-3" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
            <td id="p4-cell-5-4" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#94a3b8;">0</td>
            <td id="p4-cell-5-5" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
            <td id="p4-cell-5-6" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
          </tr>
          <tr id="p4-matrix-row-6" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.2);">
            <td style="background:#0f172a; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">6</td>
            <td id="p4-cell-6-1" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
            <td id="p4-cell-6-2" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
            <td id="p4-cell-6-3" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
            <td id="p4-cell-6-4" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
            <td id="p4-cell-6-5" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#94a3b8;">0</td>
            <td id="p4-cell-6-6" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="font-size:0.80rem; color:#94a3b8; display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px; border-top:1px solid #334155; padding-top:8px;">
      <div><strong>#</strong> = Damage hits on floatplane | <strong style="color:#4ade80;">E</strong> = Successful Evasion! Encounter ends.</div>
<div style="color:#7dd3fc;">Rear machine gun: <strong>2</strong>=3 hits (Destroyed) | <strong>3-4</strong>=2 hits | <strong>5-6</strong>=1 hit | <strong>7-12</strong>=Miss</div>
    </div>
  </div>
</div>`,
        toString() { return (typeof window !== 'undefined' && window.currentLang === 'en') ? this.en : this.es; }
      },
      "P5": {
        es: `<div class="ocr-board-p5" style="background:#0f172a; border:2px solid #f97316; border-radius:10px; padding:16px; color:#f1f5f9; font-family:'Segoe UI', Roboto, sans-serif; box-shadow:0 8px 30px rgba(0,0,0,0.7);">
  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #0284c7; padding-bottom:10px; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
    <div style="display:flex; align-items:center; gap:10px;">
      <span style="background:#0284c7; color:#fff; font-size:0.75rem; font-weight:900; padding:3px 8px; border-radius:4px; letter-spacing:1px;">REGLA OFICIAL 7.17</span>
      <div>
        <h2 style="margin:0; font-family:'Cinzel', serif; font-size:1.25rem; color:#38bdf8;">TABLA P5: FUEGO ANTIAÉREO (FLAK - 2d6)</h2>
        <div style="font-size:0.75rem; color:#94a3b8;">Módulo Aeronaval IJN • Misiones de Reconocimiento y Ataque</div>
      </div>
    </div>
    <div style="display:flex; gap:6px; flex-wrap:wrap;">
      <button type="button" onclick="openModalViewer('Tabla P3: Encuentros', '', 'P3')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#38bdf8; color:#7dd3fc; background:transparent;">🔭 Tabla P3: Encuentros</button>
      <button type="button" onclick="openModalViewer('Tabla P4: Combate', '', 'P4')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#f43f5e; color:#fda4af; background:transparent;">⚔️ Tabla P4: Combate</button>
      <button type="button" onclick="openModalViewer('Tabla P5: Fuego AA', '', 'P5')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#f97316; color:#fdba74; background:rgba(249,115,22,0.35); font-weight:bold;">💥 Tabla P5: Fuego AA</button>
      <button type="button" onclick="openModalViewer('Tabla P6: Bombardeo', '', 'P6')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#eab308; color:#fde047; background:transparent;">💣 Tabla P6: Bombardeo</button>
      <button type="button" onclick="openModalViewer('Tablas P3-P6: Todas', '', 'P3_P6')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#a855f7; color:#d8b4fe; background:transparent;">📜 Tablas P3-P6: Todas</button>
    </div>
  </div>
  <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:12px;">
    <div style="margin-bottom:10px; border-bottom:1px solid #c2410c; padding-bottom:6px;">
      <strong style="color:#fdba74; font-size:0.95rem;">TABLA P5: FUEGO ANTIAÉREO (2d6)</strong>
      <div style="font-size:0.82rem; color:#94a3b8; margin-top:2px;">Tirada de 2d6 frente a baterías costeras o fondeaderos navales:</div>
    </div>

    <!-- Table -->
    <div style="overflow-x:auto;">
      <table style="width:100%; border-collapse:collapse; font-size:0.86rem;">
        <thead>
          <tr style="background:#c2410c; color:#f8fafc;">
            <th style="padding:6px 8px; border:1px solid #ea580c; width:50px; text-align:center;">Tirada</th>
            <th style="padding:6px 8px; border:1px solid #ea580c; width:110px; text-align:center;">Resultado</th>
            <th style="padding:6px 8px; border:1px solid #ea580c;">Efecto y Detalles</th>
          </tr>
        </thead>
        <tbody>
          <tr id="p5-row-2" class="p5-row" style="border-bottom:1px solid #1e293b;"><td style="padding:5px; text-align:center; font-weight:bold; color:var(--gold-400);">2 - 7</td><td style="padding:5px; text-align:center; color:#94a3b8;">Inefectivo</td><td style="padding:5px; color:#64748b;">Fuego disperso, sin daños al aparato.</td></tr>
          <tr id="p5-row-8" class="p5-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:5px; text-align:center; font-weight:bold; color:var(--gold-400);">8</td><td style="padding:5px; text-align:center; color:#fde047; font-weight:bold;">1 pt. de Daño</td><td style="padding:5px; color:#fde68a;">Impacto cercano (metralla o roce leve).</td></tr>
          <tr id="p5-row-9" class="p5-row" style="border-bottom:1px solid #1e293b;"><td style="padding:5px; text-align:center; font-weight:bold; color:var(--gold-400);">9</td><td style="padding:5px; text-align:center; color:#fb923c; font-weight:bold;">1 pt. de Daño</td><td style="padding:5px; color:#fdba74;">Tira herida en dotación (Tabla B8): 1-3 piloto, 4-6 observador.</td></tr>
          <tr id="p5-row-10" class="p5-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:5px; text-align:center; font-weight:bold; color:var(--gold-400);">10</td><td style="padding:5px; text-align:center; color:#f87171; font-weight:bold;">2 pts. de Daño</td><td style="padding:5px; color:#fca5a5;">Daño estructural severo en fuselaje o alas.</td></tr>
          <tr id="p5-row-11" class="p5-row" style="border-bottom:1px solid #1e293b;"><td style="padding:5px; text-align:center; font-weight:bold; color:var(--gold-400);">11</td><td style="padding:5px; text-align:center; color:#f87171; font-weight:bold;">2 pts. de Daño</td><td style="padding:5px; color:#fdba74;">Tira herida en dotación (Tabla B8): 1-3 piloto, 4-6 observador.</td></tr>
          <tr id="p5-row-12" class="p5-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:5px; text-align:center; font-weight:bold; color:var(--gold-400);">12</td><td style="padding:5px; text-align:center; color:#b91c1c; font-weight:900; background:rgba(185,28,28,0.25);">3 pts. de Daño</td><td style="padding:5px; color:#fca5a5; font-weight:bold;">¡Impacto directo! ¡Hidroavión destruido en el aire!</td></tr>
        </tbody>
      </table>
    </div>

    <div style="font-size:0.80rem; color:#94a3b8; margin-top:10px; border-top:1px solid #334155; padding-top:8px;">
      💥 Un hidroavión con 3 puntos de daño acumulados se estrella en el mar.
    </div>
  </div>
</div>`,
        en: `<div class="ocr-board-p5" style="background:#0f172a; border:2px solid #f97316; border-radius:10px; padding:16px; color:#f1f5f9; font-family:'Segoe UI', Roboto, sans-serif; box-shadow:0 8px 30px rgba(0,0,0,0.7);">
  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #0284c7; padding-bottom:10px; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
    <div style="display:flex; align-items:center; gap:10px;">
      <span style="background:#0284c7; color:#fff; font-size:0.75rem; font-weight:900; padding:3px 8px; border-radius:4px; letter-spacing:1px;">OFFICIAL RULE 7.17</span>
      <div>
        <h2 style="margin:0; font-family:'Cinzel', serif; font-size:1.25rem; color:#38bdf8;">CHART P5: ANTI-AIRCRAFT FIRE (FLAK - 2d6)</h2>
        <div style="font-size:0.75rem; color:#94a3b8;">IJN Air Module • Reconnaissance & Strike Missions</div>
      </div>
    </div>
    <div style="display:flex; gap:6px; flex-wrap:wrap;">
      <button type="button" onclick="openModalViewer('Chart P3: Encounters', '', 'P3')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#38bdf8; color:#7dd3fc; background:transparent;">🔭 Chart P3: Encounters</button>
      <button type="button" onclick="openModalViewer('Chart P4: Air Combat', '', 'P4')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#f43f5e; color:#fda4af; background:transparent;">⚔️ Chart P4: Air Combat</button>
      <button type="button" onclick="openModalViewer('Chart P5: AA Flak', '', 'P5')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#f97316; color:#fdba74; background:rgba(249,115,22,0.35); font-weight:bold;">💥 Chart P5: AA Flak</button>
      <button type="button" onclick="openModalViewer('Chart P6: Bombing', '', 'P6')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#eab308; color:#fde047; background:transparent;">💣 Chart P6: Bombing</button>
      <button type="button" onclick="openModalViewer('Charts P3-P6: All', '', 'P3_P6')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#a855f7; color:#d8b4fe; background:transparent;">📜 Charts P3-P6: All</button>
    </div>
  </div>
  <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:12px;">
    <div style="margin-bottom:10px; border-bottom:1px solid #c2410c; padding-bottom:6px;">
      <strong style="color:#fdba74; font-size:0.95rem;">CHART P5: AA FLAK FIRE (2d6)</strong>
      <div style="font-size:0.82rem; color:#94a3b8; margin-top:2px;">Roll 2d6 against harbor shore batteries or fleet flak screens:</div>
    </div>

    <!-- Table -->
    <div style="overflow-x:auto;">
      <table style="width:100%; border-collapse:collapse; font-size:0.86rem;">
        <thead>
          <tr style="background:#c2410c; color:#f8fafc;">
            <th style="padding:6px 8px; border:1px solid #ea580c; width:50px; text-align:center;">Roll</th>
            <th style="padding:6px 8px; border:1px solid #ea580c; width:110px; text-align:center;">Result</th>
            <th style="padding:6px 8px; border:1px solid #ea580c;">Damage Effect & Details</th>
          </tr>
        </thead>
        <tbody>
          <tr id="p5-row-2" class="p5-row" style="border-bottom:1px solid #1e293b;"><td style="padding:5px; text-align:center; font-weight:bold; color:var(--gold-400);">2 - 7</td><td style="padding:5px; text-align:center; color:#94a3b8;">Ineffective</td><td style="padding:5px; color:#64748b;">Scattered flak, no hits on floatplane.</td></tr>
          <tr id="p5-row-8" class="p5-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:5px; text-align:center; font-weight:bold; color:var(--gold-400);">8</td><td style="padding:5px; text-align:center; color:#fde047; font-weight:bold;">1 pt. Damage</td><td style="padding:5px; color:#fde68a;">Close call (near-miss shrapnel / light scrape).</td></tr>
          <tr id="p5-row-9" class="p5-row" style="border-bottom:1px solid #1e293b;"><td style="padding:5px; text-align:center; font-weight:bold; color:var(--gold-400);">9</td><td style="padding:5px; text-align:center; color:#fb923c; font-weight:bold;">1 pt. Damage</td><td style="padding:5px; color:#fdba74;">Roll crew injury (Chart B8): 1-3 pilot, 4-6 observer.</td></tr>
          <tr id="p5-row-10" class="p5-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:5px; text-align:center; font-weight:bold; color:var(--gold-400);">10</td><td style="padding:5px; text-align:center; color:#f87171; font-weight:bold;">2 pts. Damage</td><td style="padding:5px; color:#fca5a5;">Severe structural damage to fuselage or wings.</td></tr>
          <tr id="p5-row-11" class="p5-row" style="border-bottom:1px solid #1e293b;"><td style="padding:5px; text-align:center; font-weight:bold; color:var(--gold-400);">11</td><td style="padding:5px; text-align:center; color:#f87171; font-weight:bold;">2 pts. Damage</td><td style="padding:5px; color:#fdba74;">Roll crew injury (Chart B8): 1-3 pilot, 4-6 observer.</td></tr>
          <tr id="p5-row-12" class="p5-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:5px; text-align:center; font-weight:bold; color:var(--gold-400);">12</td><td style="padding:5px; text-align:center; color:#b91c1c; font-weight:900; background:rgba(185,28,28,0.25);">3 pts. Damage</td><td style="padding:5px; color:#fca5a5; font-weight:bold;">Direct hit; Floatplane blown out of the sky!</td></tr>
        </tbody>
      </table>
    </div>

    <div style="font-size:0.80rem; color:#94a3b8; margin-top:10px; border-top:1px solid #334155; padding-top:8px;">
      💥 A floatplane accumulating 3 damage points crashes into the sea.
    </div>
  </div>
</div>`,
        toString() { return (typeof window !== 'undefined' && window.currentLang === 'en') ? this.en : this.es; }
      },
      "P6": {
        es: `<div class="ocr-board-p6" style="background:#0f172a; border:2px solid #ca8a04; border-radius:10px; padding:16px; color:#f1f5f9; font-family:'Segoe UI', Roboto, sans-serif; box-shadow:0 8px 30px rgba(0,0,0,0.7);">
  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #0284c7; padding-bottom:10px; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
    <div style="display:flex; align-items:center; gap:10px;">
      <span style="background:#0284c7; color:#fff; font-size:0.75rem; font-weight:900; padding:3px 8px; border-radius:4px; letter-spacing:1px;">REGLA OFICIAL 7.17</span>
      <div>
        <h2 style="margin:0; font-family:'Cinzel', serif; font-size:1.25rem; color:#38bdf8;">TABLA P6: BOMBARDEO AÉREO (1d6)</h2>
        <div style="font-size:0.75rem; color:#94a3b8;">Módulo Aeronaval IJN • Misiones de Reconocimiento y Ataque</div>
      </div>
    </div>
    <div style="display:flex; gap:6px; flex-wrap:wrap;">
      <button type="button" onclick="openModalViewer('Tabla P3: Encuentros', '', 'P3')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#38bdf8; color:#7dd3fc; background:transparent;">🔭 Tabla P3: Encuentros</button>
      <button type="button" onclick="openModalViewer('Tabla P4: Combate', '', 'P4')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#f43f5e; color:#fda4af; background:transparent;">⚔️ Tabla P4: Combate</button>
      <button type="button" onclick="openModalViewer('Tabla P5: Fuego AA', '', 'P5')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#f97316; color:#fdba74; background:transparent;">💥 Tabla P5: Fuego AA</button>
      <button type="button" onclick="openModalViewer('Tabla P6: Bombardeo', '', 'P6')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#eab308; color:#fde047; background:rgba(234,179,8,0.35); font-weight:bold;">💣 Tabla P6: Bombardeo</button>
      <button type="button" onclick="openModalViewer('Tablas P3-P6: Todas', '', 'P3_P6')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#a855f7; color:#d8b4fe; background:transparent;">📜 Tablas P3-P6: Todas</button>
    </div>
  </div>
  <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:12px;">
    <div style="margin-bottom:10px; border-bottom:1px solid #854d0e; padding-bottom:6px;">
      <strong style="color:#fde047; font-size:0.95rem;">TABLA P6: BOMBARDEO AÉREO (1d6)</strong>
      <div style="font-size:0.82rem; color:#fde68a; margin-top:2px;">Lanzamiento en el Círculo de Objetivo tras resolver los encuentros:</div>
    </div>

    <!-- Table -->
    <table style="width:100%; border-collapse:collapse; font-size:0.86rem;">
      <thead>
        <tr style="background:#854d0e; color:#f8fafc;">
          <th style="padding:6px 8px; border:1px solid #ca8a04; width:55px; text-align:center;">1d6</th>
          <th style="padding:6px 8px; border:1px solid #ca8a04;">Resultado (Efecto de Bombardeo)</th>
        </tr>
      </thead>
      <tbody>
        <tr id="p6-row-1-2" class="p6-row" style="border-bottom:1px solid #1e293b;">
          <td style="padding:8px; text-align:center; font-weight:bold; color:var(--gold-400);">1 - 2</td>
          <td style="padding:8px; color:#94a3b8; font-weight:bold;">Fallo</td>
        </tr>
        <tr id="p6-row-3-5" class="p6-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);">
          <td style="padding:8px; text-align:center; font-weight:bold; color:var(--gold-400);">3 - 5</td>
          <td style="padding:8px; color:#fde047; font-weight:bold;">Daño Moderado</td>
        </tr>
        <tr id="p6-row-6" class="p6-row" style="border-bottom:1px solid #1e293b;">
          <td style="padding:8px; text-align:center; font-weight:bold; color:var(--gold-400);">6</td>
          <td style="padding:8px; color:#4ade80; font-weight:bold;">Daño Severo</td>
        </tr>
      </tbody>
    </table>

    <div style="font-size:0.80rem; color:#94a3b8; margin-top:10px; border-top:1px solid #334155; padding-top:8px;">
      🎯 En el Canal de Panamá, infligir daño moderado o severo completa la misión con honores navales.
    </div>
  </div>
</div>`,
        en: `<div class="ocr-board-p6" style="background:#0f172a; border:2px solid #ca8a04; border-radius:10px; padding:16px; color:#f1f5f9; font-family:'Segoe UI', Roboto, sans-serif; box-shadow:0 8px 30px rgba(0,0,0,0.7);">
  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #0284c7; padding-bottom:10px; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
    <div style="display:flex; align-items:center; gap:10px;">
      <span style="background:#0284c7; color:#fff; font-size:0.75rem; font-weight:900; padding:3px 8px; border-radius:4px; letter-spacing:1px;">OFFICIAL RULE 7.17</span>
      <div>
        <h2 style="margin:0; font-family:'Cinzel', serif; font-size:1.25rem; color:#38bdf8;">CHART P6: AERIAL BOMBING (1d6)</h2>
        <div style="font-size:0.75rem; color:#94a3b8;">IJN Air Module • Reconnaissance & Strike Missions</div>
      </div>
    </div>
    <div style="display:flex; gap:6px; flex-wrap:wrap;">
      <button type="button" onclick="openModalViewer('Chart P3: Encounters', '', 'P3')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#38bdf8; color:#7dd3fc; background:transparent;">🔭 Chart P3: Encounters</button>
      <button type="button" onclick="openModalViewer('Chart P4: Air Combat', '', 'P4')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#f43f5e; color:#fda4af; background:transparent;">⚔️ Chart P4: Air Combat</button>
      <button type="button" onclick="openModalViewer('Chart P5: AA Flak', '', 'P5')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#f97316; color:#fdba74; background:transparent;">💥 Chart P5: AA Flak</button>
      <button type="button" onclick="openModalViewer('Chart P6: Bombing', '', 'P6')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#eab308; color:#fde047; background:rgba(234,179,8,0.35); font-weight:bold;">💣 Chart P6: Bombing</button>
      <button type="button" onclick="openModalViewer('Charts P3-P6: All', '', 'P3_P6')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#a855f7; color:#d8b4fe; background:transparent;">📜 Charts P3-P6: All</button>
    </div>
  </div>
  <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:12px;">
    <div style="margin-bottom:10px; border-bottom:1px solid #854d0e; padding-bottom:6px;">
      <strong style="color:#fde047; font-size:0.95rem;">CHART P6: AERIAL BOMBING (1d6)</strong>
      <div style="font-size:0.82rem; color:#fde68a; margin-top:2px;">Drop in Target Circle after resolving any Encounters:</div>
    </div>

    <!-- Table -->
    <table style="width:100%; border-collapse:collapse; font-size:0.86rem;">
      <thead>
        <tr style="background:#854d0e; color:#f8fafc;">
          <th style="padding:6px 8px; border:1px solid #ca8a04; width:55px; text-align:center;">1d6</th>
          <th style="padding:6px 8px; border:1px solid #ca8a04;">Result (Bombing Effect)</th>
        </tr>
      </thead>
      <tbody>
        <tr id="p6-row-1-2" class="p6-row" style="border-bottom:1px solid #1e293b;">
          <td style="padding:8px; text-align:center; font-weight:bold; color:var(--gold-400);">1 - 2</td>
          <td style="padding:8px; color:#94a3b8; font-weight:bold;">Miss</td>
        </tr>
        <tr id="p6-row-3-5" class="p6-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);">
          <td style="padding:8px; text-align:center; font-weight:bold; color:var(--gold-400);">3 - 5</td>
          <td style="padding:8px; color:#fde047; font-weight:bold;">Moderate Damage</td>
        </tr>
        <tr id="p6-row-6" class="p6-row" style="border-bottom:1px solid #1e293b;">
          <td style="padding:8px; text-align:center; font-weight:bold; color:var(--gold-400);">6</td>
          <td style="padding:8px; color:#4ade80; font-weight:bold;">Heavy Damage</td>
        </tr>
      </tbody>
    </table>

    <div style="font-size:0.80rem; color:#94a3b8; margin-top:10px; border-top:1px solid #334155; padding-top:8px;">
      🎯 At Panama Canal, moderate or severe damage completes the mission with naval honors.
    </div>
  </div>
</div>`,
        toString() { return (typeof window !== 'undefined' && window.currentLang === 'en') ? this.en : this.es; }
      },
      "P3_P6": {
        es: `<div class="ocr-board-all-p" style="background:#0f172a; border:2px solid #a855f7; border-radius:10px; padding:16px; color:#f1f5f9; font-family:'Segoe UI', Roboto, sans-serif; box-shadow:0 8px 30px rgba(0,0,0,0.7);">
  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #0284c7; padding-bottom:10px; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
    <div style="display:flex; align-items:center; gap:10px;">
      <span style="background:#0284c7; color:#fff; font-size:0.75rem; font-weight:900; padding:3px 8px; border-radius:4px; letter-spacing:1px;">REGLA OFICIAL 7.17</span>
      <div>
        <h2 style="margin:0; font-family:'Cinzel', serif; font-size:1.25rem; color:#38bdf8;">TABLAS P3 A P6: OPERACIONES DE HIDROAVIÓN EMBARCADO</h2>
        <div style="font-size:0.75rem; color:#94a3b8;">Módulo Aeronaval IJN • Misiones de Reconocimiento y Ataque</div>
      </div>
    </div>
    <div style="display:flex; gap:6px; flex-wrap:wrap;">
      <button type="button" onclick="openModalViewer('Tabla P3: Encuentros', '', 'P3')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#38bdf8; color:#7dd3fc; background:transparent;">🔭 Tabla P3: Encuentros</button>
      <button type="button" onclick="openModalViewer('Tabla P4: Combate', '', 'P4')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#f43f5e; color:#fda4af; background:transparent;">⚔️ Tabla P4: Combate</button>
      <button type="button" onclick="openModalViewer('Tabla P5: Fuego AA', '', 'P5')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#f97316; color:#fdba74; background:transparent;">💥 Tabla P5: Fuego AA</button>
      <button type="button" onclick="openModalViewer('Tabla P6: Bombardeo', '', 'P6')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#eab308; color:#fde047; background:transparent;">💣 Tabla P6: Bombardeo</button>
      <button type="button" onclick="openModalViewer('Tablas P3-P6: Todas', '', 'P3_P6')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#a855f7; color:#d8b4fe; background:rgba(168,85,247,0.35); font-weight:bold;">📜 Tablas P3-P6: Todas</button>
    </div>
  </div>
  <div style="display:grid; grid-template-columns: 2fr 1fr; gap:16px; margin-bottom:16px;">
    <div><div class="ocr-board-p3" style="background:#0f172a; border:2px solid #0284c7; border-radius:10px; padding:16px; color:#f1f5f9; font-family:'Segoe UI', Roboto, sans-serif; box-shadow:0 8px 30px rgba(0,0,0,0.7);">

  <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:12px;">
    <div style="font-size:0.84rem; color:#94a3b8; margin-bottom:10px; padding-bottom:6px; border-bottom:1px solid #0369a1;">
      Tirada de 2d6 en cada círculo de aproximación según la fase de vuelo (Tránsito, Reconocimiento u Objetivo):
    </div>

    <!-- Table -->
    <div style="overflow-x:auto;">
      <table style="width:100%; border-collapse:collapse; font-size:0.86rem; text-align:center;">
        <thead>
          <tr style="background:#0369a1; color:#f8fafc;">
            <th style="padding:6px 8px; border:1px solid #0284c7; width:45px;">2d6</th>
            <th style="padding:6px 8px; border:1px solid #0284c7;">Tránsito</th>
            <th style="padding:6px 8px; border:1px solid #0284c7;">Reconocimiento</th>
            <th style="padding:6px 8px; border:1px solid #0284c7; background:#0284c7; color:#fde047;">Objetivo (Recon)</th>
            <th style="padding:6px 8px; border:1px solid #0284c7;">Objetivo (Bombardeo)</th>
          </tr>
        </thead>
        <tbody>
          <tr id="p3-row-2" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">2</td><td style="color:#64748b;">--</td><td style="color:#fda4af; font-weight:bold;">Avión</td><td style="color:#fde047; font-weight:bold;">Buque Capital</td><td style="color:#fda4af; font-weight:bold;">Avión</td></tr>
          <tr id="p3-row-3" class="p3-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">3</td><td style="color:#fda4af; font-weight:bold;">Avión</td><td style="color:#93c5fd;">Buque</td><td style="color:#93c5fd; font-weight:bold;">Buque de Guerra</td><td style="color:#64748b;">--</td></tr>
          <tr id="p3-row-4" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">4</td><td style="color:#64748b;">--</td><td style="color:#64748b;">--</td><td style="color:#93c5fd;">Destructor (DD)</td><td style="color:#64748b;">--</td></tr>
          <tr id="p3-row-5" class="p3-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">5</td><td style="color:#64748b;">--</td><td style="color:#93c5fd;">Buque</td><td style="color:#93c5fd;">Crucero Pesado (CA)</td><td style="color:#64748b;">--</td></tr>
          <tr id="p3-row-6" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">6</td><td style="color:#64748b;">--</td><td style="color:#64748b;">--</td><td style="color:#64748b;">Sin Encuentro</td><td style="color:#64748b;">--</td></tr>
          <tr id="p3-row-7" class="p3-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">7</td><td style="color:#64748b;">--</td><td style="color:#64748b;">--</td><td style="color:#64748b;">Sin Encuentro</td><td style="color:#64748b;">--</td></tr>
          <tr id="p3-row-8" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">8</td><td style="color:#64748b;">--</td><td style="color:#64748b;">--</td><td style="color:#64748b;">Sin Encuentro</td><td style="color:#64748b;">--</td></tr>
          <tr id="p3-row-9" class="p3-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">9</td><td style="color:#64748b;">--</td><td style="color:#93c5fd;">Buque</td><td style="color:#93c5fd;">Crucero Pesado (CA)</td><td style="color:#f87171; font-weight:bold;">Antiaéreo (AA)*</td></tr>
          <tr id="p3-row-10" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">10</td><td style="color:#64748b;">--</td><td style="color:#64748b;">--</td><td style="color:#93c5fd;">Crucero Ligero (CL)</td><td style="color:#64748b;">--</td></tr>
          <tr id="p3-row-11" class="p3-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">11</td><td style="color:#64748b;">--</td><td style="color:#93c5fd;">Grupo de Buques</td><td style="color:#93c5fd; font-weight:bold;">Grupo de Buques</td><td style="color:#64748b;">--</td></tr>
          <tr id="p3-row-12" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">12</td><td style="color:#fda4af; font-weight:bold;">Avión</td><td style="color:#fda4af; font-weight:bold;">Avión</td><td style="color:#fde047; font-weight:bold;">Buque Capital</td><td style="color:#fda4af; font-weight:bold;">Avión*</td></tr>
        </tbody>
      </table>
    </div>

    <div style="font-size:0.80rem; color:#94a3b8; margin-top:10px; line-height:1.4; border-top:1px solid #334155; padding-top:8px;">
      • <em>Los avistamientos de buques durante misiones de reconocimiento no causan combate naval para el hidroavión, pero aportan valor narrativo y de inteligencia.</em><br>
• <strong>* Se aplica exclusivamente en misiones de bombardeo en el Canal de Panamá.</strong>
    </div>
  </div>
</div></div>
    <div><div class="ocr-board-p6" style="background:#0f172a; border:2px solid #ca8a04; border-radius:10px; padding:16px; color:#f1f5f9; font-family:'Segoe UI', Roboto, sans-serif; box-shadow:0 8px 30px rgba(0,0,0,0.7);">

  <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:12px;">
    <div style="margin-bottom:10px; border-bottom:1px solid #854d0e; padding-bottom:6px;">
      <strong style="color:#fde047; font-size:0.95rem;">TABLA P6: BOMBARDEO AÉREO (1d6)</strong>
      <div style="font-size:0.82rem; color:#fde68a; margin-top:2px;">Lanzamiento en el Círculo de Objetivo tras resolver los encuentros:</div>
    </div>

    <!-- Table -->
    <table style="width:100%; border-collapse:collapse; font-size:0.86rem;">
      <thead>
        <tr style="background:#854d0e; color:#f8fafc;">
          <th style="padding:6px 8px; border:1px solid #ca8a04; width:55px; text-align:center;">1d6</th>
          <th style="padding:6px 8px; border:1px solid #ca8a04;">Resultado (Efecto de Bombardeo)</th>
        </tr>
      </thead>
      <tbody>
        <tr id="p6-row-1-2" class="p6-row" style="border-bottom:1px solid #1e293b;">
          <td style="padding:8px; text-align:center; font-weight:bold; color:var(--gold-400);">1 - 2</td>
          <td style="padding:8px; color:#94a3b8; font-weight:bold;">Fallo</td>
        </tr>
        <tr id="p6-row-3-5" class="p6-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);">
          <td style="padding:8px; text-align:center; font-weight:bold; color:var(--gold-400);">3 - 5</td>
          <td style="padding:8px; color:#fde047; font-weight:bold;">Daño Moderado</td>
        </tr>
        <tr id="p6-row-6" class="p6-row" style="border-bottom:1px solid #1e293b;">
          <td style="padding:8px; text-align:center; font-weight:bold; color:var(--gold-400);">6</td>
          <td style="padding:8px; color:#4ade80; font-weight:bold;">Daño Severo</td>
        </tr>
      </tbody>
    </table>

    <div style="font-size:0.80rem; color:#94a3b8; margin-top:10px; border-top:1px solid #334155; padding-top:8px;">
      🎯 En el Canal de Panamá, infligir daño moderado o severo completa la misión con honores navales.
    </div>
  </div>
</div></div>
  </div>
  <div style="display:grid; grid-template-columns: 3fr 2fr; gap:16px;">
    <div><div class="ocr-board-p4" style="background:#0f172a; border:2px solid #ef4444; border-radius:10px; padding:16px; color:#f1f5f9; font-family:'Segoe UI', Roboto, sans-serif; box-shadow:0 8px 30px rgba(0,0,0,0.7);">

  <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:12px;">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid #991b1b; padding-bottom:6px; flex-wrap:wrap; gap:8px;">
      <div>
        <strong style="color:#fca5a5; font-size:0.95rem;">TABLA P4: COMBATE AÉREO DEFENSIVO</strong>
      </div>
      <div style="font-size:0.82rem; color:#fca5a5; background:rgba(239,68,68,0.2); padding:3px 8px; border-radius:4px; border:1px solid #ef4444;">
        1. El caza ataca primero • 2. El hidroavión responde con ametralladora
      </div>
    </div>

    <div style="font-size:0.84rem; color:#cbd5e1; margin-bottom:10px; line-height:1.4;">
      <strong>Reglas de Combate Aéreo:</strong> El combate no es simultáneo y dura un máximo de <strong>3 rondas</strong>. 3 puntos de daño a cualquiera de los aviones lo destruye. Si sigue volando al término de la 3.ª ronda, el hidroavión evade y escapa.
    </div>

    <div style="font-size:0.84rem; color:#fca5a5; margin-bottom:10px; padding-bottom:6px; border-bottom:1px solid #991b1b;">
      El caza ataca primero (1d6 frente a la maniobra elegida del 1 al 6). El hidroavión responde con ametralladora trasera (2d6):
    </div>

    <!-- Matrix -->
    <div style="overflow-x:auto; margin-bottom:10px;">
      <table style="width:100%; border-collapse:collapse; font-size:0.86rem; text-align:center;">
        <thead>
          <tr>
            <th rowspan="2" style="background:#0f172a; color:#94a3b8; border:1px solid #475569; padding:6px; font-size:0.82rem; vertical-align:middle;">
              El hidroavión<br>elige #
            </th>
            <th colspan="6" style="background:#991b1b; color:#f8fafc; border:1px solid #ef4444; padding:5px; font-weight:bold;">
              ...el caza enemigo tira 1d6:
            </th>
          </tr>
          <tr style="background:#7f1d1d; color:#fde047;">
            <th style="padding:4px; border:1px solid #ef4444; width:14%;">1</th>
            <th style="padding:4px; border:1px solid #ef4444; width:14%;">2</th>
            <th style="padding:4px; border:1px solid #ef4444; width:14%;">3</th>
            <th style="padding:4px; border:1px solid #ef4444; width:14%;">4</th>
            <th style="padding:4px; border:1px solid #ef4444; width:14%;">5</th>
            <th style="padding:4px; border:1px solid #ef4444; width:14%;">6</th>
          </tr>
        </thead>
        <tbody>
          <tr id="p4-matrix-row-1" style="border-bottom:1px solid #1e293b;">
            <td style="background:#0f172a; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">1</td>
            <td id="p4-cell-1-1" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
            <td id="p4-cell-1-2" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
            <td id="p4-cell-1-3" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#94a3b8;">0</td>
            <td id="p4-cell-1-4" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
            <td id="p4-cell-1-5" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
            <td id="p4-cell-1-6" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
          </tr>
          <tr id="p4-matrix-row-2" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.2);">
            <td style="background:#0f172a; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">2</td>
            <td id="p4-cell-2-1" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
            <td id="p4-cell-2-2" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
            <td id="p4-cell-2-3" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
            <td id="p4-cell-2-4" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#94a3b8;">0</td>
            <td id="p4-cell-2-5" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
            <td id="p4-cell-2-6" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
          </tr>
          <tr id="p4-matrix-row-3" style="border-bottom:1px solid #1e293b;">
            <td style="background:#0f172a; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">3</td>
            <td id="p4-cell-3-1" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
            <td id="p4-cell-3-2" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#94a3b8;">0</td>
            <td id="p4-cell-3-3" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
            <td id="p4-cell-3-4" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
            <td id="p4-cell-3-5" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
            <td id="p4-cell-3-6" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
          </tr>
          <tr id="p4-matrix-row-4" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.2);">
            <td style="background:#0f172a; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">4</td>
            <td id="p4-cell-4-1" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
            <td id="p4-cell-4-2" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
            <td id="p4-cell-4-3" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#94a3b8;">0</td>
            <td id="p4-cell-4-4" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
            <td id="p4-cell-4-5" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
            <td id="p4-cell-4-6" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
          </tr>
          <tr id="p4-matrix-row-5" style="border-bottom:1px solid #1e293b;">
            <td style="background:#0f172a; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">5</td>
            <td id="p4-cell-5-1" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
            <td id="p4-cell-5-2" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
            <td id="p4-cell-5-3" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
            <td id="p4-cell-5-4" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#94a3b8;">0</td>
            <td id="p4-cell-5-5" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
            <td id="p4-cell-5-6" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
          </tr>
          <tr id="p4-matrix-row-6" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.2);">
            <td style="background:#0f172a; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">6</td>
            <td id="p4-cell-6-1" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
            <td id="p4-cell-6-2" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
            <td id="p4-cell-6-3" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
            <td id="p4-cell-6-4" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
            <td id="p4-cell-6-5" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#94a3b8;">0</td>
            <td id="p4-cell-6-6" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="font-size:0.80rem; color:#94a3b8; display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px; border-top:1px solid #334155; padding-top:8px;">
      <div><strong>#</strong> = Impactos al hidroavión | <strong style="color:#4ade80;">E</strong> = ¡Evasión exitosa! Termina el encuentro.</div>
<div style="color:#7dd3fc;">Ametralladora trasera: <strong>2</strong>=3 impactos (DE) | <strong>3-4</strong>=2 impactos | <strong>5-6</strong>=1 impacto | <strong>7-12</strong>=Fallo</div>
    </div>
  </div>
</div></div>
    <div><div class="ocr-board-p5" style="background:#0f172a; border:2px solid #f97316; border-radius:10px; padding:16px; color:#f1f5f9; font-family:'Segoe UI', Roboto, sans-serif; box-shadow:0 8px 30px rgba(0,0,0,0.7);">

  <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:12px;">
    <div style="margin-bottom:10px; border-bottom:1px solid #c2410c; padding-bottom:6px;">
      <strong style="color:#fdba74; font-size:0.95rem;">TABLA P5: FUEGO ANTIAÉREO (2d6)</strong>
      <div style="font-size:0.82rem; color:#94a3b8; margin-top:2px;">Tirada de 2d6 frente a baterías costeras o fondeaderos navales:</div>
    </div>

    <!-- Table -->
    <div style="overflow-x:auto;">
      <table style="width:100%; border-collapse:collapse; font-size:0.86rem;">
        <thead>
          <tr style="background:#c2410c; color:#f8fafc;">
            <th style="padding:6px 8px; border:1px solid #ea580c; width:50px; text-align:center;">Tirada</th>
            <th style="padding:6px 8px; border:1px solid #ea580c; width:110px; text-align:center;">Resultado</th>
            <th style="padding:6px 8px; border:1px solid #ea580c;">Efecto y Detalles</th>
          </tr>
        </thead>
        <tbody>
          <tr id="p5-row-2" class="p5-row" style="border-bottom:1px solid #1e293b;"><td style="padding:5px; text-align:center; font-weight:bold; color:var(--gold-400);">2 - 7</td><td style="padding:5px; text-align:center; color:#94a3b8;">Inefectivo</td><td style="padding:5px; color:#64748b;">Fuego disperso, sin daños al aparato.</td></tr>
          <tr id="p5-row-8" class="p5-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:5px; text-align:center; font-weight:bold; color:var(--gold-400);">8</td><td style="padding:5px; text-align:center; color:#fde047; font-weight:bold;">1 pt. de Daño</td><td style="padding:5px; color:#fde68a;">Impacto cercano (metralla o roce leve).</td></tr>
          <tr id="p5-row-9" class="p5-row" style="border-bottom:1px solid #1e293b;"><td style="padding:5px; text-align:center; font-weight:bold; color:var(--gold-400);">9</td><td style="padding:5px; text-align:center; color:#fb923c; font-weight:bold;">1 pt. de Daño</td><td style="padding:5px; color:#fdba74;">Tira herida en dotación (Tabla B8): 1-3 piloto, 4-6 observador.</td></tr>
          <tr id="p5-row-10" class="p5-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:5px; text-align:center; font-weight:bold; color:var(--gold-400);">10</td><td style="padding:5px; text-align:center; color:#f87171; font-weight:bold;">2 pts. de Daño</td><td style="padding:5px; color:#fca5a5;">Daño estructural severo en fuselaje o alas.</td></tr>
          <tr id="p5-row-11" class="p5-row" style="border-bottom:1px solid #1e293b;"><td style="padding:5px; text-align:center; font-weight:bold; color:var(--gold-400);">11</td><td style="padding:5px; text-align:center; color:#f87171; font-weight:bold;">2 pts. de Daño</td><td style="padding:5px; color:#fdba74;">Tira herida en dotación (Tabla B8): 1-3 piloto, 4-6 observador.</td></tr>
          <tr id="p5-row-12" class="p5-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:5px; text-align:center; font-weight:bold; color:var(--gold-400);">12</td><td style="padding:5px; text-align:center; color:#b91c1c; font-weight:900; background:rgba(185,28,28,0.25);">3 pts. de Daño</td><td style="padding:5px; color:#fca5a5; font-weight:bold;">¡Impacto directo! ¡Hidroavión destruido en el aire!</td></tr>
        </tbody>
      </table>
    </div>

    <div style="font-size:0.80rem; color:#94a3b8; margin-top:10px; border-top:1px solid #334155; padding-top:8px;">
      💥 Un hidroavión con 3 puntos de daño acumulados se estrella en el mar.
    </div>
  </div>
</div></div>
  </div>
</div>`,
        en: `<div class="ocr-board-all-p" style="background:#0f172a; border:2px solid #a855f7; border-radius:10px; padding:16px; color:#f1f5f9; font-family:'Segoe UI', Roboto, sans-serif; box-shadow:0 8px 30px rgba(0,0,0,0.7);">
  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #0284c7; padding-bottom:10px; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
    <div style="display:flex; align-items:center; gap:10px;">
      <span style="background:#0284c7; color:#fff; font-size:0.75rem; font-weight:900; padding:3px 8px; border-radius:4px; letter-spacing:1px;">OFFICIAL RULE 7.17</span>
      <div>
        <h2 style="margin:0; font-family:'Cinzel', serif; font-size:1.25rem; color:#38bdf8;">CHARTS P3 TO P6: EMBARKED FLOATPLANE OPERATIONS</h2>
        <div style="font-size:0.75rem; color:#94a3b8;">IJN Air Module • Reconnaissance & Strike Missions</div>
      </div>
    </div>
    <div style="display:flex; gap:6px; flex-wrap:wrap;">
      <button type="button" onclick="openModalViewer('Chart P3: Encounters', '', 'P3')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#38bdf8; color:#7dd3fc; background:transparent;">🔭 Chart P3: Encounters</button>
      <button type="button" onclick="openModalViewer('Chart P4: Air Combat', '', 'P4')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#f43f5e; color:#fda4af; background:transparent;">⚔️ Chart P4: Air Combat</button>
      <button type="button" onclick="openModalViewer('Chart P5: AA Flak', '', 'P5')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#f97316; color:#fdba74; background:transparent;">💥 Chart P5: AA Flak</button>
      <button type="button" onclick="openModalViewer('Chart P6: Bombing', '', 'P6')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#eab308; color:#fde047; background:transparent;">💣 Chart P6: Bombing</button>
      <button type="button" onclick="openModalViewer('Charts P3-P6: All', '', 'P3_P6')" class="action-btn" style="padding:4px 9px; font-size:0.74rem; border-color:#a855f7; color:#d8b4fe; background:rgba(168,85,247,0.35); font-weight:bold;">📜 Charts P3-P6: All</button>
    </div>
  </div>
  <div style="display:grid; grid-template-columns: 2fr 1fr; gap:16px; margin-bottom:16px;">
    <div><div class="ocr-board-p3" style="background:#0f172a; border:2px solid #0284c7; border-radius:10px; padding:16px; color:#f1f5f9; font-family:'Segoe UI', Roboto, sans-serif; box-shadow:0 8px 30px rgba(0,0,0,0.7);">

  <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:12px;">
    <div style="font-size:0.84rem; color:#94a3b8; margin-bottom:10px; padding-bottom:6px; border-bottom:1px solid #0369a1;">
      Roll 2d6 in each approach circle according to the assigned flight phase (Transit, Recon, or Target):
    </div>

    <!-- Table -->
    <div style="overflow-x:auto;">
      <table style="width:100%; border-collapse:collapse; font-size:0.86rem; text-align:center;">
        <thead>
          <tr style="background:#0369a1; color:#f8fafc;">
            <th style="padding:6px 8px; border:1px solid #0284c7; width:45px;">2d6</th>
            <th style="padding:6px 8px; border:1px solid #0284c7;">Transit</th>
            <th style="padding:6px 8px; border:1px solid #0284c7;">Recon</th>
            <th style="padding:6px 8px; border:1px solid #0284c7; background:#0284c7; color:#fde047;">Target (Recon)</th>
            <th style="padding:6px 8px; border:1px solid #0284c7;">Target (Bombing)</th>
          </tr>
        </thead>
        <tbody>
          <tr id="p3-row-2" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">2</td><td style="color:#64748b;">--</td><td style="color:#fda4af; font-weight:bold;">Aircraft</td><td style="color:#fde047; font-weight:bold;">Capital Ship</td><td style="color:#fda4af; font-weight:bold;">Aircraft</td></tr>
          <tr id="p3-row-3" class="p3-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">3</td><td style="color:#fda4af; font-weight:bold;">Aircraft</td><td style="color:#93c5fd;">Ship</td><td style="color:#93c5fd; font-weight:bold;">Warship</td><td style="color:#64748b;">--</td></tr>
          <tr id="p3-row-4" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">4</td><td style="color:#64748b;">--</td><td style="color:#64748b;">--</td><td style="color:#93c5fd;">Destroyer (DD)</td><td style="color:#64748b;">--</td></tr>
          <tr id="p3-row-5" class="p3-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">5</td><td style="color:#64748b;">--</td><td style="color:#93c5fd;">Ship</td><td style="color:#93c5fd;">Heavy Cruiser (CA)</td><td style="color:#64748b;">--</td></tr>
          <tr id="p3-row-6" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">6</td><td style="color:#64748b;">--</td><td style="color:#64748b;">--</td><td style="color:#64748b;">No Encounter</td><td style="color:#64748b;">--</td></tr>
          <tr id="p3-row-7" class="p3-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">7</td><td style="color:#64748b;">--</td><td style="color:#64748b;">--</td><td style="color:#64748b;">No Encounter</td><td style="color:#64748b;">--</td></tr>
          <tr id="p3-row-8" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">8</td><td style="color:#64748b;">--</td><td style="color:#64748b;">--</td><td style="color:#64748b;">No Encounter</td><td style="color:#64748b;">--</td></tr>
          <tr id="p3-row-9" class="p3-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">9</td><td style="color:#64748b;">--</td><td style="color:#93c5fd;">Ship</td><td style="color:#93c5fd;">Heavy Cruiser (CA)</td><td style="color:#f87171; font-weight:bold;">Anti-Aircraft (AA)*</td></tr>
          <tr id="p3-row-10" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">10</td><td style="color:#64748b;">--</td><td style="color:#64748b;">--</td><td style="color:#93c5fd;">Light Cruiser (CL)</td><td style="color:#64748b;">--</td></tr>
          <tr id="p3-row-11" class="p3-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">11</td><td style="color:#64748b;">--</td><td style="color:#93c5fd;">Ship Group</td><td style="color:#93c5fd; font-weight:bold;">Ship Group</td><td style="color:#64748b;">--</td></tr>
          <tr id="p3-row-12" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:4px; font-weight:bold; color:var(--gold-400);">12</td><td style="color:#fda4af; font-weight:bold;">Aircraft</td><td style="color:#fda4af; font-weight:bold;">Aircraft</td><td style="color:#fde047; font-weight:bold;">Capital Ship</td><td style="color:#fda4af; font-weight:bold;">Aircraft*</td></tr>
        </tbody>
      </table>
    </div>

    <div style="font-size:0.80rem; color:#94a3b8; margin-top:10px; line-height:1.4; border-top:1px solid #334155; padding-top:8px;">
      • <em>Encounters with ships while conducting Recon Missions in a floatplane have no game effects, but are included for narrative interest.</em><br>
• <strong>* Applies to Panama Canal Bombing Missions only.</strong>
    </div>
  </div>
</div></div>
    <div><div class="ocr-board-p6" style="background:#0f172a; border:2px solid #ca8a04; border-radius:10px; padding:16px; color:#f1f5f9; font-family:'Segoe UI', Roboto, sans-serif; box-shadow:0 8px 30px rgba(0,0,0,0.7);">

  <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:12px;">
    <div style="margin-bottom:10px; border-bottom:1px solid #854d0e; padding-bottom:6px;">
      <strong style="color:#fde047; font-size:0.95rem;">CHART P6: AERIAL BOMBING (1d6)</strong>
      <div style="font-size:0.82rem; color:#fde68a; margin-top:2px;">Drop in Target Circle after resolving any Encounters:</div>
    </div>

    <!-- Table -->
    <table style="width:100%; border-collapse:collapse; font-size:0.86rem;">
      <thead>
        <tr style="background:#854d0e; color:#f8fafc;">
          <th style="padding:6px 8px; border:1px solid #ca8a04; width:55px; text-align:center;">1d6</th>
          <th style="padding:6px 8px; border:1px solid #ca8a04;">Result (Bombing Effect)</th>
        </tr>
      </thead>
      <tbody>
        <tr id="p6-row-1-2" class="p6-row" style="border-bottom:1px solid #1e293b;">
          <td style="padding:8px; text-align:center; font-weight:bold; color:var(--gold-400);">1 - 2</td>
          <td style="padding:8px; color:#94a3b8; font-weight:bold;">Miss</td>
        </tr>
        <tr id="p6-row-3-5" class="p6-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);">
          <td style="padding:8px; text-align:center; font-weight:bold; color:var(--gold-400);">3 - 5</td>
          <td style="padding:8px; color:#fde047; font-weight:bold;">Moderate Damage</td>
        </tr>
        <tr id="p6-row-6" class="p6-row" style="border-bottom:1px solid #1e293b;">
          <td style="padding:8px; text-align:center; font-weight:bold; color:var(--gold-400);">6</td>
          <td style="padding:8px; color:#4ade80; font-weight:bold;">Heavy Damage</td>
        </tr>
      </tbody>
    </table>

    <div style="font-size:0.80rem; color:#94a3b8; margin-top:10px; border-top:1px solid #334155; padding-top:8px;">
      🎯 At Panama Canal, moderate or severe damage completes the mission with naval honors.
    </div>
  </div>
</div></div>
  </div>
  <div style="display:grid; grid-template-columns: 3fr 2fr; gap:16px;">
    <div><div class="ocr-board-p4" style="background:#0f172a; border:2px solid #ef4444; border-radius:10px; padding:16px; color:#f1f5f9; font-family:'Segoe UI', Roboto, sans-serif; box-shadow:0 8px 30px rgba(0,0,0,0.7);">

  <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:12px;">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid #991b1b; padding-bottom:6px; flex-wrap:wrap; gap:8px;">
      <div>
        <strong style="color:#fca5a5; font-size:0.95rem;">CHART P4: AIR-TO-AIR COMBAT</strong>
      </div>
      <div style="font-size:0.82rem; color:#fca5a5; background:rgba(239,68,68,0.2); padding:3px 8px; border-radius:4px; border:1px solid #ef4444;">
        1. Fighter attacks first • 2. Floatplane returns fire with rear gun
      </div>
    </div>

    <div style="font-size:0.84rem; color:#cbd5e1; margin-bottom:10px; line-height:1.4;">
      <strong>Air Combat Rules:</strong> Combat is non-simultaneous and lasts up to <strong>3 rounds</strong>. 3 damage points destroys either aircraft. If still flying after round 3, the floatplane evades and escapes.
    </div>

    <div style="font-size:0.84rem; color:#fca5a5; margin-bottom:10px; padding-bottom:6px; border-bottom:1px solid #991b1b;">
      Fighter attacks first (1d6 against chosen floatplane maneuver 1-6). Floatplane replies with rear machine gun (2d6):
    </div>

    <!-- Matrix -->
    <div style="overflow-x:auto; margin-bottom:10px;">
      <table style="width:100%; border-collapse:collapse; font-size:0.86rem; text-align:center;">
        <thead>
          <tr>
            <th rowspan="2" style="background:#0f172a; color:#94a3b8; border:1px solid #475569; padding:6px; font-size:0.82rem; vertical-align:middle;">
              Floatplane<br>chooses #
            </th>
            <th colspan="6" style="background:#991b1b; color:#f8fafc; border:1px solid #ef4444; padding:5px; font-weight:bold;">
              ...then enemy Fighter rolls 1d6:
            </th>
          </tr>
          <tr style="background:#7f1d1d; color:#fde047;">
            <th style="padding:4px; border:1px solid #ef4444; width:14%;">1</th>
            <th style="padding:4px; border:1px solid #ef4444; width:14%;">2</th>
            <th style="padding:4px; border:1px solid #ef4444; width:14%;">3</th>
            <th style="padding:4px; border:1px solid #ef4444; width:14%;">4</th>
            <th style="padding:4px; border:1px solid #ef4444; width:14%;">5</th>
            <th style="padding:4px; border:1px solid #ef4444; width:14%;">6</th>
          </tr>
        </thead>
        <tbody>
          <tr id="p4-matrix-row-1" style="border-bottom:1px solid #1e293b;">
            <td style="background:#0f172a; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">1</td>
            <td id="p4-cell-1-1" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
            <td id="p4-cell-1-2" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
            <td id="p4-cell-1-3" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#94a3b8;">0</td>
            <td id="p4-cell-1-4" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
            <td id="p4-cell-1-5" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
            <td id="p4-cell-1-6" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
          </tr>
          <tr id="p4-matrix-row-2" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.2);">
            <td style="background:#0f172a; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">2</td>
            <td id="p4-cell-2-1" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
            <td id="p4-cell-2-2" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
            <td id="p4-cell-2-3" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
            <td id="p4-cell-2-4" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#94a3b8;">0</td>
            <td id="p4-cell-2-5" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
            <td id="p4-cell-2-6" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
          </tr>
          <tr id="p4-matrix-row-3" style="border-bottom:1px solid #1e293b;">
            <td style="background:#0f172a; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">3</td>
            <td id="p4-cell-3-1" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
            <td id="p4-cell-3-2" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#94a3b8;">0</td>
            <td id="p4-cell-3-3" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
            <td id="p4-cell-3-4" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
            <td id="p4-cell-3-5" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
            <td id="p4-cell-3-6" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
          </tr>
          <tr id="p4-matrix-row-4" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.2);">
            <td style="background:#0f172a; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">4</td>
            <td id="p4-cell-4-1" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
            <td id="p4-cell-4-2" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
            <td id="p4-cell-4-3" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#94a3b8;">0</td>
            <td id="p4-cell-4-4" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
            <td id="p4-cell-4-5" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
            <td id="p4-cell-4-6" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
          </tr>
          <tr id="p4-matrix-row-5" style="border-bottom:1px solid #1e293b;">
            <td style="background:#0f172a; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">5</td>
            <td id="p4-cell-5-1" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
            <td id="p4-cell-5-2" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
            <td id="p4-cell-5-3" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
            <td id="p4-cell-5-4" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#94a3b8;">0</td>
            <td id="p4-cell-5-5" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
            <td id="p4-cell-5-6" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
          </tr>
          <tr id="p4-matrix-row-6" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.2);">
            <td style="background:#0f172a; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">6</td>
            <td id="p4-cell-6-1" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
            <td id="p4-cell-6-2" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
            <td id="p4-cell-6-3" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
            <td id="p4-cell-6-4" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#fde047;">1</td>
            <td id="p4-cell-6-5" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#94a3b8;">0</td>
            <td id="p4-cell-6-6" class="p4-cell" style="padding:5px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="font-size:0.80rem; color:#94a3b8; display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px; border-top:1px solid #334155; padding-top:8px;">
      <div><strong>#</strong> = Damage hits on floatplane | <strong style="color:#4ade80;">E</strong> = Successful Evasion! Encounter ends.</div>
<div style="color:#7dd3fc;">Rear machine gun: <strong>2</strong>=3 hits (Destroyed) | <strong>3-4</strong>=2 hits | <strong>5-6</strong>=1 hit | <strong>7-12</strong>=Miss</div>
    </div>
  </div>
</div></div>
    <div><div class="ocr-board-p5" style="background:#0f172a; border:2px solid #f97316; border-radius:10px; padding:16px; color:#f1f5f9; font-family:'Segoe UI', Roboto, sans-serif; box-shadow:0 8px 30px rgba(0,0,0,0.7);">

  <div style="background:#1e293b; border:1px solid #334155; border-radius:8px; padding:12px;">
    <div style="margin-bottom:10px; border-bottom:1px solid #c2410c; padding-bottom:6px;">
      <strong style="color:#fdba74; font-size:0.95rem;">CHART P5: AA FLAK FIRE (2d6)</strong>
      <div style="font-size:0.82rem; color:#94a3b8; margin-top:2px;">Roll 2d6 against harbor shore batteries or fleet flak screens:</div>
    </div>

    <!-- Table -->
    <div style="overflow-x:auto;">
      <table style="width:100%; border-collapse:collapse; font-size:0.86rem;">
        <thead>
          <tr style="background:#c2410c; color:#f8fafc;">
            <th style="padding:6px 8px; border:1px solid #ea580c; width:50px; text-align:center;">Roll</th>
            <th style="padding:6px 8px; border:1px solid #ea580c; width:110px; text-align:center;">Result</th>
            <th style="padding:6px 8px; border:1px solid #ea580c;">Damage Effect & Details</th>
          </tr>
        </thead>
        <tbody>
          <tr id="p5-row-2" class="p5-row" style="border-bottom:1px solid #1e293b;"><td style="padding:5px; text-align:center; font-weight:bold; color:var(--gold-400);">2 - 7</td><td style="padding:5px; text-align:center; color:#94a3b8;">Ineffective</td><td style="padding:5px; color:#64748b;">Scattered flak, no hits on floatplane.</td></tr>
          <tr id="p5-row-8" class="p5-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:5px; text-align:center; font-weight:bold; color:var(--gold-400);">8</td><td style="padding:5px; text-align:center; color:#fde047; font-weight:bold;">1 pt. Damage</td><td style="padding:5px; color:#fde68a;">Close call (near-miss shrapnel / light scrape).</td></tr>
          <tr id="p5-row-9" class="p5-row" style="border-bottom:1px solid #1e293b;"><td style="padding:5px; text-align:center; font-weight:bold; color:var(--gold-400);">9</td><td style="padding:5px; text-align:center; color:#fb923c; font-weight:bold;">1 pt. Damage</td><td style="padding:5px; color:#fdba74;">Roll crew injury (Chart B8): 1-3 pilot, 4-6 observer.</td></tr>
          <tr id="p5-row-10" class="p5-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:5px; text-align:center; font-weight:bold; color:var(--gold-400);">10</td><td style="padding:5px; text-align:center; color:#f87171; font-weight:bold;">2 pts. Damage</td><td style="padding:5px; color:#fca5a5;">Severe structural damage to fuselage or wings.</td></tr>
          <tr id="p5-row-11" class="p5-row" style="border-bottom:1px solid #1e293b;"><td style="padding:5px; text-align:center; font-weight:bold; color:var(--gold-400);">11</td><td style="padding:5px; text-align:center; color:#f87171; font-weight:bold;">2 pts. Damage</td><td style="padding:5px; color:#fdba74;">Roll crew injury (Chart B8): 1-3 pilot, 4-6 observer.</td></tr>
          <tr id="p5-row-12" class="p5-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:5px; text-align:center; font-weight:bold; color:var(--gold-400);">12</td><td style="padding:5px; text-align:center; color:#b91c1c; font-weight:900; background:rgba(185,28,28,0.25);">3 pts. Damage</td><td style="padding:5px; color:#fca5a5; font-weight:bold;">Direct hit; Floatplane blown out of the sky!</td></tr>
        </tbody>
      </table>
    </div>

    <div style="font-size:0.80rem; color:#94a3b8; margin-top:10px; border-top:1px solid #334155; padding-top:8px;">
      💥 A floatplane accumulating 3 damage points crashes into the sea.
    </div>
  </div>
</div></div>
  </div>
</div>`,
        toString() { return (typeof window !== 'undefined' && window.currentLang === 'en') ? this.en : this.es; }
      }

};

if (typeof window !== 'undefined') {
  window.OCR_CHART_TEMPLATES = OCR_CHART_TEMPLATES;
}
