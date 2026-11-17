# Especificación de Diseño: Iconos y Fondos Atenuados para Cajetines de Counters
**Proyecto:** Sensuikan - Rediseño de Tableros y Cartas de Submarinos  
**Ubicación:** `docs/SPEC_FONDOS_ICONOS_COUNTERS.md`  
**Destinatario:** Chat/Agente de Maquetación y Generación de PDFs  

---

## 🎯 Objetivo
Mejorar la estética y usabilidad de los cajetines de counters en las cartas de los submarinos. En lugar de fondos lisos con texto plano, cada cajetín contendrá una **ilustración técnica/icono en marca de agua atenuada** que represente lo que se coloca encima.

El objetivo visual es:
1. **Riqueza estética:** Que la carta parezca un plano/esquema técnico militar de alta calidad (estilo editorial GMT / Compass Games moderno).
2. **Identificación intuitiva:** El jugador reconoce inmediatamente qué pieza va en cada hueco vacío.
3. **Legibilidad garantizada:** Las letras (`Captain`, `T-1`, `Mtr 1`, etc.) deben leerse con 100% de nitidez sobre el fondo gracias al tratamiento de opacidad y micro-halo.

---

## 🎨 Parámetros Gráficos de Renderizado

1. **Opacidad de las Marcas de Agua:**
   * **Valor recomendado:** Entre **`12%` y `18%`** (máximo absoluto 20%).
   * **Modo de fusión:** `Normal` con opacidad atenuada o `Multiply` sobre el color base de la casilla.
   * **Tratamiento:** Iconos en **monocromo suave** o duotono desaturado (no ilustraciones chillonas ni multicolor).

2. **Paleta de Colores de los Iconos por Sección:**
   * **Tripulación y Oficiales:** Tono sepia / pergamino dorado suave (`#8C7355` al 15%).
   * **Armamento y Munición:** Azul acero / gris naval tenue (`#3A5F7D` al 15%).
   * **Sistemas Internos:** Gris técnico grafito (`#4A4A4A` al 14%).
   * **Eventos y Logística:** Ámbar / naranja apagado (`#A06820` al 15%).
   * **Inundación y Casco:** Ya cuentan con su degradado azul y rojo respectivamente.

3. **Garantía de Legibilidad del Texto (Micro-Halo Maestro):**
   * El texto en primer plano debe tener un trazo/halo blanco protector:
     * En SVG: `stroke="#ffffff" stroke-width="0.5mm" paint-order="stroke fill"`
     * En ReportLab / Canvas PDF: Dibujar el texto primero en blanco con trazo grueso y encima en negro, o usar fuente semibold/bold de alto contraste.
     * En CSS/HTML: `text-shadow: 0 0 2px #ffffff, 0 0 4px #ffffff;`

---

## 📐 Catálogo de Iconos por Tipo de Cajetín

### 1. Tripulación y Oficiales (`CREW STATUS & CREW QUALITY`)
| ID Cajetín | Icono Recomendado | Descripción Visual |
| :--- | :--- | :--- |
| **`Captain`** | **Insignia Imperial Naval** | Silueta del ancla clásica de la Armada Imperial entrelazada con una flor de cerezo (*sakura*), o gorra de plato de oficial. |
| **`Engineer`** | **Engranaje y Llave** | Engranaje dentado cruzado con llave inglesa o silueta de manómetro circular de vapor. |
| **`XO`** | **Timón de Mando** | Rueda náutica de radios (*timón de caña/rueda*) o estrellas de rango naval. |
| **`Nav.`** | **Sextante / Rosa Náutica** | Silueta geométrica de un sextante naval de latón o rosa de los vientos con 8 puntas. |
| **`Medic`** | **Cruz Médica Naval** | Cruz griega estilizada con ribete protector o caduceo con ancla. |
| **`Crew` (x4)** | **Tres Marineros en Fila** | Silueta de 3 marineros de perfil con la gorra tradicional de la IJN (con las 2 cintas flotantes traseras). |
| **`Crew Quality`** | **Galones Militares (Chevrons)** | 3 galones en 'V' invertida superpuestos o corona de laurel militar. |

---

