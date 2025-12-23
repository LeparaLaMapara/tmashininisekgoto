import React, { useMemo } from "react";
import { Container } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import blogIndex from "./blogIndex.json";
import "./blog.css";

function TagPage() {
  const { tag } = useParams();

  /**
   * Filter posts that contain this tag
   */
  const posts = useMemo(() => {
    return blogIndex.filter(
      (post) => post.tags && post.tags.includes(tag)
    );
  }, [tag]);

  return (
    <Container className="blog-page">
      {/* Back button (pill style) */}
      <div className="blog-nav">
        <Link to="/blog" className="tag-pill">
          ← Back to blog
        </Link>
      </div>

      {/* Tag header */}
      <h1 className="blog-tag-title">#{tag}</h1>
      <p className="blog-subtitle">
        {posts.length} post{posts.length !== 1 && "s"}
      </p>

      {/* Posts list */}
      <ul className="blog-list">
        {posts.map((post) => (
          <li key={post.id} className="blog-list-item">
            <Link to={`/blog/${post.id}`} className="blog-title-link">
              {post.title}
            </Link>
            <span className="blog-date">
              {formatShortDate(post.date)}
            </span>
          </li>
        ))}
      </ul>
    </Container>
  );
}

/**
 * Utility: Format date as "Oct 10"
 */
function formatShortDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;

  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
  });
}

export default TagPage;
