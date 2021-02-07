var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    let headTitle = 'Upload to node-yt'

    res.render('upload', {
        head_title: headTitle
    });
});

module.exports = router;