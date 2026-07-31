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
      case "GET": {
        const series = await prismadb.series.findMany({
          where: {
            userId: currentUser.id,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        return res.status(200).json(series);
      }

      case "POST": {
        const { title, description, genre, thumbnailUrl, bannerUrl } = req.body;

        if (!title || !description || !genre || !thumbnailUrl) {
          return res.status(400).json({
            error: "Missing required fields",
          });
        }

        const series = await prismadb.series.create({
          data: {
            title,
            description,
            genre,
            thumbnailUrl,
            bannerUrl,
            userId: currentUser.id,
          },
        });

        return res.status(201).json(series);
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
