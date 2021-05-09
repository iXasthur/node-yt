const { Router } = require('express')
const Video = require('../models/Video')
const config = require('config')
const verifyToken = require('../middlewares/verifyToken.middleware')
const multer = require('multer')
const router = Router()
const path = require("path");
const ffmpeg = require("ffmpeg");

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, config.get('videosRoot'));
    },
    filename: (req, file, cb) =>{
        cb(null, 'source' + '-' + Date.now() + '-' + Math.random() + path.extname(file.originalname));
    }
});

router.post(
    '/',
    verifyToken,
    async function(req, res) {
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
                    const authorId = req.user.userId
                    const video = new Video({
                        title,
                        fileName,
                        authorId
                    })

                    await video.save()

                    const processedFileName = 'video-' + video._id + '.mp4'

                    const fileToProcessPath = path.join(config.get('videosRoot'), video.fileName)
                    const processedFilePath = path.join(config.get('videosRoot'), processedFileName)

                    const process = new ffmpeg(fileToProcessPath);
                    process.then(async function (ffvideo) {
                        ffvideo
                            .setVideoFormat('mp4')
                            .setVideoSize('?x480', true, true, '#ffffff')
                            .save(processedFilePath, async function (error, file) {
                                if (!error) {

                                    video.fileName = processedFileName
                                    video.isProcessing = false

                                    await Video.findByIdAndUpdate(video._id, {
                                        isProcessing: false,
                                        fileName: processedFileName
                                    },  {
                                        upsert: true,
                                        useFindAndModify: false
                                    })

                                    res.json({
                                        message: "Successfully uploaded file"
                                    })
                                } else {
                                    console.log(error);
                                    res.status(500).json({
                                        message: "Something went wrong..."
                                    })
                                }
                            });
                    }, function (err) {
                        console.log(err);
                        res.status(500).json({
                            message: "Something went wrong..."
                        })
                    });
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

module.exports = router