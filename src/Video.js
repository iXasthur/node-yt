class Video {
    id;
    name;
    fine_name;
    like_count;
    upload_date;

    constructor(id, name, file_name,like_count, upload_date) {
        this.id = id;
        this.name = name;
        this.fine_name = file_name;
        this.like_count = like_count;
        this.upload_date = upload_date;
    }
}

module.exports = Video;