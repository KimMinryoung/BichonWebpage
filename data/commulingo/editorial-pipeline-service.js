const { createHash } = require('node:crypto');
const { withTransaction } = require('./admin-tx');
const { badRequest } = require('./people-admin-fields');
const people = require('./person-editorial-service');
const terms = require('./term-editorial-service');

async function execute(request) {
    if (!['person','person_section','term'].includes(request.target)) throw badRequest('invalid target');
    const service = request.target==='term' ? {
        read:terms.readTermEditorial,submit:terms.submitTermEdit,review:terms.reviewTermSuggestion,enrichment:terms.saveEnrichment,
    } : {read:people.readPersonEditorial,submit:people.submitPersonEdit,review:people.reviewPersonSuggestion,enrichment:people.saveEnrichment};
    if (request.command==='read') return service.read(request.id);
    if (!['validate','submit','review','enrichment'].includes(request.command)) throw badRequest('invalid command');
    if (request.command==='review' && (typeof request.approve!=='boolean' || typeof request.note!=='string' || !request.note.trim())) throw badRequest('review requires boolean approve and a note');
    if (request.command==='validate') return service.submit({...request,dryRun:true,directApply:false});
    if (typeof request.idempotencyKey!=='string' || !/^[a-zA-Z0-9:_-]{1,180}$/.test(request.idempotencyKey)) throw badRequest('idempotencyKey required');
    const hash = createHash('sha256').update(JSON.stringify(request)).digest('hex');
    return withTransaction({},async client => {
        const receipt = (await client.query('SELECT * FROM commulingo_editorial_receipts WHERE key=$1',[request.idempotencyKey])).rows[0];
        if (receipt) {
            if (receipt.request_hash!==hash) throw badRequest('idempotencyKey reused with a different request');
            return receipt.result;
        }
        let alreadyReviewed;
        if (request.command==='review') {
            const row = (await client.query('SELECT target_type,status FROM commulingo_agent_suggestions WHERE id=$1 FOR UPDATE',[request.suggestionId])).rows[0];
            if (!row || row.target_type!==request.target) throw badRequest('suggestion target mismatch');
            if (row.status===(request.approve?'approved':'rejected')) alreadyReviewed = {status:row.status,suggestionId:request.suggestionId};
        }
        const result = alreadyReviewed || (request.command==='enrichment' ? await service.enrichment(request,{client}) : request.command==='submit'
            ? await service.submit({...request,directApply:false,dryRun:false},{client})
            : await service.review(request.suggestionId,request.approve,request.note,{client,changedBy:'commulingo-pipeline-reviewer'}));
        await client.query('INSERT INTO commulingo_editorial_receipts(key,request_hash,result) VALUES ($1,$2,$3)',
            [request.idempotencyKey,hash,JSON.stringify(result)]);
        return result;
    });
}

module.exports = {execute};
