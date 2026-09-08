# Leaflet.PolylineDecorator geometry

Upstream: https://github.com/bbecquet/Leaflet.PolylineDecorator
Revision: `96858e837a07c08e08dbba1c6751abdec9a85433`
License: MIT, copyright Benjamin Becquet; full notice in LICENSE.

- `pattern-utils.js`: upstream `src/patternUtils.js`; ES module exports changed to CommonJS and `pointsToSegments` also exported. Geometry is unchanged.
- `arrow-head.js`: upstream `src/L.Symbol.js`, `L.Symbol.ArrowHead._buildArrowPath`, copied verbatim inside a CommonJS wrapper. A plain point factory and identity project/unproject adapters let the method operate on the SVG map's already-projected coordinates. Default head angle: 60 degrees.

The event renderer uses upstream path-length/heading/pattern placement and arrowhead geometry. It configures end placement, a capped proportional pixelSize, and SVG stroke styling. No Leaflet browser runtime or external map tiles are required.
