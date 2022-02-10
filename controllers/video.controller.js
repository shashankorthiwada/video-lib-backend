const { Video } = require("../models/videos.model");

const getVideos = async (req, res) => {
  try {
    const videos = await Video.find({});
    res.status(200).json({ success: true, videos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, errorMessage: error.message });
  }
};

const saveVideos = async (req, res) => {
  try {
    const video = req.body;
    const newVideo = new Video(video);
    const addedVideo = await newVideo.save();
    res.status(200).json({ success: true, data: addedVideo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, errorMessage: error.message });
  }
};

const findVideo = async (req, res, next, videoId) => {
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      throw Error("No video found with these details");
    }
    req.video = video;
    next();
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        Message: "error fetching video Id params",
        errorMessage: error.message,
      });
  }
};

const getVideoById = async (req, res) => {
  const { video } = req;
  video._v = undefined;
  res.json({ success: true, video });
};

module.exports = {
  getVideos,
  saveVideos,
  findVideo,
  getVideoById,
};
