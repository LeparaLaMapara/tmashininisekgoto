# Diagram prompts for the ThabangVision system design series

Prompts for generating the diagrams that go into the seven part series. Written
for Gemini image generation, with a fallback route for the text heavy ones.

---

## Before you start: four facts about how this site renders images

**Size.** `MdxImage` renders through `next/image` at a fixed 800 by 450, so
everything is 16:9. Generate at 1600x900 and let it downscale. Anything taller
gets letterboxed.

**Mobile.** Your Playwright suite tests at 393 pixels wide. A diagram with
twelve boxes is unreadable there. Six or seven labelled elements is the ceiling,
and fewer is better.

**No captions.** `MdxImage` accepts `src` and `alt` and drops everything else,
so a diagram has to be self explanatory. Put the explanation in the paragraph
above it.

**Both themes.** Images do not adapt. Your code blocks are hardcoded to the warm
dark ground in light mode and dark mode alike, so a diagram on that same ground
reads as part of the system in both. That is the recommendation below.

Files go in `public/posts/` as PNG, named in snake_case, and are referenced with
plain markdown:

```
![The six layers of the ThabangVision stack](/posts/system_map_layers.png)
```

Write a real alt description each time. The existing posts reuse one alt string
across every image, which is an accessibility defect worth not copying.

---

## The one honest caveat

**Image models are unreliable at rendering text**, and a labelled technical
diagram is the hardest case for them. Expect misspelled labels, duplicated
words, and letters that look right at a glance and are wrong on inspection.

Two ways to deal with it.

**For the simple diagrams**, use the image prompts below, generate three or four
variations, and pick the one whose text is clean. Keep labels to one or two
words so there is less to get wrong.

**For anything with more than about six labels**, do not generate an image. Ask
Gemini for code instead:

> Produce a single self contained HTML file with inline CSS that draws the
> following diagram. Use flat shapes, no images, no external fonts, no
> JavaScript. Canvas exactly 1600 by 900 pixels. Background #211b15. Text
> #ece2d0. Then describe the diagram.

Open it in a browser, screenshot at 1600x900, save the PNG. The text is then
perfect because it is real text rather than a model's impression of text. For
the request path diagram and the enforcement table this is the only route that
reliably works.

---

## The shared style block

Paste this at the top of **every** image prompt. It is what makes fourteen
diagrams look like one series rather than fourteen.

```
Style: flat vector technical diagram, editorial, calm and precise.
Aspect ratio 16:9, 1600x900.

Background: warm near black #211b15, completely flat, no gradient, no texture.
Primary shapes: rounded rectangles with 1px borders in #4a3f33, filled #2a231b.
Text: #ece2d0, clean geometric sans serif, generous letter spacing, large
enough to read at one quarter size.
Accent for the single most important element: terracotta #b5501e.
Accent for anything correct, allowed or healthy: muted green #7cb593.
Accent for anything refused, blocked or failed: warm gold #d3a253.
Arrows: thin #998c78 lines with small solid triangular heads.

Rules: no 3D, no drop shadows, no gradients, no glow, no neon, no photographic
texture, no isometric perspective, no clip art icons, no stock imagery,
no watermark, no logos. Generous negative space. Left to right or top to bottom
flow only. Every label two words maximum.
```

Then append one of the diagram briefs below.

---

## Post 1: The system map

### Essential. `system_map_layers.png`

> Draw a vertical stack of five layers as wide rounded rectangles, evenly spaced,
> connected by a single thin arrow running down the left side from top to bottom.
> Top to bottom the labels are: Browser, Edge, Routes, Library, Database.
> The Library rectangle is wider than the others and contains three small
> rounded chips side by side labelled: Pure, Providers, Gateway.
> The Database rectangle is outlined in terracotta #b5501e while every other
> rectangle uses the standard border, marking it as the security boundary.
> To the right of the Edge layer, a separate small rectangle labelled Webhooks
> connects by its own arrow directly down to the Database, bypassing Routes.

### Optional. `four_axes.png`

> Draw four equal rounded rectangles in a single horizontal row, evenly spaced,
> each containing a short label in large text and one line of smaller text
> beneath it. Left to right: Scalability with "what breaks first", Efficiency
> with "where it waits", Cost with "what runs away", Portability with "what gets
> rewritten". No arrows, no connections. This is a legend, not a flow.

