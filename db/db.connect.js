const mongoose = require("mongoose");
async function initializeDbConnection() {
  try {
    const uri = process.env.DB_URI;
    const result = await mongoose.connect(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Connected Successfully", result);
  } catch (error) {
    console.log("mongoose Connection Failed", error);
  }
}

module.exports = { initializeDbConnection };
