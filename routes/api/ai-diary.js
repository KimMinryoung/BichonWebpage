const express = require('express');
const router = express.Router();
const db = require('../../config/database');
const { isConnectionError } = require('../../config/database');
const requireApiKey = require('../../middleware/requireApiKey');

// 모든 API 엔드포인트는 API 키 인증 필요
router.use(requireApiKey);

// 일기 목록 조회 (API)
router.get('/', async (req, res) => {
    try {
        const { rows: diaries } = await db.query(
            'SELECT id, title, content, created_at, updated_at FROM ai_diary ORDER BY created_at DESC'
        );
        res.json({ success: true, data: diaries });
    } catch (error) {
        console.error('Error fetching diaries via API:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch diaries' });
    }
});

// 일기 단건 조회 (API)
router.get('/:id', async (req, res) => {
    try {
        const { rows: diaries } = await db.query(
            'SELECT * FROM ai_diary WHERE id = $1',
            [req.params.id]
        );

        if (diaries.length === 0) {
            return res.status(404).json({ success: false, error: 'Diary not found' });
        }

        res.json({ success: true, data: diaries[0] });
    } catch (error) {
        console.error('Error fetching diary via API:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch diary' });
    }
});

// 일기 생성 (API)
router.post('/', async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ success: false, error: 'Title and content are required' });
    }

    try {
        const result = await db.query(
            'INSERT INTO ai_diary (title, content) VALUES ($1, $2) RETURNING *',
            [title, content]
        );
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        if (isConnectionError(error)) {
            console.error('[DB Connection Failed] Create Diary API - Database connection failed:', error.message);
        } else {
            console.error('Error creating diary via API:', error);
        }
        res.status(500).json({ success: false, error: 'Failed to create diary' });
    }
});

// 일기 수정 (API)
router.put('/:id', async (req, res) => {
    const { title, content } = req.body;
    const diaryId = req.params.id;

    if (!title || !content) {
        return res.status(400).json({ success: false, error: 'Title and content are required' });
    }

    try {
        const result = await db.query(
            'UPDATE ai_diary SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
            [title, content, diaryId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, error: 'Diary not found' });
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        if (isConnectionError(error)) {
            console.error('[DB Connection Failed] Update Diary API - Database connection failed:', error.message);
        } else {
            console.error('Error updating diary via API:', error);
        }
        res.status(500).json({ success: false, error: 'Failed to update diary' });
    }
});

// 일기 삭제 (API)
router.delete('/:id', async (req, res) => {
    try {
        const result = await db.query('DELETE FROM ai_diary WHERE id = $1', [req.params.id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, error: 'Diary not found' });
        }

        res.json({ success: true, message: 'Diary deleted successfully' });
    } catch (error) {
        console.error('Error deleting diary via API:', error);
        res.status(500).json({ success: false, error: 'Failed to delete diary' });
    }
});

module.exports = router;
