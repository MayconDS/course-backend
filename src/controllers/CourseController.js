const Course = require("../models/Course");
const User = require("../models/User");

class CourseController {
  // ADMIN
  static async create(req, res, next) {
    const { name, description, category, level, status, price, preview } =
      req.body;

    try {
      const course = await new Course({
        name,
        description,
        category,
        level,
        status,
        price,
        preview,
      }).save();
      res.json({ course });
    } catch (e) {
      next(e);
    }
  }
  // USER
  static async load(req, res, next) {
    const user = req.user;
    const queryDB = user
      ? user.role == "admin"
        ? {}
        : { status: "published" }
      : { status: "published" };

    try {
      const courses = await Course.find(queryDB);
      res.json({ courses });
    } catch (e) {
      next(e);
    }
  }
  // USER
  static async loadById(req, res, next) {
    const { id } = req.params;
    const user = req.user;
    const queryDB = user
      ? user.role == "admin"
        ? { _id: id }
        : { _id: id, status: "published" }
      : { _id: id, status: "published" };
    try {
      const course = await Course.findOne(queryDB).populate("modules");
      if (!course) {
        return res.status(422).json({
          error: "Course not found!",
        });
      }
      res.json({ course });
    } catch (e) {
      next(e);
    }
  }
  // USER
  static async loadPurchasedCourses(req, res, next) {
    const userId = req.user._id;
    try {
      const user = await User.findById(userId).populate("purchasedCourses");
      if (!user) {
        return res.status(422).json({ message: "User not found!" });
      }
      res.json({ courses: user.purchasedCourses });
    } catch (e) {
      next(e);
    }
  }
  // ADMIN
  static async update(req, res, next) {
    const { id } = req.params;
    const { name, description, category, level, status, price } = req.body;

    try {
      const course = await Course.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $set: {
            name,
            description,
            category,
            level,
            status,
            price,
          },
        },
        {
          new: true,
        }
      );
      if (!course) {
        return res.status(422).json({
          error: "Course not found!",
        });
      }
      res.json({ course });
    } catch (e) {
      next(e);
    }
  }
  // ADMIN
  static async archive(req, res, next) {
    const { id } = req.params;
    try {
      const course = await Course.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $set: {
            status: "archived",
          },
        },
        {
          new: true,
        }
      );
      if (!course) {
        return res.status(422).json({
          error: "Course not found!",
        });
      }
      res.json({
        message: "Course Archived Successfully!",
      });
    } catch (e) {
      next(e);
    }
  }
  // ADMIN
  static async addImage(req, res, next) {
    const courseId = req.params.id;
    const [image] = req.body;

    try {
      const course = await Course.findOneAndUpdate(
        {
          _id: courseId,
        },
        {
          $set: {
            preview: {
              image: `localhost:4000/uploads/images/${req.file.image}`,
            },
          },
        },
        { new: true }
      );
      if (!course) {
        return res.status(422).json({ error: "Course not found!" });
      }
      res.json({ course });
    } catch (e) {
      next(e);
    }
  }
  // ADMIN
  static async addVideo(req, res, next) {
    const courseId = req.params.id;
    const { video } = req.body;
    try {
      const course = await Course.findOneAndUpdate(
        {
          _id: courseId,
        },
        {
          $set: {
            preview: {
              video: `localhost:4000/uploads/videos/${video}`,
            },
          },
        },
        { new: true }
      );
      if (!course) {
        return res.status(422).json({ error: "Course not found!" });
      }
      res.json({ course });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = CourseController;
