import React, { useCallback } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

import PlayButton from "@/components/PlayButton";
import useBillboard from "@/hooks/useBillboard";
import useInfoModalStore from "@/hooks/useInfoModalStore";
import { PlayIcon, PauseIcon } from "@heroicons/react/24/solid";

const Billboard: React.FC = () => {
  const { data } = useBillboard();
  const { openModal } = useInfoModalStore();

  const handleOpenModal = useCallback(() => {
    openModal(data?.id);
  }, [openModal, data?.id]);

  return (
    <section
      className="
        relative
        w-full
        h-[68vh]
        min-h-[560px]
        sm:h-[70vh]
        md:h-[72vh]
        lg:h-[76vh]
        overflow-hidden
        bg-[#090909]
      "
    >
      {/* ================= BACKGROUND VIDEO ================= */}

      <video
        poster={data?.thumbnailUrl}
        src={data?.videoUrl}
        autoPlay
        muted
        loop
        playsInline
        className="
          absolute
          inset-0
          w-full
          h-full
          object-cover
          brightness-[58%]
          scale-[1.03]
        "
      />

      {/* ================= LEFT GRADIENT ================= */}

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-black/90
          via-black/40
          via-40%
          to-transparent
        "
      />

      {/* ================= TOP GRADIENT ================= */}

      <div
        className="
          absolute
          inset-x-0
          top-0
          h-40
          sm:h-48
          bg-gradient-to-b
          from-black/50
          to-transparent
        "
      />

      {/* ================= BOTTOM FADE ================= */}

      <div
        className="
          absolute
          inset-x-0
          bottom-0
          h-[45%]
          sm:h-[42%]
          md:h-[40%]
          bg-gradient-to-t
          from-[#090909]
          via-[#090909]/1
          via-[#090909]/1
          to-transparent
        "
      />

      {/* ================= CONTENT ================= */}

      <div
        className="
          relative
          z-20
          flex
          items-end
          w-full
          h-full
          pb-[12%]
          sm:pb-[11%]
          md:pb-[9%]
          lg:pb-[7%]
        "
      >
        <div
          className="
            w-full
            max-w-[760px]
            px-6
            sm:px-8
            md:px-12
            lg:px-16
            xl:px-20
          "
        >
          {/* ================= TITLE ================= */}

          <h1
            className="
              font-bold
              text-white
              mb-3
              sm:mb-4
              whitespace-nowrap
              leading-none
              drop-shadow-2xl
            "
            style={{
              fontSize: "clamp(1.5rem, 3vw, 3.5rem)",
            }}
          >
            {data?.title}
          </h1>

          {/* ================= META INFORMATION ================= */}

          <div
            className="
              flex
              items-center
              flex-wrap
              gap-x-3
              gap-y-2
              mb-4
              sm:mb-5
            "
          >
            <span
              className="
                text-green-400
                font-bold
                text-base
                sm:text-lg
                md:text-xl
              "
            >
              98% Match
            </span>

            <span
              className="
                text-zinc-300
                text-sm
                sm:text-base
                md:text-lg
              "
            >
              2026
            </span>

            <span
              className="
                border
                border-zinc-500
                text-zinc-300
                px-2
                py-0.5
                text-xs
                sm:text-sm
                md:text-base
              "
            >
              UA 16+
            </span>

            <span
              className="
                text-zinc-300
                text-sm
                sm:text-base
                md:text-lg
              "
            >
              1 Season
            </span>
          </div>

          {/* ================= TRENDING ================= */}

          <div
            className="
              flex
              items-center
              gap-3
              sm:gap-4
              mb-4
              sm:mb-5
            "
          >
            <span
              className="
                bg-red-600
                text-white
                px-2
                py-1
                rounded
                text-[10px]
                sm:text-xs
                font-bold
                shrink-0
              "
            >
              TOP 10
            </span>

            <span
              className="
                text-white
                font-bold
                text-base
                sm:text-xl
                md:text-2xl
              "
            >
              #1 in Trending Today
            </span>
          </div>

          {/* ================= DESCRIPTION ================= */}

          <p
            className="
              max-w-[620px]
              text-zinc-300
              text-sm
              sm:text-base
              md:text-lg
              leading-6
              sm:leading-7
              md:leading-8
              mb-5
              sm:mb-6
            "
          >
            {data?.description}
          </p>

          {/* ================= BUTTONS ================= */}

          <div
            className="
              flex
              items-center
              gap-3
              sm:gap-4
            "
          >
            {/* Play */}

            <button
              onClick={() => {
                if (data?.id) {
                  window.location.href = `/watch/${data.id}`;
                }
              }}
              className="
                flex
                items-center
                justify-center
                gap-2
                bg-white
                text-black
                font-semibold

                h-10
                px-4
                rounded-md
                text-sm

                sm:h-11
                sm:px-5
                sm:text-base

                md:h-12
                md:px-6
                md:text-lg

                hover:bg-neutral-300
                transition
                shrink-0
              "
            >
              <span className="text-base sm:text-lg md:text-xl">
                <PlayIcon className="w-5 h-5 md:w-8 md:h-8 " />
              </span>
              Play
            </button>

            {/* More Info */}

            <button
              onClick={handleOpenModal}
              className="
                flex
                items-center
                justify-center
                gap-2

                h-10
                px-4
                rounded-md

                bg-white/20
                backdrop-blur-md

                text-white
                font-semibold
                text-sm

                sm:h-11
                sm:px-5
                sm:text-base

                md:h-12
                md:px-6
                md:text-lg

                hover:bg-white/30
                transition
                shrink-0
              "
            >
              <InformationCircleIcon
                className="
                  w-5
                  h-5
                  sm:w-5
                  sm:h-5
                  md:w-6
                  md:h-6
                "
              />
              More Info
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Billboard;
