import type { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";
import { deleteFileFromS3 } from "@/libs/s3";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { currentUser } = await serverAuth(req, res);

    const { id, imageId } = req.query;

    if (typeof id !== "string" || typeof imageId !== "string") {
      return res.status(400).json({
        error: "Invalid image series or image ID",
      });
    }

    // Verify that the Image Series belongs to the
    // currently logged-in user.
    const imageSeries = await prismadb.imageSeries.findFirst({
      where: {
        id,
        userId: currentUser.id,
      },
    });

    if (!imageSeries) {
      return res.status(404).json({
        error: "Image series not found",
      });
    }

    // Verify that the image belongs to this series.
    const image = await prismadb.image.findFirst({
      where: {
        id: imageId,
        imageSeriesId: id,
      },
    });

    if (!image) {
      return res.status(404).json({
        error: "Image not found",
      });
    }

    if (req.method === "DELETE") {
      // ---------------------------------------------
      // 1. Delete actual file from S3
      // ---------------------------------------------
      await deleteFileFromS3(image.imageUrl);

      // ---------------------------------------------
      // 2. Delete image from database
      // ---------------------------------------------
      await prismadb.image.delete({
        where: {
          id: imageId,
        },
      });

      // ---------------------------------------------
      // 3. Get remaining images in correct order
      // ---------------------------------------------
      const remainingImages = await prismadb.image.findMany({
        where: {
          imageSeriesId: id,
        },
        orderBy: {
          imageNumber: "asc",
        },
      });

      // ---------------------------------------------
      // 4. Renumber remaining images
      // ---------------------------------------------
      for (let index = 0; index < remainingImages.length; index++) {
        const image = remainingImages[index];

        const newImageNumber = index + 1;

        if (image.imageNumber !== newImageNumber) {
          await prismadb.image.update({
            where: {
              id: image.id,
            },
            data: {
              imageNumber: newImageNumber,
            },
          });
        }
      }

      // ---------------------------------------------
      // 5. First image becomes the cover
      // ---------------------------------------------
      const newThumbnailUrl =
        remainingImages.length > 0 ? remainingImages[0].imageUrl : "";

      await prismadb.imageSeries.update({
        where: {
          id,
        },
        data: {
          thumbnailUrl: newThumbnailUrl,
        },
      });

      return res.status(200).json({
        message: "Image deleted successfully",
      });
    }

    return res.status(405).json({
      error: "Method Not Allowed",
    });
  } catch (error) {
    console.error("DELETE IMAGE API ERROR:", error);

    return res.status(500).json({
      error: "Failed to delete image",
    });
  }
}
