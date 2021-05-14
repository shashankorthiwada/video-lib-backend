require("dotenv").config();
const port = process.env.PORT || 3002;
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const { initializeDbConnection } = require("./db/db.connect");

initializeDbConnection();

const app = express();
app.use(cors());
app.use(express.json());

const videoRouter = require("./routes/videos.router");

app.use("/videos", videoRouter);

app.listen(port, () => {
  console.log("server started successfully at port: ", port);
});
