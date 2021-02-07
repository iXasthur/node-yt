const express = require('express');
const fs = require('fs');
const router = express.Router();
const VideoProvider = require('../src/VideoProvider');
const path = require('path')

/* GET users listing. */
router.get('/', async function (req, res, next) {
    const video = await VideoProvider.getByID(req.query.id)
    const filePath = path.join(VideoProvider.directory, video.file_name)

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
});

module.exports = router;