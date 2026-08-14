import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";

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

    // Make sure the image series belongs to the logged-in user.
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

    switch (req.method) {
      // GET ALL IMAGES
      case "GET": {
        const images = await prismadb.image.findMany({
          where: {
            imageSeriesId: id,
          },
          orderBy: {
            imageNumber: "asc",
          },
        });

        return res.status(200).json(images);
      }

      // ADD IMAGE
      case "POST": {
        const { title, imageUrl } = req.body;

        if (!imageUrl) {
          return res.status(400).json({
            error: "Image URL is required",
          });
        }

        // Find the next image number.
        const lastImage = await prismadb.image.findFirst({
          where: {
            imageSeriesId: id,
          },
          orderBy: {
            imageNumber: "desc",
          },
        });

        const imageNumber = lastImage ? lastImage.imageNumber + 1 : 1;

        const image = await prismadb.image.create({
          data: {
            title: title || null,
            imageUrl,
            imageNumber,
            imageSeriesId: id,
          },
        });

        // ---------------------------------------------
        // First image automatically becomes the cover
        // ---------------------------------------------
        if (imageNumber === 1) {
          await prismadb.imageSeries.update({
            where: {
              id,
            },
            data: {
              thumbnailUrl: imageUrl,
            },
          });
        }

        return res.status(201).json(image);
      }

      default:
        return res.status(405).json({
          error: "Method Not Allowed",
        });
    }
  } catch (error) {
    console.error("IMAGE SERIES IMAGES API ERROR:", error);

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
