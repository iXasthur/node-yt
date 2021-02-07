class Video {
    id;
    name;
    like_count;
    upload_date;

    constructor(id, name, like_count, upload_date) {
        this.id = id;
        this.name = name;
        this.like_count = like_count;
        this.upload_date = upload_date;
    }

    static createSampleVideos(count) {
        if (Number.isInteger(count) && count > -1) {
            let array = []
            for (let i = 0; i < count; i++) {
                let id = i
                let video = new Video(id, 'name of video with id = ' + id, i*i, Date())
                array.push(video)
            }
            return array
        } else {
            return false
        }
    }
}