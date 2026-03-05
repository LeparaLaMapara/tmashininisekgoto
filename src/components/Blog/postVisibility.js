export function isPostPublished(dateStr, now = new Date()) {
  if (!dateStr) return true;

  const publishDate = new Date(dateStr);
  if (Number.isNaN(publishDate.getTime())) return true;

  return now.getTime() >= publishDate.getTime();
}

export function getPublishedPosts(posts = [], now = new Date()) {
  return posts.filter((post) => isPostPublished(post.date, now));
}
