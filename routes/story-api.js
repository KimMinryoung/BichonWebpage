const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { requireAuth } = require('../middleware/auth');

// GET /api/story/files - List all distinct file paths
router.get('/files', requireAuth, async (req, res) => {
    try {
        const { rows } = await db.query(
            'SELECT DISTINCT file_path FROM story_scenes ORDER BY file_path'
        );
        res.json({ success: true, files: rows.map(r => r.file_path) });
    } catch (error) {
        console.error('Error fetching story files:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/story/scenes/:filePath - List all scenes for a file
router.get('/scenes/*', requireAuth, async (req, res) => {
    try {
        const filePath = req.params[0];
        const { rows } = await db.query(
            'SELECT scene_id, location FROM story_scenes WHERE file_path = $1 ORDER BY scene_id',
            [filePath]
        );
        res.json({ success: true, scenes: rows });
    } catch (error) {
        console.error('Error fetching scenes for file:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/story/scene/:sceneId - Get details of a single scene
router.get('/scene/:sceneId', requireAuth, async (req, res) => {
    try {
        const { rows } = await db.query(
            'SELECT * FROM story_scenes WHERE scene_id = $1',
            [req.params.sceneId]
        );
        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Scene not found' });
        }
        res.json({ success: true, details: rows[0] });
    } catch (error) {
        console.error('Error fetching scene details:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// PUT /api/story/scene/:sceneId - Update a scene
router.put('/scene/:sceneId', requireAuth, async (req, res) => {
    const { script, actions, location } = req.body;
    const sceneId = req.params.sceneId;

    try {
        const { rowCount } = await db.query(
            `UPDATE story_scenes 
             SET script = $1, actions = $2, location = $3, updated_at = NOW() 
             WHERE scene_id = $4`,
            [JSON.stringify(script), JSON.stringify(actions), location, sceneId]
        );

        if (rowCount === 0) {
            return res.status(404).json({ success: false, error: 'Scene not found' });
        }

        res.json({ success: true, message: 'Scene updated successfully' });
    } catch (error) {
        console.error('Error updating scene:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
