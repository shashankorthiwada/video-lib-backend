const mongoose = require("mongoose");
const { Schema } = mongoose;

const PlaylistSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: "You don't have any Playlists",
  },
  playlists: [
    {
      playlistname: {
        type: String,
        requried: "playlist name is required",
        unique: "already a playlist exists with this name",
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
      active: Boolean,
    },
  ],
});

const Playlist = mongoose.model("Playlist", PlaylistSchema);

module.exports = { Playlist };
