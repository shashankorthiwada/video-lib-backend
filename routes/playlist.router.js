const express = require("express");
const router = express.Router();
const listRouter = express.Router({ mergeParams: true });

const {
  getPlaylists,
  findUserPlaylist,
  getUserPlaylist,
  createUserPlaylist,
  updatePlaylistName,
  getPlaylistVideos,
  updatePlaylistVideo,
  removePlaylist,
} = require("../controllers/playlist.controller");

router.use("/:userId/list", listRouter);

router.route("/").get(getPlaylists);

router.param("userId", findUserPlaylist);

router
  .route("/:userId")
  .get(getUserPlaylist)
  .post(createUserPlaylist)
  .put(updatePlaylistName);

listRouter
  .route("/:playlistId")
  .get(getPlaylistVideos)
  .post(updatePlaylistVideo)
  .delete(removePlaylist);

module.exports = router;