---

## Post 2: Software design

### Essential. `pure_core.png`

> Draw three vertical bands across the canvas. The left band and the right band
> are labelled Input Output and are filled slightly lighter than the background.
> The wide centre band is a large rounded rectangle outlined in muted green
> #7cb593, labelled Pure Decision in large text, with three smaller words stacked
> beneath it: no database, no network, no clock.
> One thin arrow runs from the left band into the centre, labelled Data.
> One thin arrow runs from the centre into the right band, labelled Answer.
> The visual point is that the centre never touches the outer bands directly.

### Optional. `silent_error.png`

> Draw two horizontal paths, one above the other, sharing a starting rectangle
> on the left labelled Query.
> The upper path leads to a rounded rectangle outlined in muted green #7cb593
> labelled Data, then continues right to a rectangle labelled Used.
> The lower path leads to a rounded rectangle outlined in warm gold #d3a253
> labelled Error, and its arrow stops abruptly at a small solid gold square
> with no further connection, labelled Discarded.
> Make the dead end visually obvious through the abrupt stop, not through an
> icon or a cross.

---

## Post 3: Architectural design

### Essential. `provider_abstraction.png`

> Draw a single wide rounded rectangle at the top labelled Pages and Routes.
> One thin arrow runs down from it into a second wide rounded rectangle in the
> middle labelled Abstraction, outlined in terracotta #b5501e.
> From the bottom edge of the Abstraction rectangle, three thin arrows fan
> downward to three small rounded rectangles in a row labelled Vendor A,
> Vendor B, Vendor C.
> Only the arrow to Vendor A is solid and terracotta; the other two are dashed
> and muted grey, showing one active provider and two available.
> A small chip sits beside the fan point labelled Env Var.

### Optional. `portability_tiers.png`

> Draw three horizontal bands stacked vertically, each a wide rounded rectangle
> with a label on the left and a short phrase on the right.
> Top band, outlined muted green #7cb593: Moves Unchanged, with "domain and tests".
> Middle band, standard border: Swap Adapter, with "payments, storage, models".
> Bottom band, outlined warm gold #d3a253: Rewritten, with "policies and schedules".
> No arrows. The stacking itself carries the meaning, easiest at the top.

---

## Post 4: AI engineering

### Essential. `agent_runtime_pipeline.png`

> Draw a single horizontal pipeline of six small rounded rectangles connected
> left to right by thin arrows, evenly spaced across the full width.
> Labels in order: Authenticate, Rate Limit, Build Prompt, Select Model,
> Execute, Record.
> The Rate Limit and Record rectangles are outlined in muted green #7cb593.
> Below the Select Model rectangle, one short arrow drops to a small chip
> labelled Registry.
> Keep the whole pipeline on one line with wide margins above and below.

### Essential. `spend_ceiling.png`

> Draw two horizontal paths from a shared rectangle on the left labelled Request.
> The upper path, drawn in muted green #7cb593, passes through a rectangle
> labelled Under Budget and continues to a rectangle on the right labelled Model.
> The lower path, drawn in warm gold #d3a253, meets a tall narrow vertical bar
> labelled Ceiling and stops there, not continuing to the right.
> The vertical bar should read clearly as a wall that one path passes and the
> other does not.

### Optional. `prompt_fencing.png`

> Draw a large rounded rectangle labelled System Prompt occupying most of the
> canvas. Inside it, near the bottom, draw a smaller rectangle outlined in a
> dashed warm gold #d3a253 line, labelled Catalogue Data, with a small tag on
> its top left corner reading Untrusted.
> Above that inner rectangle, inside the large one, place two short lines of
> text: Rules and Tools.
> To the left, outside the large rectangle, a small chip labelled User Text
> connects by an arrow that passes through a narrow gate shape labelled Flatten
> before entering the dashed inner rectangle.

---

## Post 5: Data engineering

### Essential. `two_booking_domains.png`

