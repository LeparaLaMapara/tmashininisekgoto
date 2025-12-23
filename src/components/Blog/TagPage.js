import React, { useMemo } from "react";
import { Container } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import blogIndex from "./blogIndex.json";
import "./blog.css";

/**
 * TagPage
 * -------
 * Renders all posts associated with a given tag.
 * URL: /tags/:tag
 */
function TagPage() {
  const { tag } = useParams();

  /**
   * Filter posts that contain this tag
   */
  const posts = useMemo(() => {
    return blogIndex
      .filter((post) => post.tags?.includes(tag))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [tag]);

  return (
    <Container className="blog-page">
      <Link to="/blog" className="blog-back">
        ← Back to blog
      </Link>

      <h1 className="blog-tag-title">#{tag}</h1>
      <p className="blog-tag-subtitle">
        {posts.length} post{posts.length !== 1 && "s"} tagged with “{tag}”
      </p>

      {posts.length === 0 ? (
        <p>No posts found for this tag.</p>
      ) : (
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
      )}
    </Container>
  );
}

/**
 * Utility: format date like "Oct 10"
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
