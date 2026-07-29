import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== "GET") {
      return res.status(405).end();
    }

    const { currentUser } = await serverAuth(req, res);

    const moviesCount = await prismadb.movie.count({
      where: {
        userId: currentUser.id,
      },
    });

    if (moviesCount === 0) {
      return res.status(404).json({
        message: "No movies found for this user.",
      });
    }

    const randomIndex = Math.floor(Math.random() * moviesCount);

    const randomMovies = await prismadb.movie.findMany({
      where: {
        userId: currentUser.id,
      },
      take: 1,
      skip: randomIndex,
    });

    return res.status(200).json(randomMovies[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).end();
  }
}
