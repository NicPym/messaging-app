const mongoose = require("mongoose");
// layout of source
const messageSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  description: { type: String, required: true },
  sender: { type: String, required: true },
});

module.exports = mongoose.model("message", messageSchema);
