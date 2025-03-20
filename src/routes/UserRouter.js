const Router = require("express");
const UserController = require("../controllers/UserController");
const MiddleWares = require("../middlewares/middlewares");
const UserValidators = require("../validators/UserValidators");

class UserRouter {
  static router;

  constructor() {
    this.router = Router();
    this.getRoutes();
    this.postRoutes();
    this.patchRoutes();
    this.putRoutes();
    this.deleteRoutes();
  }

  getRoutes() {
    this.router.get("/", MiddleWares.auth, UserController.load);
  }
  postRoutes() {
    this.router.post(
      "/signup",
      UserValidators.signup(),
      MiddleWares.checkError,
      UserController.signup
    );
    this.router.post(
      "/login",
      UserValidators.login(),
      MiddleWares.checkError,
      UserController.login
    );
    this.router.post(
      "/send-change-email-code",
      MiddleWares.auth,
      UserController.sendChangeEmailCode
    );
    this.router.post(
      "/forgot-password",
      UserValidators.forgotPassword(),
      MiddleWares.checkError,
      UserController.forgotPassword
    );
    this.router.post(
      "/verify-password",
      UserValidators.verifyPassword(),
      MiddleWares.checkError,
      UserController.verifyPassword
    );
  }
  putRoutes() {
    this.router.put(
      "/",
      UserValidators.update(),
      MiddleWares.checkError,
      MiddleWares.auth,
      UserController.update
    );
  }
  patchRoutes() {
    this.router.patch(
      "/update-email",
      MiddleWares.auth,
      UserController.updateEmail
    );
    this.router.patch(
      "/reset-password",
      UserValidators.verifyPassword(),
      MiddleWares.checkError,
      UserController.resetPassword
    );
    this.router.patch(
      "/update-password",
      MiddleWares.auth,
      UserController.updatePassword
    );
  }
  deleteRoutes() {
    this.router.delete("/", MiddleWares.auth, UserController.delete);
  }
}

module.exports = new UserRouter().router;
