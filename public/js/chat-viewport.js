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

// The home-indicator gap is handled purely in CSS via
// padding-bottom: env(safe-area-inset-bottom) on .chat-input-row, so no
// JS probe/fallback is needed (the old 34px fallback misfired on
// fullscreen non-notch devices, leaving a large empty gap below the input).
