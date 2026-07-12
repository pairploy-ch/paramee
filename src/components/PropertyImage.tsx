import Image from "next/image";

export default function PropertyImage({
  images,
  name,
  index = 0,
  className = "",
  sizes = "(min-width: 1024px) 480px, 100vw",
  priority = false,
}: {
  images: string[];
  name: string;
  index?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const src = images[index] ?? images[0];

  return (
    <div className={`relative overflow-hidden bg-cream-dark ${className}`}>
      <Image
        src={src}
        alt={name}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
