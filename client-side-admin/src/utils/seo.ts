type SeoMetadata = {
  title: string;
  description: string;
};

export function setSeoMetadata({ title, description }: SeoMetadata) {
  document.title = title;

  updateMetaTag("name", "description", description);
  updateMetaTag("name", "application-name", "Lessora AI");
  updateMetaTag("name", "robots", "index, follow");
  updateMetaTag("property", "og:title", title);
  updateMetaTag("property", "og:description", description);
}

function updateMetaTag(
  attribute: "name" | "property",
  value: string,
  content: string,
) {
  const selector = `meta[${attribute}="${value}"]`;
  const metaTag = document.head.querySelector<HTMLMetaElement>(selector);

  if (metaTag) {
    metaTag.content = content;
    return;
  }

  const createdMetaTag = document.createElement("meta");
  createdMetaTag.setAttribute(attribute, value);
  createdMetaTag.content = content;
  document.head.appendChild(createdMetaTag);
}
