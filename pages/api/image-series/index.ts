import type { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { currentUser } = await serverAuth(req, res);

    // =====================================================
    // GET ALL IMAGE SERIES
    // =====================================================

    if (req.method === "GET") {
      const imageSeries = await prismadb.imageSeries.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          images: {
            orderBy: {
              imageNumber: "asc",
            },
          },
          _count: {
            select: {
              images: true,
            },
          },
        },
      });

      return res.status(200).json(imageSeries);
    }

    // =====================================================
    // CREATE IMAGE SERIES
    // =====================================================

    if (req.method === "POST") {
      const { title, description } = req.body;

      if (!title?.trim() || !description?.trim()) {
        return res.status(400).json({
          error: "Title and description are required",
        });
      }

      const imageSeries = await prismadb.imageSeries.create({
        data: {
          title: title.trim(),
          description: description.trim(),

          // First uploaded image will become the cover.
          thumbnailUrl: null,

          userId: currentUser.id,
        },
      });

      return res.status(201).json(imageSeries);
    }

    // =====================================================
    // METHOD NOT ALLOWED
    // =====================================================

    return res.status(405).json({
      error: "Method Not Allowed",
    });
  } catch (error) {
    console.error("IMAGE SERIES API ERROR:", error);

    return res.status(500).json({
      error: "Failed to process image series request",
    });
  }
}
