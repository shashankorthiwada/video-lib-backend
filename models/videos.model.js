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
    subscribers: Number,
    date: String,
    description: {
      type: String,
    },
    views: {
      type: Number,
    },
  },
  {
    timeStamps: true,
  }
);

const Video = mongoose.model("Video", VideoSchema);

module.exports = { Video };
