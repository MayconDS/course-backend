const mongoose = require("mongoose");

const LessonSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    required: true,
  },
  additional_files: {
    type: String,
    default: {},
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module",
    required: true,
  },
});

module.exports = mongoose.model("Lesson", LessonSchema);
