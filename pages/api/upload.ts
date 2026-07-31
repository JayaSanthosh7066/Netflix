import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import formidable from "formidable";
import { uploadFileToS3 } from "@/libs/s3";

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

      const fileBuffer = fs.readFileSync(file.filepath);

      // Decide folder based on type
      let folder = "";

      switch (type) {
        case "video":
          folder = "videos";
          break;

        case "thumbnail":
          folder = "thumbnails";
          break;

        case "banner":
          folder = "banners";
          break;

        default:
          folder = "others";
      }

      // Create one key and reuse it
      const key = `${folder}/${Date.now()}-${file.originalFilename}`;

      const url = await uploadFileToS3(
        key,
        fileBuffer,
        file.mimetype || undefined,
      );

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
