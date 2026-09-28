import { Flowchart, flowchartDescription, isFlowchart } from "@/components/Flowchart";

/**
 * A diagram tucked behind a disclosure, for places where it is supporting
 * detail rather than the point: the experience row and the compact project
 * list. Uses <details> so it works with no JavaScript and reads correctly to
 * a screen reader.
 */
export function DiagramDetails({ name, label }: { name: string; label: string }) {
  if (!isFlowchart(name)) return null;
  return (
    <details className="group mt-3">
      <summary className="inline-flex cursor-pointer list-none text-sm text-cobalt underline decoration-cobalt/30 underline-offset-[3px] hover:decoration-cobalt">
        <span className="group-open:hidden">{label}</span>
        <span className="hidden group-open:inline">Hide diagram</span>
      </summary>
      <div className="mt-3">
        <Flowchart name={name} caption={flowchartDescription(name)} />
      </div>
    </details>
  );
}
