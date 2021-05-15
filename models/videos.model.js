const mongoose = require("mongoose");
const { Schema } = mongoose;

const VideoSchema = new Schema(
  {
    vid: {
      type: String,
      required: "Video Id is required",
      unique: true,
    },
    title: {
      type: String,
      required: "Title is required",
      unique: "Already a video exists with this title",
    },
    createdby: String,
    image: String,
    subscribers: Number,
    date: Date,
    description: {
      type: String,
    },
    views: {
      type: Number,
    },
    comments: {
      type: Array,
    },
  },
  {
    timeStamps: true,
  }
);

const Video = mongoose.model("Video", VideoSchema);

module.exports = { Video };
