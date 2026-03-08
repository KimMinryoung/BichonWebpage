document.body.style.overflow = 'hidden';

// Set --vh to the visual viewport height (excludes browser toolbar).
// Run before layout to avoid a flash of incorrect height.
function setVH() {
    var vv = window.visualViewport;
    var h = vv ? vv.height : window.innerHeight;
    document.documentElement.style.setProperty('--vh', h + 'px');
}

setVH();
(window.visualViewport || window).addEventListener('resize', setVH);
window.addEventListener('orientationchange', setVH);

window.addEventListener('load', function() {
    requestAnimationFrame(function() {
        // Probe env(safe-area-inset-bottom) via a real element.
        var probe = document.createElement('div');
        probe.style.cssText = 'position:fixed;bottom:0;left:0;height:env(safe-area-inset-bottom,0px);min-height:0;pointer-events:none;visibility:hidden';
        document.body.appendChild(probe);
        var envVal = probe.getBoundingClientRect().height;
        document.body.removeChild(probe);

        var safeBottom = envVal;
        if (safeBottom === 0 && window.outerHeight >= window.screen.height * 0.99) {
            safeBottom = 34;
        }

        var inputRow = document.querySelector('.chat-input-row');
        inputRow.style.marginBottom = safeBottom + 'px';
    });
});
