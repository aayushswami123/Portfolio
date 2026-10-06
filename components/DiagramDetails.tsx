import { Figure } from "@/components/Figure";
import { isDiagram } from "@/content/diagrams";

/**
 * A diagram tucked behind a disclosure, for places where it is supporting
 * detail rather than the point (the experience rows). Uses <details> so it
 * works with no JavaScript and reads correctly to a screen reader.
 */
export function DiagramDetails({
  name,
  label,
  figure,
}: {
  name: string;
  label: string;
  figure: number;
}) {
  if (!isDiagram(name)) return null;
  return (
    <details className="group mt-3">
      <summary className="link inline-flex cursor-pointer list-none text-sm [&::-webkit-details-marker]:hidden">
        <span className="group-open:hidden">{label}</span>
        <span className="hidden group-open:inline">Hide diagram</span>
      </summary>
      <div className="mt-4 max-w-[760px]">
        <Figure
          media={{ kind: "diagram", name }}
          number={figure}
          title={name}
          caption=""
          uid={`fig-details-${name}`}
        />
      </div>
    </details>
  );
}
