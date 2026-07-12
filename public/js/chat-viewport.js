document.body.style.overflow = 'hidden';

// Set --vh to the visual viewport height (excludes browser toolbar/keyboard).
// Run before layout to avoid a flash of incorrect height.
//
// .chat-page is position:fixed, anchored to the layout viewport top. When
// iOS opens the keyboard it scrolls the layout viewport up and shrinks the
// visual viewport, so the fixed page would poke above the visible area and
// leave a gap above the keyboard. Countering that with translateY(offsetTop)
// (plus height = visualViewport.height) keeps the page filling exactly the
// visible region, so the input sits right on the keyboard.
function setVH() {
    var vv = window.visualViewport;
    var h = vv ? vv.height : window.innerHeight;
    var top = vv ? vv.offsetTop : 0;
    document.documentElement.style.setProperty('--vh', h + 'px');
    var page = document.querySelector('.chat-page');
    if (page) page.style.transform = top ? 'translateY(' + top + 'px)' : '';
}

setVH();
(window.visualViewport || window).addEventListener('resize', setVH);
if (window.visualViewport) {
    window.visualViewport.addEventListener('scroll', setVH);
}
window.addEventListener('orientationchange', setVH);

// The home-indicator gap is handled purely in CSS via
// padding-bottom: env(safe-area-inset-bottom) on .chat-input-row, so no
// JS probe/fallback is needed (the old 34px fallback misfired on
// fullscreen non-notch devices, leaving a large empty gap below the input).
//
// When the on-screen keyboard is up, there is no home indicator to clear —
// the keyboard sits over it — so that safe-area padding becomes a dead gap
// between the input and the keyboard. Drop it while the input is focused.
// focusin/focusout bubble, so we can delegate from document even though
// #chatInput does not exist yet when this script runs.
function setKeyboardOpen(open) {
    var page = document.querySelector('.chat-page');
    if (page) page.classList.toggle('keyboard-open', open);
}

document.addEventListener('focusin', function (e) {
    if (e.target && e.target.id === 'chatInput') setKeyboardOpen(true);
});
document.addEventListener('focusout', function (e) {
    if (e.target && e.target.id === 'chatInput') setKeyboardOpen(false);
});