> Draw two parallel horizontal tracks, one above the other, sharing a single
> rounded rectangle on the far left labelled Booking.
> The upper track has three rectangles connected by arrows: Time, Payout, Paid.
> The lower track has three rectangles connected by arrows: Dates, Deposit,
> Confirmed.
> The final rectangle in each track is outlined in a different accent: the upper
> in muted green #7cb593, the lower in warm gold #d3a253, showing that the two
> terminal states are different.
> A short vertical dashed line separates the two tracks in the middle of the
> canvas to emphasise they never meet.

### Optional. `retention_clock.png`

> Draw a single horizontal timeline running left to right with four marks on it.
> Left to right the marks are labelled: Upload, Review, Wait, Delete.
> Draw a thin bracket spanning only from Review to Delete, labelled Retention,
> making clear the countdown starts at Review and not at Upload.
> The Upload to Review segment is drawn in muted grey, the Review to Delete
> segment in terracotta #b5501e.

---

## Post 6: Network architecture and security

### Essential. `real_boundary.png`

This is the most important diagram in the series. Consider generating it as
HTML instead, using the code route above, because the contrast between the two
halves has to be unambiguous.

> Split the canvas into two halves with a thin vertical divider.
> The left half is headed Assumed. It shows a vertical chain: Browser, arrow
> down to Route, arrow down to Database. One path only.
> The right half is headed Actual. It shows the same vertical chain, plus a
> second arrow that leaves Browser, curves around the outside of Route without
> touching it, and arrives directly at Database. That bypass arrow is drawn in
> terracotta #b5501e and labelled Public Key.
> In the right half only, the Database rectangle is outlined in terracotta and
> carries a small label beneath it reading Row Level Security.

### Optional. `failure_direction.png`

> Draw four rounded rectangles in a two by two grid, evenly spaced.
> Each contains a short label in large text and one word beneath it in smaller
> text indicating its failure direction.
> Top left: Spend Ceiling, with Open. Top right: Rate Limiter, with Degraded.
> Bottom left: Origin Check, with Open. Bottom right: Signature, with Shut.
> Outline the three that say Open or Degraded in muted green #7cb593 and the one
> that says Shut in terracotta #b5501e.
> No arrows. This is a comparison grid, not a flow.

---

## Post 7: Delivery

### Essential. `three_enforcement_points.png`

Better as HTML than as a generated image, because it is essentially a labelled
table.

> Draw one rounded rectangle on the left, outlined in terracotta #b5501e,
> labelled One Rule.
> From its right edge, three thin arrows fan out to three rounded rectangles
> stacked vertically on the right, labelled top to bottom: Agent Command,
> Pipeline Gate, Owned Path.
> Beside each of the three, place one short phrase in smaller muted text:
> "before merge", "fails build", "needs review".
> The Pipeline Gate rectangle is outlined in muted green #7cb593 to mark it as
> the one that actually holds.

### Optional. `delivery_loop.png`

> Draw a closed loop of five rounded rectangles arranged as a wide flattened
> circle, connected by thin arrows flowing clockwise.
> Starting at the left and going clockwise the labels are: Task, Scope, Build,
> Gate, Ship.
> The Gate rectangle is outlined in muted green #7cb593.
> From Ship, one arrow returns along the bottom to Task, closing the loop.
> Keep the loop wide and flat rather than circular so it fills a 16:9 canvas.

---

## Working order

If you are not doing all fourteen, do these five first. They carry the most
meaning and they are the ones a reader will remember.

1. `real_boundary.png` in the security post. The single strongest idea in the series.
2. `system_map_layers.png` in the map post. It is the hero of the whole set.
3. `pure_core.png` in the software design post.
4. `agent_runtime_pipeline.png` in the AI post.
5. `two_booking_domains.png` in the data post.

## After generating

Check each one at 393 pixels wide before committing it. If a label is
unreadable at that width, the diagram has too many elements and the fix is to
remove one rather than to shrink the text.

Then add the image to the post with a real alt description, run `npm run build`
to confirm it resolves, and push.

---

## The full architecture diagram

This one has around twenty labels, which is well past what image generation
renders legibly. Ask for code instead. Paste the whole block below into a fresh
Gemini conversation, then save the output as `.html`, open it, and screenshot it.

Or regenerate the existing one directly:

```
node docs/diagrams/render.mjs \
  docs/diagrams/thabangvision_architecture.html \
  public/posts/thabangvision_architecture.png
```

