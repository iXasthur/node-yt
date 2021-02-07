const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path')
const VideoProvider = require('../src/VideoProvider')

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, VideoProvider.directory);
    },
    filename: (req, file, cb) =>{
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
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
    let upload = multer({ storage: storageConfig }).single('mov')
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            console.log(err)
            res.redirect('/');
            return
        } else if (err) {
            // An unknown error occurred when uploading.
            console.log(err)
            res.redirect('/');
            return
        }

        // Everything went fine.
        await VideoProvider.register(req.body.name, req.file.filename)

        res.redirect('/')
    })
});

module.exports = router;