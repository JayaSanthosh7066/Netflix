import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { currentUser } = await serverAuth(req, res);

    const movies = await prismadb.movie.findMany({
      where: {
        userId: currentUser.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    return res.status(200).json(movies);
  } catch (error) {
    console.log(error);
    return res.status(500).end();
  }
}
