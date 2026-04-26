const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('public/game', {
        pageTitle: '바벨 익스프레스',
        pageDescription: 'Cyber-Lenin 사이트의 웹 게임 바벨 익스프레스입니다.',
        pagePath: '/game',
    });
});

module.exports = router;
