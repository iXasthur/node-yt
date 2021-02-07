var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    let headTitle = 'node-yt'

    res.render('index', {
        head_title: headTitle
    });
});

module.exports = router;
