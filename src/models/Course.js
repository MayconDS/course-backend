const mongoose = require("mongoose");

const CourseSchema = mongoose.Schema(
  {
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
    about: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    modules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
      },
    ],

    level: {
      type: String,
      required: true,
      default: "Básico",
    },
    status: {
      type: String,
      required: true,
      default: "published",
    },
    price: {
      type: Number,
      required: true,
      default: 29.99,
    },
    preview: {
      image: String,

      video: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);
