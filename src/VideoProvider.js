var Video = require("./Video");

class VideoProvider {
    static directory = 'movs_root'

    static getVideoByID(id) {
        return new Video(id, 'Wooow', 'MOVIE.mp4', 1000, Date());
    }
}

module.exports = VideoProvider