/* The strategic map's basemap as a bitmap (war/ui/game.js):
   WarBasemap.create(mapEl) returns paint(), which redraws it on the next
   frame when what it shows has changed. */
(function (root) {
    'use strict';

    // The basemap (coast, rivers, history's areas) shown as a bitmap drawn
    // once on the CPU whenever it changes, not as live svg. History's areas
    // are clipped to the whole coastline and the Whites' are outlined in
    // dashes thousands of segments long; phone GPUs redrew that per tile
    // and showed the map broken the moment the layer was switched on.
    // The svg stays underneath, hidden, for its size and as the fallback.
    const BITMAP_STYLE = ['display', 'opacity', 'fill', 'fill-opacity', 'stroke', 'stroke-width', 'stroke-opacity', 'stroke-dasharray', 'stroke-linecap', 'stroke-linejoin'];
    function create(mapEl) {
        const basemap = { canvas: null, key: null, job: 0, frame: 0 };
        function paintBasemap() {
            window.cancelAnimationFrame(basemap.frame);
            basemap.frame = window.requestAnimationFrame(drawBasemap);
        }
        function drawBasemap() {
            const base = mapEl.querySelector('svg');
            const box = base.getBoundingClientRect();
            if (!box.width) return;
            const dpr = Math.min(window.devicePixelRatio || 1, 3);
            const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const current = base.querySelector('.emap-phase.is-current');
            const key = [mapEl.classList.contains('is-history'), current && current.dataset.phase, Math.round(box.width), dpr, document.documentElement.dataset.theme, dark].join(':');
            if (key === basemap.key) return;
            basemap.key = key;
            const job = ++basemap.job;
            const copy = base.cloneNode(true);
            const from = base.querySelectorAll('*'), to = copy.querySelectorAll('*');
            from.forEach((el, i) => {
                // Shapes kept in <defs> for <use> take their paint from each use.
                if (!el.hasAttribute('class') && el.closest('defs')) return;
                const cs = getComputedStyle(el);
                to[i].setAttribute('style', BITMAP_STYLE.map(name => `${name}:${cs.getPropertyValue(name)}`).join(';'));
            });
            const w = Math.round(box.width * dpr), h = Math.round(box.height * dpr);
            copy.setAttribute('width', w);
            copy.setAttribute('height', h);
            copy.removeAttribute('style');
            // A data: url, as the site's img-src policy allows no blob: urls.
            const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new window.XMLSerializer().serializeToString(copy));
            const img = new window.Image();
            img.onload = () => {
                if (job !== basemap.job) return;
                if (!basemap.canvas) {
                    basemap.canvas = document.createElement('canvas');
                    basemap.canvas.className = 'cw-map-bitmap';
                    basemap.canvas.setAttribute('aria-hidden', 'true');
                    base.after(basemap.canvas);
                }
                const c = basemap.canvas;
                c.width = w;
                c.height = h;
                // A CPU canvas: the drawing is rasterised here, once.
                c.getContext('2d', { willReadFrequently: true }).drawImage(img, 0, 0, w, h);
                c.style.width = `${box.width}px`;
                c.style.height = `${box.height}px`;
                mapEl.classList.add('has-bitmap');
            };
            img.onerror = () => mapEl.classList.remove('has-bitmap');
            img.src = url;
        }
        new MutationObserver(paintBasemap).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', paintBasemap);
        return paintBasemap;
    }

    root.WarBasemap = { create };
})(window);
