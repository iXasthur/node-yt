var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    let id = req.query.id;
    if (id) {
        let headTitle = 'Video Title';
        res.render('watch', {
            head_title: headTitle,
            video_name: 'nil',
            video_id: id
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;