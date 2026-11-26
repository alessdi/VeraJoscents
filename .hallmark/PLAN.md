# Vera Joscents · rediseño Hallmark — plan decidido (sin construir)

Estado: CONSTRUIDO el 2026-11-25. Sweep final 0 FAIL, 0 REFLEX (antes 155 y 10).
Revisión final en contexto limpio: veredicto fix, hallazgos aplicados.
Lo de abajo es el plan original; el sello de style.css manda sobre él.
El sitio sigue intacto y funcionando: index.html, style.css y script.js
están como el commit 73fb35f. tokens.css y base.css son nuevos y NADIE los
importa todavía, así que no afectan la página.

## Respuestas del usuario
- Intocable: el concepto barroco
- Tono: lujo
- Acción: comprar por WhatsApp
- Prioridad declarada y repetida: que se vea perfecto en celulares

## Decisiones Hallmark
- Profundidad: full redesign (verbo `redesign`)
- Marca: CONSERVADA (`--brand`), valores leídos de style.css
- Género: editorial · Shape: Photographic · Hero: Poster
- Nav: masthead · Footer: colofón
- Signature: el marco dorado real sosteniendo la pieza ancla, UNA sola vez
- Draw e01d10 dio Feature Stack + Corridor; AMBOS cambiados:
  Feature Stack se desaconseja en móvil (su propia ficha) y el móvil es
  la prioridad del usuario. Corridor contradice "nunca display centrado"
  de Photographic. Cambios a declarar en el Picks block.
- Dejar fuera por reparto: Grid y Band

## Secciones acordadas
1. Hero Poster: video ninfas a sangre (se CONSERVA el <video> y su data-src,
   el script consulta `.rotonda-canvas video`), placa abajo-izquierda con
   h1 Cankama + 1 frase (<=12 palabras) + 1 acción, pie de lámina con un dato
2. Offer: pieza ancla VJ Elemental, marco barroco, $1,450, Comprar por WhatsApp
3. Rail: las 5 salas con foto y "desde $X" (sustituye al Grid prohibido)
4. Statement: "Perfume es poder", el manifiesto reducido
5. Showcase: banda fotográfica a sangre
6. Pinned: cómo se hace (3 paneles); se despega bajo 60rem
7. Rows: envíos y cuidado como datos planos
8. Cierre en la oferta + pie colofón
Barra de compra fija desde la primera pantalla.

## De los reels (@shovel.studio)
- Oro pasa a señal escasa (no blanco y negro: la marca manda)
- Texto pequeño como ANOTACIÓN a 14px, no 10px (puerta 75)
- Botón "Comprar por WhatsApp" directo por pieza; el carrito SE QUEDA
  (borrarlo tiraría 84 enganches de script)
- Selector oculto cuando sólo hay una opción: `.config-field[data-single]`
- Sin animaciones de carga: coincide con puerta 62

## Lo que hay que arreglar sí o sí (del before-record)
155 FAIL · 10 REFLEX · 26 WARN. Los grandes:
- 67 x27: versalitas espaciadas en etiquetas (.eyebrow, .nav-links, .sala-num)
- 48 x86: colores literales fuera del bloque de tokens
- 54 x13: rótulos sobre encabezados
- 37: 5 familias -> 3 (Cankama, Cormorant, Jost; fuera Cinzel y EB Garamond)
- 19: guiones largos en la copia (em dash) — hay que reescribir a comas
- 63 x2: cadenas con puntos medios
- 62 x3: contenido oculto en reposo que depende del script
- 10a x2: transition sobre width en .nav-links a::after y .burger-bar
- 34 x2: overflow-x:hidden en body (rompe el sticky) y 100vw en .cart-drawer
- 50 x11: pistas de rejilla con imagen en 1fr pelado
- 24a: medidas crudas donde existe token --space-*

## Contrato de cableado que NO se puede romper
89 ids y ~80 selectores en .hallmark/before.json (clave `scripts`).
Verificar al final con:
  sloplint index.html --genre editorial --render --kept --url http://localhost:PORT/index.html
Render necesita: HALLMARK_PUPPETEER apuntando a un dir con puppeteer-core,
y servir por HTTP (desde file:// las fuentes no cargan y el linter lo marca
como "cara de reserva", que descalifica la revisión).

## Pendiente
Escribir style.css nueva, recomponer index.html, parchar script.js,
sweep, hero review, handoff.
