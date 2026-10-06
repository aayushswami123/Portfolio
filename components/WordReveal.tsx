import { Fragment } from "react";

/**
 * Reveals a line word by word, once, on load: 40ms stagger, a slight upward
 * move, about 700ms in total. Pure CSS (`.word-reveal` in globals.css), so the
 * words are real text in the HTML and it costs no JavaScript.
 */
const STAGGER_MS = 40;

export function WordReveal({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <p className={`word-reveal ${className}`}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span style={{ animationDelay: `${index * STAGGER_MS}ms` }}>{word}</span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </p>
  );
}
