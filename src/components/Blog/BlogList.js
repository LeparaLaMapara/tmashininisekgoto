import React, { useMemo } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import blogIndex from "./blogIndex.json";
import "./blog.css";

/**
 * BlogList
 * --------
 * Renders an archive page grouped by year:
 * 2024
 *   Post title .................................. Oct 10
 * 2021
 *   ...
 */
function BlogList() {
  /**
   * Normalize + group posts by year.
   * - If year missing, infer from date.
   * - Sort posts newest first.
   */
  const { sortedYears, postsByYear } = useMemo(() => {
    const normalized = (blogIndex || []).map((p) => {
      const year = p.year || (p.date ? new Date(p.date).getFullYear() : "Unknown");
      return { ...p, year };
    });

    // Sort newest first by date (fallback: title)
    normalized.sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    });

    // Group
    const grouped = normalized.reduce((acc, post) => {
      acc[post.year] = acc[post.year] || [];
      acc[post.year].push(post);
      return acc;
    }, {});

    // Sort years desc (numeric where possible)
    const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

    return { sortedYears: years, postsByYear: grouped };
  }, []);

 return (
  <Container className="blog-page">

    {/* Top navigation */}
    <div className="blog-tags-header" style={{ marginBottom: "1.5rem" }}>
      <Link to="/tags" className="tag-pill">
        Browse Tags →
      </Link>
    </div>


    {/* Archive grouped by year */}
    <div className="blog-archive">
      {sortedYears.map((year) => (
        <section key={year} className="blog-year-section">
          <h2 className="blog-year">{year}</h2>

          <ul className="blog-list">
            {postsByYear[year].map((post) => (
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
        </section>
      ))}
    </div>
  </Container>
);

}

/**
 * Formats date like: "Oct 10"
 * Keeps your archive looking clean.
 */
function formatShortDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  // Avoid invalid dates
  if (Number.isNaN(d.getTime())) return dateStr;

  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
  });
}

export default BlogList;
