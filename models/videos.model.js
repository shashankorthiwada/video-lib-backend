const mongoose = require("mongoose");
const { Schema } = mongoose;

const VideoSchema = new Schema({
  title: {
    type: String,
    required: "Title is required",
    unique: "Already a video exists with this title",
  },
  url: {
    type: String,
    required: "Video url is missing",
    unique: "duplicate urls for this video",
  },
  description: {
    type: String,
  },
  views: {
    type: Number,
  },
  comments: {
    type: Array,
  },
});

const Video = mongoose.model("Video", VideoSchema);

module.exports = { Video };
