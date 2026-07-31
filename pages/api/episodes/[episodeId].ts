import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/libs/s3";

const getS3KeyFromUrl = (url: string) => {
  const bucketUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;

  return url.replace(bucketUrl, "");
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { currentUser } = await serverAuth(req, res);

    const { episodeId } = req.query;

    if (typeof episodeId !== "string") {
      return res.status(400).json({
        error: "Invalid Episode Id",
      });
    }

    // ==========================
    // GET Episode
    // ==========================
    if (req.method === "GET") {
      const episode = await prismadb.episode.findUnique({
        where: {
          id: episodeId,
        },
        include: {
          series: true,
        },
      });

      if (!episode) {
        return res.status(404).json({
          error: "Episode not found",
        });
      }

      // Verify ownership through Series
      if (episode.series.userId !== currentUser.id) {
        return res.status(403).json({
          error: "Unauthorized",
        });
      }

      return res.status(200).json(episode);
    }

    // ==========================
    // PATCH Episode
    // ==========================
    if (req.method === "PATCH") {
      const {
        title,
        description,
        duration,
        thumbnailUrl,
        videoUrl,
        episodeNumber,
        showOnHome,
      } = req.body;

      const existingEpisode = await prismadb.episode.findUnique({
        where: {
          id: episodeId,
        },
        include: {
          series: true,
        },
      });

      if (!existingEpisode) {
        return res.status(404).json({
          error: "Episode not found",
        });
      }

      if (existingEpisode.series.userId !== currentUser.id) {
        return res.status(403).json({
          error: "Unauthorized",
        });
      }

      // Check duplicate episode number (excluding current episode)
      const duplicateEpisode = await prismadb.episode.findFirst({
        where: {
          seriesId: existingEpisode.seriesId,
          episodeNumber: Number(episodeNumber),
          NOT: {
            id: episodeId,
          },
        },
      });

      if (duplicateEpisode) {
        return res.status(400).json({
          error: "Episode number already exists",
        });
      }

      const updatedEpisode = await prismadb.episode.update({
        where: {
          id: episodeId,
        },
        data: {
          title,
          description,
          duration,
          thumbnailUrl,
          videoUrl,
          episodeNumber: Number(episodeNumber),
          showOnHome,
        },
      });

      return res.status(200).json(updatedEpisode);
    }

    if (req.method === "DELETE") {
      const episode = await prismadb.episode.findUnique({
        where: {
          id: episodeId,
        },
        include: {
          series: true,
        },
      });

      if (!episode) {
        return res.status(404).json({
          error: "Episode not found",
        });
      }

      // Verify ownership
      if (episode.series.userId !== currentUser.id) {
        return res.status(403).json({
          error: "Unauthorized",
        });
      }

      // -------------------------
      // Delete Thumbnail from S3
      // -------------------------

      const thumbnailKey = getS3KeyFromUrl(episode.thumbnailUrl);

      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: thumbnailKey,
        }),
      );

      // -------------------------
      // Delete Video from S3
      // -------------------------

      const videoKey = getS3KeyFromUrl(episode.videoUrl);

      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: videoKey,
        }),
      );

      // -------------------------
      // Delete Episode from MongoDB
      // -------------------------

      await prismadb.episode.delete({
        where: {
          id: episodeId,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Episode deleted successfully.",
      });
    }

    return res.status(405).json({
      error: "Method Not Allowed",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
