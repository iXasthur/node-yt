var express = require('express');
var multer = require('multer');
var router = express.Router();
var app = require('../app')
var VideoProvider = require('../src/VideoProvider')

var storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, VideoProvider.directory);
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname);
    }
});

/* GET users listing. */
router.get('/', function (req, res, next) {
    let headTitle = 'Upload to node-yt'

    res.render('upload', {
        head_title: headTitle
    });
});

router.post('/', function (req, res, next) {
    var upload = multer({ storage: storageConfig }).single('mov')
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
        } else if (err) {
            // An unknown error occurred when uploading.
        }

        // Everything went fine.
        res.redirect('/');
    })
});

module.exports = router;