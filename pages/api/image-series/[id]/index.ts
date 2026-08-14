import type { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/libs/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({
        error: "Method Not Allowed",
      });
    }

    const { id } = req.query;

    if (typeof id !== "string") {
      return res.status(400).json({
        error: "Invalid image series ID",
      });
    }

    const imageSeries = await prismadb.imageSeries.findUnique({
      where: {
        id,
      },
      include: {
        images: {
          orderBy: {
            imageNumber: "asc",
          },
        },
      },
    });

    if (!imageSeries) {
      return res.status(404).json({
        error: "Image series not found",
      });
    }

    return res.status(200).json(imageSeries);
  } catch (error) {
    console.error("IMAGE SERIES DETAILS API ERROR:", error);

    return res.status(500).json({
      error: "Failed to fetch image series",
    });
  }
}
