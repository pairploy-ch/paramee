import Image from "next/image";

export default function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1779464433263-35e2c02d1cc8?fm=jpg&q=80&w=2400&auto=format&fit=crop&ixlib=rb-4.1.0"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* brand-tinted overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-maroon-dark/85 via-maroon/75 to-maroon-dark/90" />
      <div className="absolute inset-0 [background:radial-gradient(circle_at_75%_20%,rgba(218,198,173,0.2)_0%,transparent_45%)]" />
    </div>
  );
}
