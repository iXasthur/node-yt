var express = require('express');
var router = express.Router();

let Video = require('../src/Video');

/* GET home page. */
router.get('/', function (req, res, next) {
    let headTitle = 'node-yt'
    let videos = []

    res.render('index', {
        head_title: headTitle,
        video_list: videos
    });
});

module.exports = router;
