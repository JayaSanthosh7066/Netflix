import React from "react";
import { isEmpty } from "lodash";

import { ImageSeriesInterface } from "@/types";
import ImageSeriesCard from "@/components/image-series/ImageSeriesCard";

interface ImageSeriesListProps {
  data: ImageSeriesInterface[];
  title: string;
}

const ImageSeriesList: React.FC<ImageSeriesListProps> = ({ data, title }) => {
  console.log("IMAGE SERIES LIST DATA:", data);

  if (isEmpty(data)) return null;

  return (
    <section className="mb-12">
      <div className="px-5 md:px-10 lg:px-14">
        <h2 className="text-white text-2xl md:text-3xl font-bold mb-5">
          {title}
        </h2>

        <div
          className="
            flex
            gap-4
            overflow-x-auto
            pb-5
            scrollbar-hide
            snap-x
            snap-mandatory
          "
        >
          {data.map((imageSeries) => (
            <div
              key={imageSeries.id}
              className="
                flex-none
                w-[130px]
                sm:w-[150px]
                md:w-[180px]
                lg:w-[215px]
                snap-start
              "
            >
              <ImageSeriesCard data={imageSeries} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageSeriesList;
