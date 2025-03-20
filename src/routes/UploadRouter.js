const Router = require("express");
const MiddleWares = require("../middlewares/middlewares");
const UploadController = require("../controllers/UploadController");

class UploadRouter {
  static router;

  constructor() {
    this.router = Router();
    this.postRoutes();
  }
  postRoutes() {
    this.router.post(
      "/uploadImage",
      MiddleWares.auth,
      MiddleWares.adminRoute,
      MiddleWares.uploadImage(),
      UploadController.uploadImage
    );
    this.router.post(
      "/uploadVideo",
      MiddleWares.auth,
      MiddleWares.adminRoute,
      MiddleWares.uploadVideo(),
      UploadController.uploadVideo
    );
  }
}

module.exports = new UploadRouter().router;
