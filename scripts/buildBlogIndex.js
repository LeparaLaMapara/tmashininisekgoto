import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, "public/posts");
const OUTPUT = path.join(ROOT, "src/components/Blog/blogIndex.json");

if (!fs.existsSync(POSTS_DIR)) {
  console.error("❌ public/posts directory not found");
  process.exit(1);
}

const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith(".md"));

const posts = files.map(file => {
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
  const { data } = matter(raw);

  if (!data.title || !data.date) {
    throw new Error(`Missing title/date in ${file}`);
  }

  return {
    id: file.replace(".md", ""),
    file,
    title: data.title,
    date: data.date,
    tags: data.tags || [],
    summary: data.summary || ""
  };
});

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, JSON.stringify(posts, null, 2));

console.log(`✓ Generated blogIndex.json (${posts.length} posts)`);
