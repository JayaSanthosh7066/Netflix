import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    await serverAuth(req, res);

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

    return res.status(405).end();
  } catch (error) {
    console.log(error);

    return res.status(500).end();
  }
}
