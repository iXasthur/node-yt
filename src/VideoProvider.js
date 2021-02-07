var Video = require("./model/Video");

class VideoProvider {
    static directory = 'movs_root'

    static async getByID(id) {
        return Video.findById(id)
    }

    static async getAll() {
        return Video.find({});
    }

    static async register(name, filename) {
        const video = new Video({
            name: name,
            file_name: filename
        })
        await video.save()
    }
}

module.exports = VideoProvider