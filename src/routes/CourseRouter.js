const Router = require("express");
const CourseController = require("../controllers/CourseController");
const MiddleWares = require("../middlewares/middlewares");

class CourseRouter {
  static router;

  constructor() {
    this.router = Router();
    this.getRoutes();
    this.postRoutes();
    this.putRoutes();
    this.patchRoutes();
    this.deleteRoutes();
  }
  getRoutes() {
    this.router.get("/", MiddleWares.optionalAuth, CourseController.load);
    this.router.get(
      "/:id",
      MiddleWares.optionalAuth,
      CourseController.loadById
    );
    this.router.get(
      "/purchased",
      MiddleWares.auth,
      CourseController.loadPurchasedCourses
    );
  }
  postRoutes() {
    this.router.post(
      "/create",
      MiddleWares.auth,
      MiddleWares.adminRoute,
      CourseController.create
    );
  }
  putRoutes() {
    this.router.put(
      "/:id",
      MiddleWares.auth,
      MiddleWares.adminRoute,
      CourseController.update
    );
  }
  patchRoutes() {
    this.router.patch(
      "/addImage/:id",
      MiddleWares.auth,
      MiddleWares.adminRoute,
      CourseController.addImage
    );
    this.router.patch(
      "/addVideo/:id",
      MiddleWares.auth,
      MiddleWares.adminRoute,

      CourseController.addVideo
    );
  }
  deleteRoutes() {
    this.router.delete(
      "/:id",
      MiddleWares.auth,
      MiddleWares.adminRoute,
      CourseController.archive
    );
  }
}

module.exports = new CourseRouter().router;
