import React, { useEffect, useMemo, useState } from "react";
import { Container } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";

import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";

import blogIndex from "./blogIndex.json";
import "./blog.css";

/**
 * Calculate reading time based on 200 wpm.
 */
function calculateReadingTime(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

/**
 * Extract headings for Table of Contents.
 * Supports:
 *  - ## Heading
 *  - ### Subheading
 */
function extractHeadings(markdown) {
  return markdown
    .split("\n")
    .filter((line) => /^##+\s/.test(line)) // "## " or "### "
    .map((line) => {
      const hashes = line.match(/^##+/)?.[0] || "##";
      const level = hashes.length; // 2 or 3 etc.
      const text = line.replace(/^##+\s/, "").trim();

      return {
        text,
        level,
        id: slugify(text),
      };
    });
}

/**
 * Turn any heading into a URL-friendly id.
 */
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove punctuation
    .replace(/\s+/g, "-");
}

/**
 * Remove YAML frontmatter:
 * ---
 * title: ...
 * date: ...
 * ---
 */
function stripFrontmatter(mdText) {
  return mdText.replace(/---[\s\S]*?---/, "").trim();
}

function BlogPost() {
  const { id } = useParams();

  const [content, setContent] = useState("");
  const [postMeta, setPostMeta] = useState(null);
  const [readingTime, setReadingTime] = useState("");
  const [toc, setToc] = useState([]);

  // Find metadata from index (stable)
  const meta = useMemo(() => {
    return (blogIndex || []).find((p) => p.id === id) || null;
  }, [id]);

  useEffect(() => {
    if (!meta) {
      setPostMeta(null);
      setContent("");
      setReadingTime("");
      setToc([]);
      return;
    }

    setPostMeta(meta);

    /**
     * IMPORTANT:
     * Markdown files must be inside:
     *   public/posts/
     *
     * Then fetch via:
     *   /posts/<filename>.md
     */
    fetch(`/posts/${meta.file}`)
      .then((res) => {
        if (!res.ok) throw new Error("Markdown not found");
        return res.text();
      })
      .then((text) => {
        const cleaned = stripFrontmatter(text);

        setContent(cleaned);
        setReadingTime(calculateReadingTime(cleaned));
        setToc(extractHeadings(cleaned));
      })
      .catch(() => {
        setContent("");
      });
  }, [meta]);

  if (!postMeta) {
    return (
      <Container className="blog-page">
        <div className="blog-post">
          <p>Post not found.</p>
          <Link to="/blog">← Back to blog</Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="blog-page">
      <article className="blog-post">
        <Link to="/blog" className="blog-back">
          ← Back to blog
        </Link>

        <h1 className="blog-post-title">{postMeta.title}</h1>

        <div className="blog-meta">
          <span>{formatLongDate(postMeta.date)}</span>
          <span className="dot">•</span>
          <span>{readingTime}</span>
        </div>

        {/* Tags (safe) */}
        {Array.isArray(postMeta.tags) && postMeta.tags.length > 0 && (
            <div className="blog-tags">
              {postMeta.tags.map((t) => {
                const safeTag = String(t).trim().toLowerCase();
                return (
                  <Link key={safeTag} to={`/tags/${safeTag}`} className="blog-tag">
                    #{safeTag}
                  </Link>
                );
              })}
          </div>
        )}

        {/* TOC */}
        {toc.length > 0 && (
          <nav className="blog-toc">
            <div className="blog-toc-title">Contents</div>
            <ul>
              {toc.map((item) => (
                <li
                  key={item.id}
                  className={`toc-level-${item.level}`}
                >
                  <a href={`#${item.id}`}>{item.text}</a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Markdown */}
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeHighlight]}
          components={{
            /**
             * Add ids to headings so TOC anchor links work.
             * We do both h2 and h3 to match our extractHeadings().
             */
            h2({ children }) {
              const text = String(children);
              return <h2 id={slugify(text)}>{children}</h2>;
            },
            h3({ children }) {
              const text = String(children);
              return <h3 id={slugify(text)}>{children}</h3>;
            },

            /**
             * Custom renderer for code blocks:
             * - Language label in top-left via data-lang
             * - Copy button top-right
             * - Prevents "[object Object]" copying
             */
            code({ inline, className, children, ...props }) {
              if (inline) {
                return (
                  <code className={`inline-code ${className || ""}`} {...props}>
                    {children}
                  </code>
                );
              }

              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "";

              // IMPORTANT:
              // String(children) safely becomes plain text even after highlight transforms.
              const codeText = String(children).replace(/\n$/, "");

              return (
                <div className="code-block" data-lang={language}>
                  <button
                    className="copy-btn"
                    onClick={() => navigator.clipboard.writeText(codeText)}
                    type="button"
                  >
                    Copy
                  </button>

                  <pre className="code-pre">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                </div>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </Container>
  );
}

function formatLongDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;

  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
}

export default BlogPost;
