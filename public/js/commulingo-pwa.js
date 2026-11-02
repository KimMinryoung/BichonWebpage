// Registers CommuLingo's service worker (public/js/commulingo-sw.js, served by
// routes/commulingo-pwa.js) for this page's language scope.
(function () {
    if (!('serviceWorker' in navigator) || !window.isSecureContext) return;
    var scope = location.pathname.indexOf('/en/') === 0 ? '/en/commulingo' : '/commulingo';
    window.addEventListener('load', function () {
        navigator.serviceWorker.register(scope + '/sw.js', { scope: scope }).catch(function () {});
    });
})();
