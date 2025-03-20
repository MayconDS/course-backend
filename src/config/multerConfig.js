const multer = require("multer");
const path = require("path");

// Configuração genérica do multer com opção de mudar o destino dinamicamente
const storage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(__dirname, `../uploads/${folder}/`);
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
      );
    },
  });

const fileFilter = (fileTypes) => (req, file, cb) => {
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(
      new Error(`Error: Apenas arquivos do tipo ${fileTypes} são permitidos!`)
    );
  }
};

const upload = (folder, limits = { fileSize: 1024 * 1024 * 50 }, fileTypes) =>
  multer({
    storage: storage(folder),
    limits: limits,
    fileFilter: fileFilter(fileTypes),
  });

module.exports = upload;
