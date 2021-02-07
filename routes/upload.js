var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    let head_title = 'Upload to node-yt'

    res.render('upload', {
        head_title: head_title
    });
});

module.exports = router;