class UploadController {
  static async uploadImage(req, res, next) {
    if (!req.file) {
      return res.status(422).json({ error: "Image to upload is necessary!" });
    }
    return res.json({
      path: `localhost:4000/uploads/images/${req.file.filename}`,
    });
  }
  static async uploadVideo(req, res, next) {
    if (!req.file) {
      return res.status(422).json({ error: "Video to upload is necessary!" });
    }
    return res.json({
      path: `localhost:4000/uploads/videos/${req.file.filename}`,
    });
  }
}
module.exports = UploadController;
