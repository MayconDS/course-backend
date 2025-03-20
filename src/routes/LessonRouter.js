const Router = require("express");
const MiddleWares = require("../middlewares/middlewares");
const LessonController = require("../controllers/LessonController");

class LessonRouter {
  static router;

  constructor() {
    this.router = Router();
    this.getRoutes();
    this.postRoutes();
    this.putRoutes();

    this.deleteRoutes();
  }
  getRoutes() {
    this.router.get("/:id", MiddleWares.auth, LessonController.loadById);
  }
  postRoutes() {
    this.router.post(
      "/create",
      MiddleWares.auth,
      MiddleWares.adminRoute,
      LessonController.create
    );
  }
  putRoutes() {
    this.router.put(
      "/:id",
      MiddleWares.auth,
      MiddleWares.adminRoute,
      LessonController.update
    );
  }

  deleteRoutes() {
    this.router.delete(
      "/:lessonId/:moduleId",
      MiddleWares.auth,
      MiddleWares.adminRoute,
      LessonController.delete
    );
  }
}

module.exports = new LessonRouter().router;
