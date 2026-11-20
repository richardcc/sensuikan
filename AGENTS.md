# DIRECTRICES DE DESARROLLO Y REGLAS DEL PROYECTO SENSUiKAN

## 🌐 REGLA FUNDAMENTAL: APLICACIÓN 100% BILINGÜE OBLIGATORIA (ESPAÑOL / INGLÉS)

La aplicación **Sensuikan** es estrictamente **bilingüe** (Español e Inglés en paridad 1:1).

### Mandato Obligatorio para Cualquier Asistente, Desarrollador o Agente:
Cada vez que se añada, modifique, amplíe o refactorice cualquier parte de la aplicación (nueva funcionalidad, pantalla, modal, pestaña, tabla, botón, etiqueta, tooltip, notificación toast, resumen táctico, ayuda o mensaje operativo):

1. **Paridad Total de Traducción**:
   - Todo nuevo texto DEBE incluirse en ambos idiomas: **Español (ES)** e **Inglés (EN)**.
   - Está prohibido dejar textos hardcodeados en un solo idioma.

2. **Archivos a Actualizar Obligatoriamente**:
   - `app/i18n.js`: Diccionario global para selectores con `data-i18n` y textos estáticos de la interfaz.
   - `app/js/i18n_ui.js`: Manejadores de idioma dinámicos, renderizadores de tablas tácticas, resultados de dados, textos condicionales y conmutador `toggleLanguage()`.
   - `app/partials/*.html`: Estructura HTML con sus identificadores semánticos y atributos `data-i18n`.

3. **Verificación de Idioma**:
   - Siempre verificar que al alternar el selector de idioma en la cabecera (`IDIOMA: ES` / `LANGUAGE: EN`), el elemento recién creado o modificado cambie instantáneamente de idioma sin perder estado.

---

## 🛠️ FLUJO OBLIGATORIO DE COMPILACIÓN Y EMPAQUETADO

Tras cualquier modificación en `app/partials/`, `app/css/` o `app/js/`:
1. **Reconstruir HTML modular**:
   ```bash
   python scripts/build_app_html.py
   ```
2. **Reempaquetar versiones autónomas (Single-File)**:
   ```bash
   python scripts/bundle_single_file.py
   python scripts/bundle_ultracompact_protected.py
   ```
3. **Sincronizar ejecutables en raíz y app**:
   ```bash
   python scripts/sync_bundles.py
   ```
