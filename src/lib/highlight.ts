// No astro:content imports here: the admin preview runs this in the browser.

export interface TextPart {
  text: string;
  hit: boolean;
}

// Split text into plain and highlighted parts. Parts wrapped in **double asterisks**
// are highlighted; otherwise every occurrence of `fallback` is.
export function highlightParts(text: string, fallback: string): TextPart[] {
  if (text.includes('**')) {
    return text
      .split('**')
      .map((part, index) => ({ text: part, hit: index % 2 === 1 }))
      .filter((part) => part.text);
  }
  const escaped = fallback.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text
    .split(new RegExp(`(${escaped})`, 'g'))
    .filter(Boolean)
    .map((part) => ({ text: part, hit: part === fallback }));
}
