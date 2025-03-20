const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const Module = require("../models/Module");

class ModuleController {
  static async create(req, res, next) {
    const { name, description, courseId } = req.body;
    try {
      const module = await new Module({
        name,
        description,
        course: courseId,
      }).save();

      const course = await Course.findOne({
        _id: courseId,
      });
      course.modules.push(module);
      await course.save();
      return res.json({ module });
    } catch (e) {
      next(e);
    }
  }
  static async addLesson(req, res, next) {
    const { moduleId } = req.params;
    const { lessonId } = req.body;

    try {
      const module = await Module.findById(moduleId);
      if (!module) {
        return res.status(422).json({ error: "Module not found!" });
      }

      if (module.lessons.includes(lessonId)) {
        return res.status(422).json({ error: "Lesson already added!" });
      }
      module.lessons.push(lessonId);
      await module.save();
    } catch (e) {
      next(e);
    }
  }

  // static async load(req, res, next) {
  //   const { courseId } = req.params;

  //   try {
  //     const modules = await Module.find({
  //       course: courseId,
  //     }).populate("lessons");
  //     return res.json({ modules });
  //   } catch (e) {
  //     next(e);
  //   }
  // }

  static async loadById(req, res, next) {
    const { moduleId } = req.params;

    try {
      const module = await Module.findOne({
        _id: moduleId,
      }).populate("lessons course");

      if (!module) {
        return res.status(422).json({ erorr: "Module not found!" });
      }
      return res.json({ module });
    } catch (e) {
      next(e);
    }
  }
  static async update(req, res, next) {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
      const module = await Module.findOneAndUpdate(
        {
          _id: id,
        },
        { $set: { name, description } },
        { new: true }
      );
      if (!module) {
        return res.status(422).json({ error: "Module not found!" });
      }
      res.json({ module });
    } catch (e) {
      next(e);
    }
  }
  static async delete(req, res, next) {
    const { moduleId, courseId } = req.params;
    try {
      const module = await Module.findOneAndDelete({
        course: courseId,
        _id: moduleId,
      });

      if (!module) {
        return res.status(422).json({ error: "Module not found!" });
      }

      const course = await Course.findOne({
        _id: courseId,
      });
      course.modules = course.modules.filter(
        (module) => module.toString() !== moduleId.toString()
      );

      await course.save();

      await Lesson.deleteMany({
        module: moduleId,
      });

      res.json({ deleted: "Successfuly" });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = ModuleController;
