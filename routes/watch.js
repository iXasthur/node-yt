var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    let headTitle = 'Video Title'

    res.render('watch', {
        head_title: headTitle,
        video_id: 404
    });
});

module.exports = router;