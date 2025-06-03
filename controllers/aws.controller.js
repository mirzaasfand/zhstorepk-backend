import { generateUploadURL } from "../helper/aws.helper.js";

export const getUploadURL = async (req, res) => {
  generateUploadURL()
    .then((url) => res.status(200).json({ uploadURL: url }))
    .catch((error) => {
      console.error(error);
      return res.status(500).send({
        success: false,
        message: "Internal Server Error. Please try another account.",
      });
    });
};
