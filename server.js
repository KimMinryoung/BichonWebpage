// Temporary redirect: bichonwebpage.onrender.com → cyber-lenin.com
// Remove this and shut down Render service after 2-3 days.
require('express')().use((req, res) => {
    res.redirect(301, 'https://cyber-lenin.com' + req.originalUrl);
}).listen(process.env.PORT || 3000, () => {
    console.log('Redirect server running');
});
