import { NextApiRequest, NextApiResponse } from "next";
import { without } from "lodash";

import prismadb from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "POST") {
      const { currentUser } = await serverAuth(req, res);

      const { seriesId } = req.body;

      const existingSeries = await prismadb.series.findUnique({
        where: {
          id: seriesId,
        },
      });

      if (!existingSeries) {
        throw new Error("Invalid ID");
      }

      const user = await prismadb.user.update({
        where: {
          email: currentUser.email || "",
        },
        data: {
          favoriteSeriesIds: {
            push: seriesId,
          },
        },
      });

      return res.status(200).json(user);
    }

    if (req.method === "DELETE") {
      const { currentUser } = await serverAuth(req, res);

      const { seriesId } = req.body;

      const existingSeries = await prismadb.series.findUnique({
        where: {
          id: seriesId,
        },
      });

      if (!existingSeries) {
        throw new Error("Invalid ID");
      }

      const updatedFavoriteSeriesIds = without(
        currentUser.favoriteSeriesIds,
        seriesId,
      );

      const updatedUser = await prismadb.user.update({
        where: {
          email: currentUser.email || "",
        },
        data: {
          favoriteSeriesIds: updatedFavoriteSeriesIds,
        },
      });

      return res.status(200).json(updatedUser);
    }

    return res.status(405).end();
  } catch (error) {
    console.log(error);

    return res.status(500).end();
  }
}
