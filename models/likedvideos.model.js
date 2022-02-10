const mongoose = require("mongoose");
const { Schema } = mongoose;

const LikedVideoSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: "You have no liked videos",
  },
  videos: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
      active: Boolean,
    },
  ],
});

const LikedVideo = mongoose.model("LikedVideo", LikedVideoSchema);

module.exports = { LikedVideo };
