import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import formidable from "formidable";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/libs/s3";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        return res.status(500).json({
          error: "Failed to parse file",
        });
      }

      const type = fields.type?.[0]; // "video" or "thumbnail"

      const file = files.file?.[0];

      if (!file) {
        return res.status(400).json({
          error: "No file selected",
        });
      }

      console.log("==========");
      console.log("Type:", type);
      console.log("Filename:", file.originalFilename);
      console.log("Mimetype:", file.mimetype);
      console.log("==========");

      const fileBuffer = fs.readFileSync(file.filepath);

      // Decide folder based on type
      const folder = type === "thumbnail" ? "thumbnails" : "videos";

      // Create one key and reuse it
      const key = `${folder}/${Date.now()}-${file.originalFilename}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: key,
          Body: fileBuffer,
          ContentType: file.mimetype || undefined,
        }),
      );

      // Generate URL
      const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      return res.status(200).json({
        success: true,
        url,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Upload failed",
      });
    }
  });
}
