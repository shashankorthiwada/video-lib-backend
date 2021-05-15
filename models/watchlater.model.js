const mongoose = require("mongoose");
const { Schema } = mongoose;

const WatchlaterSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
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

const WatchLaterVideo = mongoose.model("WatchLaterVideo", WatchlaterSchema);

module.exports = { WatchLaterVideo };
