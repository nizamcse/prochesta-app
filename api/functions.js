// eslint-disable-next-line no-unused-vars
const fs = require("fs");
const { google } = require("googleapis");

const DRIVE_FOLDER_ID = "1pIyiqDiz2owtqt8LNbDWmt0w1Sabk93O";

// eslint-disable-next-line import/prefer-default-export
export async function uploadFile(name, media) {
  return new Promise((resolve, reject) => {
    try {
      const auth = new google.auth.GoogleAuth({
        keyFile: "./googleapi-config.json",
        scopes: ["https://www.googleapis.com/auth/drive"],
      });

      const driveService = google.drive({
        version: "v3",
        auth,
      });

      const fileMetaData = {
        name,
        parents: [DRIVE_FOLDER_ID],
      };

      // const media = {
      //   mimeType: "image/jpg",
      //   body: fs.createReadStream("./snow.jpg"),
      // };

      driveService.files
        .create({
          resource: fileMetaData,
          media,
          field: "id",
        })
        .then((response) => {
          resolve(response.data.id);
        })
        .catch((err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
}
