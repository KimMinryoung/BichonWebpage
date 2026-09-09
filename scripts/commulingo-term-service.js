console.info = (...args) => console.error(...args);
const fs = require('node:fs');
const service = require('../data/commulingo/term-editorial-service');
const db = require('../config/database');
(async () => {
    const request = JSON.parse(fs.readFileSync(0,'utf8'));
    let result;
    if (request.command==='read') result = await service.readTermEditorial(request.id);
    else if (request.command==='enrichment') result = await service.saveEnrichment(request);
    else if (request.command==='submit') result = await service.submitTermEdit(request);
    else if (request.command==='review') result = await service.reviewTermSuggestion(request.suggestionId,request.approve,request.note,{changedBy:request.changedBy});
    else throw new Error('unsupported command');
    process.stdout.write(JSON.stringify({ok:true,result}));
})().catch(error => {
    process.stdout.write(JSON.stringify({ok:false,error:error.message,status:error.status || 500,code:error.code}));
    process.exitCode=1;
}).finally(() => db.end());
