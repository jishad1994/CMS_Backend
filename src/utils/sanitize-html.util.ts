import sanitizeHtml from "sanitize-html";

export const sanitizeArticleHtml = (html: string): string => {
  return sanitizeHtml(html, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "s",
      "h1",
      "h2",
      "h3",
      "h4",
      "blockquote",
      "ul",
      "ol",
      "li",
      "a",
      "img"
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt"]
    },
    allowedSchemes: ["http", "https", "mailto"]
  });
};