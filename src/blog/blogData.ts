// Vite: import markdown as raw string
const blogFiles = import.meta.glob("./posts/*.md", {
  eager: true,
  as: "raw",
}) as Record<string, string>;

export type Blog = {
  title: string;
  description: string;
  date: string;
  slug: string;
  content: string;
};

function parseFrontmatter(raw: string) {
  const match = raw.match(/---([\s\S]*?)---/);

  if (!match) {
    return { data: {}, content: raw };
  }

  const frontmatter = match[1];
  const content = raw.replace(match[0], "").trim();

  const data: any = {};

  frontmatter.split("\n").forEach((line) => {
    const [key, ...rest] = line.split(":");
    if (!key) return;
    data[key.trim()] = rest.join(":").trim().replace(/^"|"$/g, "");
  });

  return { data, content };
}

export const blogs: Blog[] = Object.entries(blogFiles)
  .map(([_, raw]) => {
    const { data, content } = parseFrontmatter(raw);

    return {
      title: data.title,
      description: data.description,
      date: data.date,
      slug: data.slug,
      content,
    };
  })
  .sort(
    (a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
  );

export function getBlogBySlug(slug: string) {
  return blogs.find((b) => b.slug === slug);
}