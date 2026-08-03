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

    const { movieId } = req.query;

    if (typeof movieId !== "string") {
      return res.status(400).json({
        error: "Invalid Movie Id",
      });
    }

    // ==========================
    // GET Movie
    // ==========================
    if (req.method === "GET") {
      const movie = await prismadb.movie.findFirst({
        where: {
          id: movieId,
          userId: currentUser.id,
        },
      });

      if (!movie) {
        return res.status(404).json({
          error: "Movie not found",
        });
      }

      return res.status(200).json(movie);
    }

    // ==========================
    // PATCH Movie
    // ==========================
    if (req.method === "PATCH") {
      const { title, description, genre, duration, thumbnailUrl, videoUrl } =
        req.body;

      const existingMovie = await prismadb.movie.findFirst({
        where: {
          id: movieId,
          userId: currentUser.id,
        },
      });

      if (!existingMovie) {
        return res.status(404).json({
          error: "Movie not found",
        });
      }

      // Delete old thumbnail if changed
      if (thumbnailUrl && thumbnailUrl !== existingMovie.thumbnailUrl) {
        await deleteFileFromS3(existingMovie.thumbnailUrl);
      }

      // Delete old video if changed
      if (videoUrl && videoUrl !== existingMovie.videoUrl) {
        await deleteFileFromS3(existingMovie.videoUrl);
      }

      const updatedMovie = await prismadb.movie.update({
        where: {
          id: movieId,
        },
        data: {
          title: title.trim(),
          description: description.trim(),
          genre: genre.trim(),
          duration: duration.trim(),
          thumbnailUrl,
          videoUrl,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Movie updated successfully.",
        movie: updatedMovie,
      });
    }

    // ==========================
    // DELETE Movie
    // ==========================
    if (req.method === "DELETE") {
      const movie = await prismadb.movie.findFirst({
        where: {
          id: movieId,
          userId: currentUser.id,
        },
      });

      if (!movie) {
        return res.status(404).json({
          error: "Movie not found",
        });
      }

      // Delete thumbnail from S3
      await deleteFileFromS3(movie.thumbnailUrl);

      // Delete video from S3
      await deleteFileFromS3(movie.videoUrl);

      // Delete movie from MongoDB
      await prismadb.movie.delete({
        where: {
          id: movieId,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Movie deleted successfully.",
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
