const Lesson = require("../models/Lesson");
const Module = require("../models/Module");

class LessonController {
  static async create(req, res, next) {
    const { name, description, video, additional_files, moduleId, slug } =
      req.body;
    try {
      const module = await Module.findOne({
        _id: moduleId,
      });
      if (!module) {
        return res.status(422).json({ error: "Module not found!" });
      }
      const lesson = await new Lesson({
        name,
        description,
        video,
        additional_files,
        module: moduleId,
        slug,
      }).save();

      if (module.lessons.includes(lesson._id)) {
        return res.status(422).json({ error: "Lesson already exists!" });
      }
      module.lessons.push(lesson._id);
      await module.save();

      res.json({ lesson });
    } catch (e) {
      next(e);
    }
  }
  static async loadById(req, res, next) {
    const { id } = req.params;
    try {
      const lesson = await Lesson.findById(id);
      if (!lesson) {
        return res.status(422).json({ error: "Lesson not found!" });
      }
      res.json({ lesson });
    } catch (e) {
      next(e);
    }
  }
  static async update(req, res, next) {
    const { id } = req.params;
    const { name, description, video, additional_files } = req.body;
    try {
      const lesson = await Lesson.findOneAndUpdate(
        {
          _id: id,
        },
        { $set: { name, description, video, additional_files } },
        {
          new: true,
        }
      );
      if (!lesson) {
        return res.status(422).json({ error: "Lesson not found!" });
      }
      res.json({ lesson });
    } catch (e) {
      next(e);
    }
  }
  static async delete(req, res, next) {
    const { lessonId, moduleId } = req.params;
    try {
      const lesson = await Lesson.findOneAndDelete({
        _id: lessonId,
      });
      if (!lesson) {
        return res.status(422).json({ error: "Lesson not found!" });
      }
      const module = await Module.findOne({
        _id: moduleId,
      });

      module.lessons = module.lessons.filter(
        (lesson) => lesson.toString() !== lessonId.toString()
      );
      await module.save();
      res.json({ deleted: "Successfully!" });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = LessonController;
