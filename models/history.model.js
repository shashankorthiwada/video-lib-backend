const mongoose = require("mongoose");
const { Schema } = mongoose;

const HistorySchema = new Schema({
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

const HistoryVideo = mongoose.model("HistoryVideo", HistorySchema);

module.exports = { HistoryVideo };
