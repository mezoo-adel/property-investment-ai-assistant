const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  name: { type: String, required: true },
  prompts: { type: Array, required: true },
  // each prompet has {role, content}
});

module.exports = mongoose.model("Prompt", Schema);
