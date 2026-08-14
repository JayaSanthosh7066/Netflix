import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";
import { deleteFileFromS3 } from "@/libs/s3";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { currentUser } = await serverAuth(req, res);

    const { id } = req.query;

    if (typeof id !== "string") {
      return res.status(400).json({
        error: "Invalid image series ID",
      });
    }

    // Make sure this Image Series belongs to the logged-in user.
    const existingImageSeries = await prismadb.imageSeries.findFirst({
      where: {
        id,
        userId: currentUser.id,
      },
    });

    if (!existingImageSeries) {
      return res.status(404).json({
        error: "Image series not found",
      });
    }

    switch (req.method) {
      // GET ONE IMAGE SERIES
      case "GET": {
        const imageSeries = await prismadb.imageSeries.findFirst({
          where: {
            id,
            userId: currentUser.id,
          },
          include: {
            images: {
              orderBy: {
                imageNumber: "asc",
              },
            },
          },
        });

        return res.status(200).json(imageSeries);
      }

      // UPDATE IMAGE SERIES
      case "PATCH": {
        const { title, description, thumbnailUrl } = req.body;

        if (!title || !description) {
          return res.status(400).json({
            error: "Missing required fields",
          });
        }

        const imageSeries = await prismadb.imageSeries.update({
          where: {
            id,
          },
          data: {
            title,
            description,
            ...(thumbnailUrl !== undefined && {
              thumbnailUrl,
            }),
          },
        });

        return res.status(200).json(imageSeries);
      }

      // DELETE IMAGE SERIES
      case "DELETE": {
        const images = await prismadb.image.findMany({
          where: {
            imageSeriesId: id,
          },
          select: {
            imageUrl: true,
          },
        });

        // Delete all image files from S3
        for (const image of images) {
          await deleteFileFromS3(image.imageUrl);
        }

        // Delete the Image Series.
        // Images are deleted automatically because
        // the Prisma relation has onDelete: Cascade.
        await prismadb.imageSeries.delete({
          where: {
            id,
          },
        });

        return res.status(200).json({
          message: "Image series deleted successfully",
        });
      }

      default:
        return res.status(405).json({
          error: "Method Not Allowed",
        });
    }
  } catch (error) {
    console.error("IMAGE SERIES [ID] API ERROR:", error);

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
