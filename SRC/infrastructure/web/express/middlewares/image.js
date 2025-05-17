const multer = require("multer");

const upload = multer({
  dest: "uploads/", // cartella temporanea
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB max
});

module.exports = upload;