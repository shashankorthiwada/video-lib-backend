const { User } = require("../models/user.model");
const { Playlist } = require("../models/playlist.model");
const { concat } = require("lodash");

const getPlaylists = async (req, res) => {
  const playlist = await Playlist.find({});
  res.json({ success: true, playlist });
};

const findUserPlaylist = async (req, res, next, userId) => {
  try {
    let user = await User.findOne({ _id: userId });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      throw Error("user not found");
    }
    let playlist = await Playlist.findOne({ userId });
    if (!playlist) {
      playlist = new Playlist({
        userId,
        playlists: [{ name: "Playlist1", videos: [], active: true }],
      });
      playlist = await playlist.save();
    }
    req.playlist = playlist;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error fetching user playlists",
      errorMessage: error.message,
    });
  }
};

const getActivePlaylists = async (playlist) => {
  playlist.playlists = playlist.playlists.filter((list) => list.active);

  for (let list of playlist.playlists) {
    if (list.videos.length > 0) {
      list.videos = list.videos.filter((video) => video.active);
    }
  }
  return playlist.playlists;
};

const getUserPlaylist = async (req, res) => {
  try {
    let { playlist } = req;
    let playlists = await getActivePlaylists(playlist);
    res.status(200).json({ success: true, data: playlists });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "unable to fetch user playlists",
      errorMessage: err.message,
    });
  }
};

const createUserPlaylist = async (req, res) => {
  const { playlistname, _id } = req.body;
  let { playlist } = req;
  let newList = {
    playlistname,
    videos: [{ _id, active: true }],
    active: true,
  };
  playlist.playlists = concat(playlist.playlists, newList);
  let updatedPlaylist = await playlist.save();
  newList = updatedPlaylist.playlists[updatedPlaylist.playlists.length - 1];
  res.status(200).json({ success: true, playlist: newList });
};

const updatePlaylistName = async (req, res) => {
  try {
    const { _id, playlistname } = req.body;
    let { playlist } = req;
    for (let list of playlist.playlists) {
      if (list._id === _id) {
        list.playlistname = playlistname;
        break;
      }
    }
    let updatedPlaylist = await playlist.save();
    updatedPlaylist = await getActivePlaylists(updatedPlaylist);
    res.status(200).json({ success: true, playlist: updatedPlaylist });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to Update Playlist Name",
      errorMessage: error.message,
    });
  }
};

const getVideosInPlaylist = async (playlist, listId) => {
  let existingPlaylist = playlist.playlists.find(
    (list) => list._id == listId && list.active
  );
  console.log("existingPlaylist: ", existingPlaylist);
  if (!existingPlaylist) {
    throw Error("No Playlist Found");
  }
  return existingPlaylist.videos;
};

const getActiveVideos = async (videoList) => {
  videoList = videoList.filter((video) => video.active);
  console.log("videoList: ", videoList);
  return videoList.map((video) => video._id);
};

const getPlaylistVideos = async (req, res) => {
  const { playlistId } = req.params;
  const { playlist } = req;
  console.log("playlistId", playlistId);
  console.log("playlist: ", playlist);
  let playlistVideos = await getVideosInPlaylist(playlist, playlistId);
  playlistVideos = await getActiveVideos(playlistVideos);
  res.json({ success: true, playlist: playlistVideos });
};

const updatePlaylistVideo = async (req, res) => {
  let { playlist } = req;
  const { playlistId } = req.params;
  const { _id } = req.body;
  let playlistVideos = getVideosInPlaylist(playlist, playlistId);
  playlistVideos = playlistVideos.map((video) => video._id);
  const videoExists = playlistVideos.some((video) => video == _id);
  for (let list of playlist.playlists) {
    if (list._id == playlistId) {
      if (videoExists) {
        for (let video of list.videos) {
          if (video._id == _id) {
            video.active = !video.active;
            break;
          }
        }
      } else {
        list.videos.push({ _id, active: true });
        break;
      }
    }
  }
  let updatedPlaylist = await playlist.save();
  playlistVideos = getVideosInPlaylist(updatedPlaylist, playlistId);
  playlistVideos = getActiveVideos(playlistVideos);
  res.json({ success: true, playlist: playlistVideos });
};

const removePlaylist = async (req, res) => {
  let { playlist } = req;
  const { playlistId } = req.params;
  for (let list of playlist.playlists) {
    if (list._id == playlistId) {
      list.active = false;
      break;
    }
  }
  playlist.playlists[0].active = true;
  let updatedPlaylist = await playlist.save();
  updatedPlaylist = await getActivePlaylistItems(updatedPlaylist);
  res.json({ success: true, playlist: updatedPlaylist });
};

module.exports = {
  createUserPlaylist,
  getUserPlaylist,
  findUserPlaylist,
  getPlaylists,
  removePlaylist,
  updatePlaylistVideo,
  getPlaylistVideos,
  updatePlaylistName,
};