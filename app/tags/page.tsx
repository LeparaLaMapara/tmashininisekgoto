import { permanentRedirect } from 'next/navigation'

/**
 * The tag index was the topic index for blog posts only. /topics now covers
 * every subject across the projects, research, publications, writing and
 * talks, and every tag with a hub redirects there, so this page redirects too
 * rather than listing a set of redirects.
 */
export default function TagsPage() {
  permanentRedirect('/topics')
}
