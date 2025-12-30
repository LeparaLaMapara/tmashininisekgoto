import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "public/posts");
const OUTPUT = path.join(process.cwd(), "src/components/Blog/blogIndex.json");

const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith(".md"));

const posts = files.map(file => {
  const fullPath = path.join(POSTS_DIR, file);
  const raw = fs.readFileSync(fullPath, "utf-8");
  const { data } = matter(raw);

  return {
    id: file.replace(".md", ""),
    file,
    title: data.title,
    date: data.date,
    tags: data.tags || [],
    summary: data.summary || ""
  };
});

fs.writeFileSync(OUTPUT, JSON.stringify(posts, null, 2));
console.log("✓ blogIndex.json generated");
