import { Figure } from "@/components/Figure";
import { LinkList } from "@/components/LinkList";
import { present, type HackathonItem } from "@/content/types";
import type { Media } from "@/lib/media";

/**
 * A compact hackathon panel: event and date, project name, award badge,
 * a two-line description, stack, links, then media if there is any.
 */
export function HackathonCard({
  item,
  media,
  figure,
}: {
  item: HackathonItem;
  media: Media | null;
  figure: number | null;
}) {
  const links = present(item.links);
  const stack = present(item.stack);
  const built = item.teammate ? `${item.built} Built in one day with ${item.teammate}.` : item.built;

  return (
    <article className="panel flex min-w-0 flex-col">
      <p className="text-sm text-graphite">
        {item.event} · {item.date}
      </p>
      <h3 className="mt-2 text-lg font-semibold tracking-[-0.01em]">{item.title}</h3>
      {item.award ? (
        <p className="mt-2">
          <span className="badge">{item.award}</span>
        </p>
      ) : null}

      <p className="mt-3 max-w-measure text-base text-ink">{built}</p>
      {stack.length > 0 ? <p className="mt-3 text-sm text-graphite">{stack.join(", ")}</p> : null}

      {links.length > 0 || item.codePrivate ? (
        <LinkList links={links} className="mt-4">
          {item.codePrivate ? <span className="text-graphite">Code private</span> : null}
        </LinkList>
      ) : null}

      {media && figure !== null ? (
        <div className="mt-6">
          <Figure
            media={media}
            number={figure}
            title={item.title}
            caption={item.mediaCaption}
            uid={`fig-${item.slug}`}
          />
        </div>
      ) : null}
    </article>
  );
}
