import Image from "next/image";
import { logoNote, logos } from "@/content/logos";
import { logoExists } from "@/lib/media";

/**
 * Replaces the proof row. Grayscale logos, 24px tall, a label under each, each
 * a link. An entry renders only once its file is in public/logos/. Qualcomm is
 * text only.
 */
export function LogoStrip() {
  const shown = logos.filter((logo) => logoExists(logo.file));

  return (
    <div>
      <h2 className="sr-only">Where I work and study</h2>
      <ul className="flex flex-wrap items-end gap-x-10 gap-y-6">
        {shown.map((logo) => (
          <li key={logo.name}>
            <a
              href={logo.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-start gap-2 rounded"
            >
              <Image
                src={`/logos/${logo.file}`}
                alt={logo.name}
                width={120}
                height={24}
                className="h-6 w-auto opacity-80 grayscale transition-opacity group-hover:opacity-100"
              />
              <span className="text-xs text-graphite group-hover:text-ink">{logo.label}</span>
            </a>
          </li>
        ))}
        <li className="text-sm text-graphite">{logoNote}</li>
      </ul>
    </div>
  );
}
