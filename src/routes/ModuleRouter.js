const Router = require("express");
const MiddleWares = require("../middlewares/middlewares");
const ModuleController = require("../controllers/ModuleController");

class ModuleRouter {
  static router;

  constructor() {
    this.router = Router();
    this.getRoutes();
    this.postRoutes();
    this.putRoutes();

    this.deleteRoutes();
  }
  getRoutes() {
    // this.router.get("/:courseId", MiddleWares.auth, ModuleController.load);
    this.router.get("/:moduleId", MiddleWares.auth, ModuleController.loadById);
  }
  postRoutes() {
    this.router.post(
      "/create",
      MiddleWares.auth,
      MiddleWares.adminRoute,
      ModuleController.create
    );
  }
  putRoutes() {
    this.router.put(
      "/:id",
      MiddleWares.auth,
      MiddleWares.adminRoute,
      ModuleController.update
    );
  }

  deleteRoutes() {
    this.router.delete(
      "/:moduleId/:courseId",
      MiddleWares.auth,
      MiddleWares.adminRoute,
      ModuleController.delete
    );
  }
}

module.exports = new ModuleRouter().router;
