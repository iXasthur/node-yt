const Video = require("./model/Video");

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

    static async deleteByID(id) {
        await Video.findByIdAndDelete(id)
    }
}

module.exports = VideoProvider