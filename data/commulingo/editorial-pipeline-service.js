const { createHash } = require('node:crypto');
const { withTransaction } = require('./admin-tx');
const { badRequest } = require('./people-admin-fields');
const people = require('./person-editorial-service');
const terms = require('./term-editorial-service');
const {patchHash} = require('./editorial-patch');

async function execute(request) {
    if (!['person','person_section','term'].includes(request.target)) throw badRequest('invalid target');
    if (request.command==='capabilities') return {atomicPublish:true,patchVersion:1};
    const service = request.target==='term' ? {
        read:terms.readTermEditorial,submit:terms.submitTermEdit,review:terms.reviewTermSuggestion,enrichment:terms.saveEnrichment,note:terms.saveNote,
    } : {read:people.readPersonEditorial,submit:people.submitPersonEdit,review:people.reviewPersonSuggestion,enrichment:people.saveEnrichment,note:people.saveNote};
    if (request.command==='read') return service.read(request.id);
    if (!['validate','submit','review','enrichment','note','publish'].includes(request.command)) throw badRequest('invalid command');
    if (request.command==='review' && (typeof request.approve!=='boolean' || typeof request.note!=='string' || !request.note.trim())) throw badRequest('review requires boolean approve and a note');
    if (request.command==='publish') {
        if (request.approvedPatchHash!==patchHash(request)) throw badRequest('approval does not match this patch');
        const review = request.review;
        if (!review || review.decision!=='approve' || typeof review.reason!=='string' || !review.reason.trim()
            || !Array.isArray(review.checks) || !review.checks.length
            || review.checks.some(check => !check || ['citation','source','quote','finding'].some(key => typeof check[key]!=='string' || !check[key].trim()))) {
            throw badRequest('publication requires an independent evidence-based approval');
        }
    }
    if (request.command==='validate') return service.submit({...request,dryRun:true,directApply:false});
    if (typeof request.idempotencyKey!=='string' || !/^[a-zA-Z0-9:_-]{1,180}$/.test(request.idempotencyKey)) throw badRequest('idempotencyKey required');
    const hash = createHash('sha256').update(JSON.stringify(request)).digest('hex');
    return withTransaction({},async client => {
        const receipt = (await client.query('SELECT * FROM commulingo_editorial_receipts WHERE key=$1',[request.idempotencyKey])).rows[0];
        if (receipt) {
            if (receipt.request_hash!==hash) throw badRequest('idempotencyKey reused with a different request');
            return receipt.result;
        }
        if (request.command==='publish') {
            // Stage and approve through the canonical stores within ONE outer
            // transaction. A failure in approval, replacement or notes rolls
            // back the public row, suggestions, history and receipt together.
            if (request.replacesSuggestionId) {
                const old = (await client.query('SELECT target_type,target_id,status FROM commulingo_agent_suggestions WHERE id=$1 FOR UPDATE', [request.replacesSuggestionId])).rows[0];
                if (!old || old.target_type!==request.target || old.target_id!==request.id || old.status!=='pending') {
                    throw badRequest('original suggestion is no longer eligible for replacement');
                }
            }
            const staged = await service.submit({...request,directApply:false,dryRun:false},{client});
            const note = request.review.reason+'\n'+JSON.stringify(request.review.checks);
            const result = await service.review(staged.suggestionId,true,note,{client,changedBy:'commulingo-pipeline-reviewer'});
            if (result.status!=='approved') throw badRequest('publication did not produce an approved edit');
            if (request.replacesSuggestionId) {
                await service.review(request.replacesSuggestionId,false,'Replaced by independently approved patch '+request.approvedPatchHash,{client,changedBy:'commulingo-pipeline-reviewer'});
            }
            if (request.notes) await service.note({id:request.id,note:request.notes,jobRef:request.jobRef,changedBy:'commulingo-pipeline'},{client});
            const receipt = {...result,patchHash:request.approvedPatchHash};
            await client.query('INSERT INTO commulingo_editorial_receipts(key,request_hash,result) VALUES ($1,$2,$3)',
                [request.idempotencyKey,hash,JSON.stringify(receipt)]);
            return receipt;
        }
        let alreadyReviewed;
        if (request.command==='review') {
            const row = (await client.query('SELECT target_type,status FROM commulingo_agent_suggestions WHERE id=$1 FOR UPDATE',[request.suggestionId])).rows[0];
            if (!row || row.target_type!==request.target) throw badRequest('suggestion target mismatch');
            if (row.status===(request.approve?'approved':'rejected')) alreadyReviewed = {status:row.status,suggestionId:request.suggestionId};
        }
        const result = alreadyReviewed || (request.command==='note' ? await service.note(request,{client})
            : request.command==='enrichment' ? await service.enrichment(request,{client}) : request.command==='submit'
            ? await service.submit({...request,directApply:false,dryRun:false},{client})
            : await service.review(request.suggestionId,request.approve,request.note,{client,changedBy:'commulingo-pipeline-reviewer'}));
        await client.query('INSERT INTO commulingo_editorial_receipts(key,request_hash,result) VALUES ($1,$2,$3)',
            [request.idempotencyKey,hash,JSON.stringify(result)]);
        return result;
    });
}

module.exports = {execute};
