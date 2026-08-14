import { NextApiRequest, NextApiResponse } from "next";
import { getPresignedUploadUrl } from "@/libs/s3";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Method Not Allowed",
      });
    }

    const { type, fileName, contentType, seriesId } = req.body;

    if (!type || !fileName || !contentType) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

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

      case "image-series-cover":
        folder = "image-series/covers";
        break;

      case "image":
        if (!seriesId) {
          return res.status(400).json({
            error: "seriesId is required for image uploads",
          });
        }

        folder = `image-series/${seriesId}`;
        break;

      default:
        folder = "others";
    }

    const key = `${folder}/${Date.now()}-${fileName}`;

    const { uploadUrl, fileUrl } = await getPresignedUploadUrl(
      key,
      contentType,
    );

    return res.status(200).json({
      uploadUrl,
      fileUrl,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to generate upload URL",
    });
  }
}
