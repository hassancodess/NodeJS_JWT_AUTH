const mongoose = require('mongoose')

const videoSchema = mongoose.Schema(
    {
        name: { type: String, default: null },
        format: { type: String, default: null },
        file_path: { type: String, default: null },
        userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    }
)

const Video = mongoose.model('Video', videoSchema)

module.exports = Video;