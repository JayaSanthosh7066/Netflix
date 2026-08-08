import Link from "next/link";

interface MemoryCardProps {
  id: string;
  title: string;
  image: string;
  subtitle?: string;
  badge?: string;
  href: string;
}

const MemoryCard: React.FC<MemoryCardProps> = ({
  title,
  image,
  subtitle,
  badge,
  href,
}) => {
  return (
    <Link href={href}>
      <div
        className="
          group
          relative
          overflow-hidden
          rounded-3xl
          aspect-[3/4]
          cursor-pointer
          bg-zinc-900
          shadow-xl
          transition-all
          duration-500
          hover:-translate-y-2
          hover:shadow-2xl
        "
      >
        <img
          src={image}
          alt={title}
          draggable={false}
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-700
            group-hover:scale-110
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black
            via-black/40
            to-transparent
          "
        />

        <div className="absolute bottom-0 left-0 p-5 w-full">
          {badge && (
            <span
              className="
                inline-block
                mb-3
                rounded-full
                bg-white/15
                backdrop-blur-md
                px-3
                py-1
                text-xs
                text-white
              "
            >
              {badge}
            </span>
          )}

          <h2
            className="
              text-white
              text-xl
              font-bold
              leading-tight
            "
          >
            {title}
          </h2>

          {subtitle && <p className="text-zinc-300 mt-1 text-sm">{subtitle}</p>}
        </div>
      </div>
    </Link>
  );
};

export default MemoryCard;
