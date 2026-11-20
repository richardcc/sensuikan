# Sensuikan: Tablero Modular Dual-Layer (Compass Games)

Sistema modular de dos capas para el wargame en solitario **Sensuikan: Japanese Fleet Submarines in WW2**.
Diseñado a medida para la tarjeta física oficial tamaño **US Letter ($280.0 \times 215.0\text{ mm}$)** y optimizado para impresión 3D en **Bambu Lab P1S/P2S/X1C ($256 \times 256\text{ mm}$)** e impresión láser 1:1 en **Brother DCP-L2520DW**.

---

## 🌐 Política de Desarrollo: Aplicación 100% Bilingüe Obligatoria (ES / EN)

> [!IMPORTANT]
> **Norma estricta del proyecto**: Toda funcionalidad, pantalla, tabla de resolución, regla táctica, etiqueta, botón, modal o mensaje añadido a la aplicación web **debe ser rigurosamente bilingüe (Español e Inglés)** con paridad 1:1.
> Cada vez que se añade o modifica contenido, debe incorporarse su correspondiente traducción tanto en `app/i18n.js` como en `app/js/i18n_ui.js` y comprobar que la conmutación entre **IDIOMA: ES** y **LANGUAGE: EN** funcione de manera integral.

---

## 📁 Estructura del Proyecto

### 1. `stl/` (Modelos 3D para Impresión en Bambu Lab)
Contiene los archivos STL definitivos, 100% Watertight (0 bordes abiertos, 0 caras invertidas) con sistema de unión **Snap-Fit + Suelo Antidescuelgue**:
* **`sensuikan_base_tray_280x215_left.stl`**: Mitad izquierda de la bandeja base ($150.3 \times 222.6 \times 5.4\text{ mm}$) con 4 machos Snap-Fit.
* **`sensuikan_base_tray_280x215_right.stl`**: Mitad derecha de la bandeja base ($145.8 \times 222.6 \times 5.4\text{ mm}$) con 4 hembras receptoras de clic.
* **`sensuikan_top_overlay_left.stl`**: Módulo izquierdo de rejilla superior con cajetines de $13.2\text{ mm}$.
* **`sensuikan_top_overlay_right_universal.stl`**: Módulo derecho universal adaptable a toda la flota.
* **`sensuikan_top_overlay_right_junsen_j2.stl`**: Módulo derecho específico Junsen J.2.
* **`sensuikan_top_overlay_universal_full.stl`**: Rejilla superior completa sin partir (para camas grandes $\ge 300\text{ mm}$).
* **`legacy/`**: Versiones anteriores, archivos temporales y proyectos `.3mf`.

### 2. `pdf/` (Plantillas 1:1 para Impresora Láser)
Documentos PDF pre-compensados para el margen de la impresora Brother (`factor 100/95 = 1.0526`):
* **`sensuikan_piezas_superiores_1a1_laser.pdf`**: **PDF Maestro (7 páginas)**:
  * **Págs 1-3:** Módulos y piezas sueltas individuales (P1, P2A/B, P3A/B, P4A/B, P5A/B) para recortar por separado y probar sobre la carta.
  * **Págs 4-7:** Planta completa en 4 cuadrantes con solapas y cruces de registro para unir con celo.
* **`sensuikan_base_inferior_280x215_4hojas.pdf`**: Bandeja base en 4 cuadrantes.
* **`sensuikan_planta_superior_280x215_4hojas.pdf`**: Rejilla superior en 4 cuadrantes.
* **`legacy/`**: Borradores y pruebas de escala previas.

### 3. `images/` (Imágenes y Renders)
* **`previews/`**: Renders 3D isométricos, detalles del Snap-fit y blueprints técnicos (`preview_3d_base_tray_280x215.png`, `preview_snap_detail.png`, etc.).
* **`cards/`**: Fotos reales, escaneos de las cartas de submarinos (`junsen_j2.png`, `cards_set_*.jpg`, recortes).
* **`analysis/`**: Comparativas de damage tracks, collages de alineación, análisis de flota y mapas de calor.

### 4. `scripts/` (Código Python de Generación y Análisis)
* **`generators/`**: Generadores de STLs y PDFs (`generate_snap_base_tray.py`, `generate_all_modular_pieces_pdf.py`, `sensuikan_generator.py`).
* **`verification/`**: Herramientas de control de calidad y verificación manifold (`check_watertight.py`, `verify_*.py`).
* **`analysis/`**: Scripts de visión artificial y auditoría de los 17 submarinos.

### 5. `data/`
* **`grid_definition.json`**: Base de datos de coordenadas milimétricas exactas de todos los cajetines de counters, muescas, siluetas y damage tracks.

---

## 🖨️ Parámetros de Impresión 3D Recomendados (Bambu Lab P1S/P2S)
* **Boquilla:** $0.4\text{ mm}$ estándar
* **Perfil:** `0.20mm Standard @BBL P2S`
* **Altura de capa:** $0.20\text{ mm}$ (primera capa $0.20\text{ mm}$)
* **Paredes:** `3 bucles de pared`
* **Relleno:** `15% Giroide`
* **Soportes:** `Desactivados (NO)`
* **Tiempo estimado:** ~1 h 03 min por mitad (consumo: ~35 g).

## 🌐 Idiomas de la aplicación

La aplicación web usa [`app/i18n.js`](./app/i18n.js) como catálogo central. El texto
reutilizable debe añadirse como una clave en `I18N.es` y en cada idioma, y los
elementos HTML nuevos pueden usar `data-i18n="grupo.clave"` (también existen
`data-i18n-placeholder`, `data-i18n-title`, `data-i18n-alt` y
`data-i18n-html`). El selector de idioma descubre automáticamente los idiomas
definidos en `I18N`, por lo que añadir un nuevo bloque de idioma no requiere
modificar la lógica de la interfaz.

Los textos que todavía proceden de marcado histórico se mantienen en el catálogo
`TEXT_TRANSLATIONS` de [`app/i18n.js`](./app/i18n.js), con mapas bidireccionales
para que el cambio de idioma funcione en ambos sentidos. Las nuevas pantallas
deben usar claves `I18N` y atributos `data-i18n`. El runtime utiliza únicamente
los módulos `gameflow_phase*.js`, `gameflow.js` y `dock.js`.
