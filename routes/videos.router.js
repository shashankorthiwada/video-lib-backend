const express = require("express");
const router = express.Router();
const {
  getVideos,
  saveVideos,
  findVideo,
  getVideoById,
} = require("../controllers/video.controller");

router.route("/").get(getVideos).post(saveVideos);

router.param("videoId", findVideo);

router.route("/:videoId").get(getVideoById);

module.exports = router;
