const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  secret_key: { type: String, required: true },
  is_active: { type: Boolean, default: true },
});

module.exports = mongoose.model("AiModel", Schema);
