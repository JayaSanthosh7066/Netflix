import axios from "axios";
import React, { useCallback, useMemo } from "react";
import { PlusIcon, CheckIcon } from "@heroicons/react/24/outline";

import useCurrentUser from "@/hooks/useCurrentUser";
import useFavorites from "@/hooks/useFavorites";

interface SeriesFavoriteButtonProps {
  seriesId: string;
}

const SeriesFavoriteButton: React.FC<SeriesFavoriteButtonProps> = ({
  seriesId,
}) => {
  const { mutate: mutateFavorites } = useFavorites();

  const { data: currentUser, mutate } = useCurrentUser();

  const isFavorite = useMemo(() => {
    const list = currentUser?.favoriteSeriesIds || [];

    return list.includes(seriesId);
  }, [currentUser, seriesId]);

  const toggleFavorites = useCallback(async () => {
    let response;

    if (isFavorite) {
      response = await axios.delete("/api/favoriteSeries", {
        data: { seriesId },
      });
    } else {
      response = await axios.post("/api/favoriteSeries", { seriesId });
    }

    const updatedFavoriteSeriesIds = response?.data?.favoriteSeriesIds;

    mutate({
      ...currentUser,
      favoriteSeriesIds: updatedFavoriteSeriesIds,
    });
    mutateFavorites();
  }, [seriesId, isFavorite, currentUser, mutate, mutateFavorites]);

  const Icon = isFavorite ? CheckIcon : PlusIcon;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorites();
      }}
      className="cursor-pointer group/item w-6 h-6 lg:w-10 lg:h-10 border-white border-2 rounded-full flex justify-center items-center transition hover:border-neutral-300"
    >
      <Icon className="text-white group-hover/item:text-neutral-300 w-4 lg:w-6" />
    </div>
  );
};

export default SeriesFavoriteButton;
