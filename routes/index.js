const express = require('express');
const router = express.Router();
const VideoProvider = require('../src/VideoProvider')

/* GET home page. */
router.get('/', async function (req, res, next) {
    let headTitle = 'node-yt'

    let videos = await VideoProvider.getAll()

    res.render('index', {
        head_title: headTitle,
        video_list: videos
    });
});

module.exports = router;
