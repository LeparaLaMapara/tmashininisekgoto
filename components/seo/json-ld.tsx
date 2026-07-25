/**
 * Renders a JSON-LD block.
 *
 * `<` is escaped so a stray `</script>` inside any content field cannot break
 * out of the script tag. Accepts a single entity or an array of them.
 */
export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[]
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
