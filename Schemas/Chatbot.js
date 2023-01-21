const { model, Schema } = require("mongoose");

let AI = new Schema({
  Guild: String,
  Channel: String,
  Type: String,
});

module.exports = model("AI", AI);
