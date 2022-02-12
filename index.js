require("dotenv").config();
const port = process.env.PORT || 3002;
const express = require("express");
const cors = require("cors");
// const corsOptions = {
//   origin: "*",
//   credentials: true,
//   optionSuccessStatus: 200,
// };
const bodyParser = require("body-parser");

const { initializeDbConnection } = require("./db/db.connect");

initializeDbConnection();

const app = express();
app.use(cors());
app.use(express.json());

const videoRouter = require("./routes/videos.router");
const userRouter = require("./routes/user.router");
const playlistRouter = require("./routes/playlist.router");
// const authRouter = require("./routes/auth.router");
const { errorHandler } = require("./middlewares/error-handler.middleware");
const {
  routeNotFound,
} = require("./middlewares/routenotfound-handler.middleware");

app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/playlists", playlistRouter);
// app.use("/auth", authRouter);

app.use(routeNotFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log("server started successfully at port: ", port);
});
