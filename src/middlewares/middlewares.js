const Jwt = require("../utils/Jwt");
const { validationResult } = require("express-validator");
const upload = require("../config/multerConfig");
const User = require("../models/User");

class MiddleWares {
  static checkError(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(new Error(errors.array()[0].msg));
    } else {
      next();
    }
  }
  static optionalAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }
    const token = authHeader.split(" ")[1];

    try {
      const decoded = await Jwt.verify(token);
      req.user = decoded; // Aqui você coloca o usuário decodificado no request
      next();
    } catch (e) {
      next();
    }
  };
  static auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.errorStatus = 401;
      return next(new Error("Authorization is required or invalid format"));
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      req.errorStatus = 401;
      return next(new Error("User token is missing"));
    }

    try {
      const decoded = await Jwt.verify(token);
      req.user = decoded; // Aqui você coloca o usuário decodificado no request
      next();
    } catch (e) {
      req.errorStatus = 401;
      next(new Error("Invalid or expired token"));
    }
  };
  static adminRoute = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
      req.errorStatus = 403;
      return next(new Error("Access denied: Admins only"));
    }
    next();
  };
  static uploadImage(req, res, next) {
    const limits = { fileSize: 1024 * 1024 * 5 }; // 5MB TO IMAGE
    return upload("images", limits, /jpeg|jpg|png/).single("image");
  }
  static uploadVideo(req, res, next) {
    const limits = { fileSize: 1024 * 1024 * 220 }; // 220MB TO VIDEO
    return upload("videos", limits, /mp4|avi|mkv/).single("video");
  }
}

module.exports = MiddleWares;
