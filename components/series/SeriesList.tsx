import React from "react";
import { isEmpty } from "lodash";

import { SeriesInterface } from "@/types";
import SeriesCard from "@/components/series/SeriesCard";

interface SeriesListProps {
  data: SeriesInterface[];
  title: string;
}

const SeriesList: React.FC<SeriesListProps> = ({ data, title }) => {
  if (isEmpty(data)) {
    return null;
  }

  return (
    <div className="px-4 md:px-12 mt-4 space-y-8">
      <div>
        <p className="text-white text-md md:text-xl lg:text-2xl font-semibold mb-4">
          {title}
        </p>

        <div className="grid grid-cols-4 gap-2">
          {data.map((series) => (
            <SeriesCard key={series.id} data={series} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeriesList;
