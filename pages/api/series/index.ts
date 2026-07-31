import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { currentUser } = await serverAuth(req, res);

    // ---------------- GET ----------------
    if (req.method === "GET") {
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

    // ---------------- POST ----------------
    if (req.method === "POST") {
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

      return res.status(200).json(series);
    }

    return res.status(405).end();
  } catch (error) {
    console.log(error);
    return res.status(500).end();
  }
}
