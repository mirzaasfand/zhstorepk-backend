import aws from "aws-sdk";
import { nanoid } from "nanoid";

// Setting AWS S3 Bucket
const s3 = new aws.S3({
  region: "eu-north-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const generateUploadURL = async () => {
  const date = new Date();
  const imageName = `${date.getTime()}-${nanoid()}.jpeg`;

  return await s3.getSignedUrlPromise("putObject", {
    Bucket: "zhstorepk.com",
    Key: imageName,
    Expires: 1000,
    ContentType: "image/jpeg",
  });
};
