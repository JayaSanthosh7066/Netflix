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
    const { seriesId } = req.query;

    if (typeof seriesId !== "string") {
      return res.status(400).json({
        error: "Invalid Series Id",
      });
    }

    if (req.method === "GET") {
      const series = await prismadb.series.findUnique({
        where: {
          id: seriesId,
        },
        include: {
          episodes: {
            orderBy: {
              episodeNumber: "asc",
            },
          },
        },
      });

      if (!series) {
        return res.status(404).json({
          error: "Series not found",
        });
      }

      return res.status(200).json(series);
    }

    if (req.method === "DELETE") {
      const series = await prismadb.series.findUnique({
        where: {
          id: seriesId,
        },
        include: {
          episodes: true,
        },
      });

      if (!series) {
        return res.status(404).json({
          error: "Series not found",
        });
      }

      // Verify ownership
      if (series.userId !== currentUser.id) {
        return res.status(403).json({
          error: "Unauthorized",
        });
      }

      // ============================
      // Delete Episode Files
      // ============================

      for (const episode of series.episodes) {
        await deleteFileFromS3(episode.thumbnailUrl);
        await deleteFileFromS3(episode.videoUrl);
      }

      // ============================
      // Delete Series Files
      // ============================

      await deleteFileFromS3(series.thumbnailUrl);

      if (series.bannerUrl) {
        await deleteFileFromS3(series.bannerUrl);
      }

      // ============================
      // Delete Episodes from MongoDB
      // ============================

      await prismadb.episode.deleteMany({
        where: {
          seriesId,
        },
      });

      // ============================
      // Delete Series
      // ============================

      await prismadb.series.delete({
        where: {
          id: seriesId,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Series deleted successfully.",
      });
    }
    return res.status(405).end();
  } catch (error) {
    console.log(error);

    return res.status(500).end();
  }
}
