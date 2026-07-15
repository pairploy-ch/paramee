import { LineIcon } from "./icons";
import { socialLinks } from "@/lib/social";

export default function LineFloatingButton() {
  return (
    <a
      href={socialLinks.line.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="แชทผ่าน LINE"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#06C755] text-white shadow-lg transition-transform hover:scale-105"
    >
      <LineIcon className="h-7 w-7" />
    </a>
  );
}
