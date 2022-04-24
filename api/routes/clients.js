/* eslint-disable import/no-import-module-exports */

const express = require("express");
const stream = require("stream");
const multer = require("multer");
const { google } = require("googleapis");
const { updateOneClient } = require("../services/client-service");
const { findById } = require("../services/client-service");

const router = express.Router();
const {
  index,
  store,
  updateOne,
  deleteOne,
  findOne,
  searchClient,
} = require("../controllers/client-controller");

router.get("/", index);

router.post("/", store);

router.get("/:id", findOne);

router.patch("/:id", updateOne);

router.delete("/:id", deleteOne);

const upload = multer({
  limit: 15 * 1024 * 1024,
  fileFilter(req, file, cb) {
    return cb(undefined, req.params.id);
  },
}).single("avatar");

const DRIVE_FOLDER_ID = "1pIyiqDiz2owtqt8LNbDWmt0w1Sabk93O";
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  keyFile: "googleapi-config.json",
  scopes: SCOPES,
});
const driveService = google.drive({ version: "v3", auth });

const uploadFile = async (fileObject, id) =>
  new Promise((resolve, reject) => {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileObject.buffer);
    if (id) {
      driveService.files
        .delete({
          fileId: id,
        })
        .then(
          () => {},
          (err) => reject(err)
        );
    }
    driveService.files
      .create({
        media: {
          mimeType: fileObject.mimeType,
          body: bufferStream,
        },
        requestBody: {
          name: id,
          parents: [DRIVE_FOLDER_ID],
        },
        fields: "id",
      })
      .then(({ data }) => {
        resolve(data.id);
      })
      .catch((err) => reject(err));
  });

router.post("/upload/client/avatar/:id", async (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(409).send({ message: err });
    }
    if (err) {
      return res.status(409).send({ message: "Unknown error." });
    }
    try {
      const userId = req.params.id;
      const clientFind = await findById(userId);
      const id = await uploadFile(req.file, clientFind[0].avatar);
      await updateOneClient(userId, { avatar: id });
      const client = await findById(userId);
      return res.status(200).json({
        message: "ছবিটি আপলোড করা হয়েছে।",
        results: client[0],
      });
    } catch (_) {
      return res
        .status(409)
        .send({ message: "Could not read data from uploaded file." });
    }
  });
});

router.get("/search/:query", searchClient);

module.exports = router;
