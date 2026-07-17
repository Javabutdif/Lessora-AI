type SeoMetadata = {
  title: string;
  description: string;
  robots?: string;
};

const DOMAIN = "https://lessora-ai.ajgenabio.me";

export function setSeoMetadata({ title, description, robots = "index, follow" }: SeoMetadata) {
  document.title = title;

  updateMetaTag("name", "description", description);
  updateMetaTag("name", "robots", robots);
  updateMetaTag("property", "og:title", title);
  updateMetaTag("property", "og:description", description);
  updateMetaTag("name", "twitter:card", "summary");
  updateMetaTag("name", "twitter:title", title);
  updateMetaTag("name", "twitter:description", description);

  setCanonical();
}

function setCanonical() {
  const selector = 'link[rel="canonical"]';
  let link = document.head.querySelector<HTMLLinkElement>(selector);
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = `${DOMAIN}${window.location.pathname}`;
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
