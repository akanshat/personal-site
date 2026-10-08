import { Fragment } from 'react';

/**
 * Copy in lib/ marks its key words with **double asterisks**; this renders them
 * as <mark>, which the stylesheet underlines in pencil.
 */
export function Marked({ text }: { text: string }) {
  return text
    .split(/\*\*(.+?)\*\*/g)
    .map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : <Fragment key={i}>{part}</Fragment>));
}

/** The same copy with the markers removed, for metadata and alt text. */
export function plain(text: string) {
  return text.replace(/\*\*(.+?)\*\*/g, '$1');
}
