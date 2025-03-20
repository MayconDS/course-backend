const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const http = require("http"); // Adicionado para usar com o Socket.IO
const { Server: SocketServer } = require("socket.io"); // Socket.IO

const getEnvironmentVariables = require("./environments/environment.js");

// Rotas
const UserRouter = require("./routes/UserRouter.js");
const CourseRouter = require("./routes/CourseRouter.js");
const ModuleRouter = require("./routes/ModuleRouter.js");
const LessonRouter = require("./routes/LessonRouter.js");
const UploadRouter = require("./routes/UploadRouter.js");
const MercadoPagoRouter = require("./routes/MercadoPagoRouter.js");
const WebSocketService = require("./services/WebSocketService.js");

class Server {
  constructor() {
    this.app = express();
    this.httpServer = http.createServer(this.app);
    this.io = new SocketServer(this.httpServer, {
      cors: { origin: "*", methods: ["GET", "POST"] },
    });

    WebSocketService.initialize(this.io);

    this.setLogs();
    this.setConfigs();
    this.setRoutes();
    this.error404Handle();
    this.handleErrors();
  }

  setLogs() {
    this.app.use(morgan("dev"));
  }

  setConfigs() {
    this.connectMongoDB();
    this.allowCors();
    this.configureBodyParser();
  }

  connectMongoDB() {
    mongoose.connect(getEnvironmentVariables().db_uri).then(() => {
      console.log("Connected to database");
    });
  }

  configureBodyParser() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
  }

  allowCors() {
    this.app.use(
      cors({
        credentials: true,
      })
    );
  }

  setRoutes() {
    this.app.use("/uploads", express.static(path.join(__dirname, "uploads")));
    this.app.use("/api/upload", UploadRouter);
    this.app.use("/api/user", UserRouter);
    this.app.use("/api/course", CourseRouter);
    this.app.use("/api/module", ModuleRouter);
    this.app.use("/api/lesson", LessonRouter);
    this.app.use("/api/payment", MercadoPagoRouter);
  }

  error404Handle() {
    this.app.use((req, res) => {
      res.status(404).json({
        message: "Not Found",
        status_code: 404,
      });
    });
  }

  handleErrors() {
    this.app.use((err, req, res, next) => {
      const errorStatus = req.errorStatus || 500;
      res.status(errorStatus).json({
        message: err.message || "Something went wrong. Please try again",
        status_code: errorStatus,
      });
    });
  }
}

module.exports = Server;
