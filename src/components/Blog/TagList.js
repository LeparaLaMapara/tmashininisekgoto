import React, { useMemo } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import blogIndex from "./blogIndex.json";
import "./blog.css";

function normalizeTag(tag) {
  return String(tag || "").trim().toLowerCase();
}

function TagList() {
  const tags = useMemo(() => {
    const counts = (blogIndex || []).reduce((acc, post) => {
      const uniqueTags = new Set((post.tags || []).map(normalizeTag).filter(Boolean));

      uniqueTags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });

      return acc;
    }, {});

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([name, count]) => ({ name, count }));
  }, []);

  return (
    <Container className="blog-page">
      <div className="blog-nav">
        <Link to="/blog" className="tag-pill">
          ← Back to blog
        </Link>
      </div>

      <h1 className="blog-page-title">Browse Tags</h1>
      <p className="blog-page-subtitle">
        Explore posts by topic.
      </p>

      {tags.length === 0 ? (
        <p className="blog-page-subtitle">No tags available yet.</p>
      ) : (
        <div className="tag-cloud">
          {tags.map((tag) => (
            <Link key={tag.name} to={`/tags/${tag.name}`} className="tag-pill">
              #{tag.name} <span className="tag-count">({tag.count})</span>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}

export default TagList;
