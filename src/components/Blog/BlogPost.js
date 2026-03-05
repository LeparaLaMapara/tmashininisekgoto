import React, { useEffect, useMemo, useState } from "react";
import { Container } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";

import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";

import blogIndex from "./blogIndex.json";
import { isPostPublished } from "./postVisibility";
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
    .filter((line) => /^##\s/.test(line)) // "## " only, not "### "
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

/**
 * Strip markdown syntax to plain readable text for TTS.
 */
function toPlainText(md) {
  return md
    .replace(/```[\s\S]*?```/g, "")         // code blocks
    .replace(/`[^`]+`/g, "")                // inline code
    .replace(/^\s*#{1,6}\s+/gm, "")         // headings
    .replace(/\*\*(.+?)\*\*/g, "$1")        // bold
    .replace(/__(.+?)__/g, "$1")            // bold alt
    .replace(/\*(.+?)\*/g, "$1")            // italic
    .replace(/_(.+?)_/g, "$1")              // italic alt
    .replace(/!\[.*?\]\(.*?\)/g, "")        // images
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")     // links → label only
    .replace(/^[-*+]\s+/gm, "")            // list bullets
    .replace(/^\d+\.\s+/gm, "")            // numbered lists
    .replace(/^>\s*/gm, "")                // blockquotes
    .replace(/^[-*_]{3,}$/gm, "")          // horizontal rules
    .replace(/\n{3,}/g, "\n\n")            // excessive newlines
    .trim();
}

function BlogPost() {
  const { id } = useParams();

  const [content, setContent] = useState("");
  const [postMeta, setPostMeta] = useState(null);
  const [readingTime, setReadingTime] = useState("");
  const [toc, setToc] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Cancel speech when navigating away
  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const handleListen = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const plain = toPlainText(content);
    const utterance = new SpeechSynthesisUtterance(plain);
    utterance.rate = 0.95;
    utterance.lang = "en-US";
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Find metadata from index (stable)
  const meta = useMemo(() => {
    const post = (blogIndex || []).find((p) => p.id === id) || null;
    if (!post || !isPostPublished(post.date)) return null;
    return post;
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
          <span className="dot">•</span>
          <button
            className={`listen-btn${isSpeaking ? " listen-btn--active" : ""}`}
            onClick={handleListen}
            type="button"
            aria-label={isSpeaking ? "Stop listening" : "Listen to post"}
          >
            {isSpeaking ? "⏹ Stop" : "🔊 Listen"}
          </button>
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
          remarkPlugins={[remarkMath, remarkGfm]}
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
        {/* Subscribe block */}
        <section className="blog-subscribe" aria-label="Newsletter signup">
          <h2 className="blog-subscribe-title">Subscribe</h2>

          <p>
            I write occasionally about building real-world AI systems, data
            platforms, and engineering discipline. No spam — unsubscribe
            anytime.
          </p>

          <form
            action="https://buttondown.com/api/emails/embed-subscribe/thabangvisionstudios"
            method="post"
            target="popupwindow"
            onSubmit={() =>
              window.open(
                "https://buttondown.com/refer/thabangvisionstudios",
                "popupwindow"
              )
            }
            className="subscribe-form"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              name="email"
              placeholder="enter your email"
              required
            />
            <button type="submit">Subscribe</button>
          </form>
        </section>

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