### 2. Armamento, Torpedos y Carga (`WEAPONS & TORPEDOES`)
| ID Cajetín | Icono Recomendado | Descripción Visual |
| :--- | :--- | :--- |
| **`T-1` a `T-8`** | **Torpedo Long Lance** | Silueta horizontal de un torpedo Tipo 95 con su hélice y timoncillos, o la vista frontal circular de la boca del tubo con sus 4 cerrojos estancos. |
| **`Rld Fwd / Rld Aft`** | **Par de Torpedos en Cuna** | Dos torpedos estibados en paralelo sobre raíles de recarga interior. |
| **`Mines`** | **Mina de Contacto** | Mina esférica marina con sus pernos/cuernos de contacto de plomo y anilla inferior. |
| **`Mine Door` / `F.Doors` / `Aft Doors`** | **Compuerta Estanca** | Escotilla circular blindada con volante de apertura central y bisagras. |
| **`Main Gun`** | **Cañón de Cubierta** | Silueta lateral del cañón naval de 140 mm o 120 mm elevado a $45^\circ$ sobre su cureña giratoria. |
| **`Ammo`** | **Proyectil de Artillería** | Cartucho completo de artillería (vaina de latón cilíndrica con ojiva cónica). |
| **`AA 1 / AA 2`** | **Cañón Antiaéreo Type 96** | Silueta bitubo o tritubo de 25 mm apuntando al cielo en ángulo pronunciado. |
| **`Avión`** *(en los que lleven)* | **Hidroavión Cenital** | Silueta en planta superior de un hidroavión Yokosuka E14Y con sus dos flotadores paralelos. |

---

### 3. Sistemas Internos de la Nave (`SYSTEMS STATUS`)
| ID Cajetín | Icono Recomendado | Descripción Visual |
| :--- | :--- | :--- |
| **`Eng 1 / Eng 2`** | **Motor Diésel Marino** | Bloque mecánico de cilindros diésel marinos en línea o conjunto de pistón y biela. |
| **`Mtr 1 / Mtr 2`** | **Motor Eléctrico / Dinamo** | Símbolo técnico de bobina circular / rotor de cobre con un rayo eléctrico sutil. |
| **`Batt`** | **Celda de Baterías** | Banco de acumuladores químicos con placas rectangulares y bornes $(+)$ y $(-)$. |
| **`Fuel`** | **Gota de Combustible** | Gota estilizada de fuel-oil cayendo o silueta de tanque con medidor de nivel. |
| **`Radio`** | **Antena de Transmisión** | Mástil de radio emitiendo 3 arcos de ondas electromagnéticas concéntricas. |
| **`Hydro`** | **Hidrófono / Sonar Pasivo** | Auriculares de operador sonar o haz de ondas acústicas cónicas bajo el mar. |
| **`Perisc`** | **Retícula de Periscopio** | Círculo con cruz filar milimétrica y escala de grados azimutales de puntería óptica. |
| **`Dive Planes`** | **Timones de Profundidad** | Aleta estabilizadora horizontal con flechas vectoriales de inmersión y emersión ($\uparrow \downarrow$). |

---

### 4. Navegación, Logística y Eventos (`PATROL & LOGISTICS`)
| ID Cajetín | Icono Recomendado | Descripción Visual |
| :--- | :--- | :--- |
| **`EVT 1 / EVT 2`** | **Interrogación Táctica** | Símbolo de interrogante estilizado sobre haz de luz o campana de alerta militar. |
| **`Supplies`** | **Cajas de Suministros** | Dos cajas de madera flejadas con cuerdas cruzadas y sello de intendencia. |
| **`Base / Port`** | **Ancla de Fondeo** | Ancla de cuatro uñas de almirantazgo con cadena eslabonada. |
| **`Mission`** | **Cuadrícula Táctica** | Diana circular con retícula de coordenadas sobre mapa marino. |
| **`Transit / On Stat`** | **Estela Marina (*Wake*)** | Submarino en planta navegando dejando ondas de estela en el agua. |
| **`Flood 1-8`** | **Nivel de Agua** | El degradado azul actual (funciona de maravilla; se puede añadir una micro-gota en el fondo). |
| **`Hull 1-8`** | **Cuadernas de Casco** | Remaches y placas de acero con grietas progresivas hasta llegar a la calavera o quiebre en `SUNK`. |

---

## 🛠️ Instrucciones para el Chat de Maquetación
Si estás generando el PDF mediante Python (`ReportLab`, `matplotlib`, `WeasyPrint` o SVG):
1. Añade una capa intermedia antes de estampar los textos de los cajetines.
2. Dibuja el icono centrado en el cajetín escalado a aproximadamente el **60% del ancho/alto** del hueco.
3. Aplica transparencia `alpha = 0.15` (15%).
4. Dibuja el texto en la capa superior con estilo bold y el halo blanco de contraste.
