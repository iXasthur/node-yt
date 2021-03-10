const { Router } = require('express')
const Video = require('../models/Video')
const config = require('config')
const verifyToken = require('../middlewares/verifyToken.middleware')
const multer = require('multer')
const router = Router()
const path = require("path");
const fs = require("fs");

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, config.get('videosRoot'));
    },
    filename: (req, file, cb) =>{
        cb(null, file.fieldname + '-' + Date.now() + '-' + Math.random() + path.extname(file.originalname));
    }
});

router.get(
    '/',
    verifyToken,
    async (req, res) => {
        try {
            let videos = await Video.find({})
            res.json({
                videos: videos
            })
        } catch (e) {
            console.log(e)
            res.status(500).json({
                message: "Something went wrong..."
            })
        }
    }
)

router.post(
    '/upload',
    verifyToken,
    async function(req, res, next) {
        try {
            let upload = multer({ storage: storageConfig }).single('video')
            upload(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    // A Multer error occurred when uploading.
                    console.log(err)
                    res.status(500).json({
                        message: "Something went wrong..."
                    })
                    return
                } else if (err) {
                    // An unknown error occurred when uploading.
                    console.log(err)
                    res.status(500).json({
                        message: "Something went wrong..."
                    })
                    return
                }

                try {
                    const fileName = req.file.filename
                    const title = req.body.title
                    const video = new Video({
                        title,
                        fileName
                    })
                    await video.save()

                    res.json({
                        message: "Successfully uploaded file"
                    })
                } catch (e) {
                    console.log(e)
                    res.status(500).json({
                        message: "Something went wrong..."
                    })
                }

            })

        } catch (e) {
            console.log(e)
            res.status(500).json({
                message: "Something went wrong..."
            })
        }
    }
)

router.get(
    '/file/:id',
    verifyToken,
    async (req, res) => {
        try {
            const video = await Video.findById(req.params.id)
            const filePath = path.join(config.get('videosRoot'), video.fileName)
            if (fs.existsSync(filePath)) {
                const stat = fs.statSync(filePath)
                const fileSize = stat.size
                const range = req.headers.range
                if (range) {
                    const parts = range.replace(/bytes=/, "").split("-")
                    const start = parseInt(parts[0], 10)
                    const end = parts[1]
                        ? parseInt(parts[1], 10)
                        : fileSize - 1
                    const chunksize = (end - start) + 1
                    const file = fs.createReadStream(filePath, {start, end})
                    const head = {
                        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                        'Accept-Ranges': 'bytes',
                        'Content-Length': chunksize,
                        'Content-Type': 'video/mp4',
                    }
                    res.writeHead(206, head);
                    file.pipe(res);
                } else {
                    const head = {
                        'Content-Length': fileSize,
                        'Content-Type': 'video/mp4',
                    }
                    res.writeHead(200, head)
                    fs.createReadStream(filePath).pipe(res)
                }
            } else {
                res.sendStatus(404);
            }

        } catch (e) {
            console.log(e)
            res.status(500).json({
                message: "Something went wrong..."
            })
        }
    }
)

module.exports = router