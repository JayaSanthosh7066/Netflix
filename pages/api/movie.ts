import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).end();
    }

    const { currentUser } = await serverAuth(req, res);

    const { title, description, genre, duration, videoUrl, thumbnailUrl } =
      req.body;

    const movie = await prismadb.movie.create({
      data: {
        title,
        description,
        genre,
        duration,
        videoUrl,
        thumbnailUrl,
        userId: currentUser.id,
      },
    });

    return res.status(200).json(movie);
  } catch (error) {
    console.log(error);
    return res.status(500).end();
  }
}
