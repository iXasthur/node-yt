var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    let head_title = 'node-yt'

    res.render('index', {
        head_title: head_title
    });
});

module.exports = router;
