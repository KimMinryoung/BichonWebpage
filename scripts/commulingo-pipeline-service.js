console.info = (...args) => console.error(...args);
const fs = require('node:fs');
const { execute } = require('../data/commulingo/editorial-pipeline-service');
const db = require('../config/database');
(async () => {
    const result = await execute(JSON.parse(fs.readFileSync(0,'utf8')));
    process.stdout.write(JSON.stringify({ok:true,result}));
})().catch(error => {
    process.stdout.write(JSON.stringify({ok:false,error:error.message,status:error.status || 500,code:error.code}));
    process.exitCode = 1;
}).finally(() => db.end());
