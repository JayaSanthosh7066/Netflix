import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { currentUser } = await serverAuth(req, res);

    switch (req.method) {
      case "POST": {
        const {
          title,
          description,
          videoUrl,
          thumbnailUrl,
          duration,
          episodeNumber,
          seriesId,
          showOnHome,
        } = req.body;

        if (
          !title?.trim() ||
          !description?.trim() ||
          !videoUrl ||
          !thumbnailUrl ||
          !duration?.trim() ||
          episodeNumber === undefined ||
          !seriesId
        ) {
          return res.status(400).json({
            error: "Missing required fields",
          });
        }

        const episodeNo = Number(episodeNumber);

        if (Number.isNaN(episodeNo) || episodeNo <= 0) {
          return res.status(400).json({
            error: "Invalid episode number",
          });
        }

        const series = await prismadb.series.findUnique({
          where: {
            id: seriesId,
          },
        });

        if (!series) {
          return res.status(404).json({
            error: "Series not found",
          });
        }

        if (series.userId !== currentUser.id) {
          return res.status(403).json({
            error: "Unauthorized",
          });
        }

        const existingEpisode = await prismadb.episode.findFirst({
          where: {
            seriesId,
            episodeNumber: episodeNo,
          },
        });

        if (existingEpisode) {
          return res.status(400).json({
            error: "Episode number already exists",
          });
        }

        const episode = await prismadb.episode.create({
          data: {
            title: title.trim(),
            description: description.trim(),
            videoUrl,
            thumbnailUrl,
            duration: duration.trim(),
            episodeNumber: episodeNo,
            showOnHome: showOnHome ?? false,
            seriesId,
          },
        });

        return res.status(201).json({
          success: true,
          message: "Episode created successfully",
          episode,
        });
      }

      default:
        return res.status(405).json({
          error: "Method Not Allowed",
        });
    }
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