### The prompt

```
Produce a single self contained HTML file that draws a system architecture
diagram. Inline CSS only. No JavaScript, no external fonts, no images, no SVG
files, no frameworks, no comments in the output. Return only the HTML.

CANVAS
Body exactly 1600px wide and 848px tall, overflow hidden, padding 46px 54px 38px.

PALETTE
Page background #211b15, completely flat.
Box fill #2a231b, box border 1px #4a3f33, border radius 9px.
Primary text #ece2d0. Secondary text #998c78.
Green #7cb593 means this control enforces a rule.
Gold #d3a253 means this control refuses a request.
Terracotta #b5501e means this is the security boundary.
Font: "Segoe UI", -apple-system, Roboto, Helvetica, Arial, sans-serif.

LAYOUT
A CSS grid of five content columns separated by four thin chevron characters.
Each column has an uppercase letter spaced heading in secondary text, then a
vertical stack of boxes with 11px gaps. Each box has a bold title around 19px
and a smaller description around 13.5px in secondary text.

COLUMN 1, heading "Clients"
  Customer / browses, books, pays
  Creator / lists gear, gets paid
  Payment gateway / webhooks, no session
  Scheduler / nightly jobs, shared secret

COLUMN 2, heading "Edge"
  Proxy / session refresh and origin validation, on every request  [green]
  Signature / verified over the raw body, before parsing  [gold]

COLUMN 3, heading "Application"
  Marketing / static and revalidated
  Platform / mixed, some gated
  Admin / guarded in the layout  [green]
  API and webhooks / always dynamic

COLUMN 4, heading "Domain and providers"
  Pure modules / pricing, availability, ranking, checks. No input or output  [green]
  Provider interfaces / payments, storage, email, search. Chosen by env var
  AI gateway / registry, capability gate, spend ceiling, agent runtime  [gold]

COLUMN 5, heading "Data"
  Postgres / row level security is the real boundary  [terracotta, 2px border]
  Auth / sessions and roles
  Object storage / documents, retention job
  Vector index / embeddings for search

BELOW THE COLUMNS, a full width panel with a 2px terracotta border, radius 11px,
and a background of rgba(181, 80, 30, 0.06). Inside it:
  A small uppercase terracotta heading: "The path people forget"
  Then one horizontal row containing, left to right:
    a bordered box reading "Any client" with "public key" beneath it in small text,
    a flexible dashed terracotta horizontal line,
    three words in secondary text with a line through them: Proxy, Routes, Abstraction,
    another flexible dashed terracotta line,
    a solid triangular arrowhead pointing right,
    a bordered box reading "Postgres" with "row level security" beneath it.
  Then one paragraph: "The client key ships in the browser, so a direct query
  reaches the database without touching anything above. On this path, row level
  security is the only control. Everything to the left of it protects the path
  through the code." Colour the middle sentence terracotta.

BELOW THAT, a thin top border, then a row with the uppercase label "External"
on the left and a set of pill shaped chips with dashed borders on the right:
Payments, Media CDN, Model providers, Self hosted model, Email, and one wider
chip reading "Each one behind an interface, selected by environment variable".

FINALLY a small legend row: a green swatch with "enforces a rule", a gold swatch
with "refuses a request", a terracotta swatch with "the security boundary".

RULES
No gradients, no shadows, no glow, no 3D, no rounded blobs, no icons, no emoji.
Flat shapes and text only. Generous negative space. Nothing may overlap. All
content must fit inside 848px of height without scrolling.
```

### Rendering it

Save the output as `docs/diagrams/<name>.html`, then:

```
node docs/diagrams/render.mjs docs/diagrams/<name>.html public/posts/<name>.png
```

The render script uses a device scale factor of 2, so a 1600px wide canvas
produces a 3200px PNG that stays sharp on a retina screen while `next/image`
serves it down to 800.

### Asking for variations

Once you have a version you like, iterate with short follow ups rather than
re running the whole prompt:

```
Same file, but make the five column headings larger and move the legend to the
top right. Keep every colour and all the text exactly as it is.
```

```
Same file, but drop the External strip entirely and give the extra height to
the bypass panel.
```
