# Visual brief: diagrams for "The Practical Roadmap to Building With AI Agents"

This is a source document for NotebookLM. It describes thirteen diagrams for a
six part blog series about building real software with AI agents.

**Produce one slide per diagram, in the order given, following the global rules
in section 1 exactly.** Each diagram must be understandable to somebody who has
never heard of any of this technology, purely by looking at it.

---

## 1. Global rules, apply to every single slide

### The test that matters

A reader who does not know what an AI agent is should look at the picture and
understand the idea before reading a single word of the article. If the diagram
only makes sense once you already know the answer, it has failed.

Draw **real architecture**, not abstract boxes. Show the actual pieces, with
their real product logos, connected by arrows that show what moves and in which
direction. Where something is a database, draw a database. Where something is a
cloud service, show it as a cloud service. Where a person is involved, show a
person.

### Canvas

- **16:9, landscape, 1600 x 900 pixels.**
- Generous white space. Never crowd the frame.
- Maximum seven labelled elements per diagram. Fewer is better.
- Labels are one to three words. Never a sentence inside a shape.

### Palette: bright, high contrast, readable

Use a **light background**. Do not use dark, brown or muted earth tones.

| Role | Colour | Hex |
| --- | --- | --- |
| Background | near white | `#F8FAFC` |
| All text | deep navy | `#0F172A` |
| Data, flow, neutral systems | strong blue | `#2563EB` |
| Safe, allowed, healthy, correct | green | `#16A34A` |
| Warning, limited, blocked | amber | `#F59E0B` |
| Danger, failure, destructive | red | `#DC2626` |
| The AI model or agent itself | purple | `#7C3AED` |
| Arrows and secondary lines | slate grey | `#64748B` |

Colour must carry meaning consistently across all thirteen slides. Green always
means safe. Red always means dangerous. Purple is always the AI. A reader should
learn the colour code once on slide one and have it hold for the whole deck.

Do not rely on colour alone. Anything colour coded also gets a shape, an icon or
a word, so it survives being printed in black and white.

### Logos: use the real ones

Where a diagram names a real product, **show that product's actual logo** next to
its label, at a readable size. This is the single most important instruction in
this brief. The logos that appear across the series are:

- **Next.js** for the website itself
- **Vercel** for hosting and deployment
- **Supabase** for the database platform
- **PostgreSQL** for the database engine
- **GitHub** and **GitHub Actions** for code and automated checks
- **Google Gemini** for the AI model that powers the site assistant
- **Claude** for the coding agent that builds the site
- **Lighthouse** for the performance and accessibility checks

Draw them accurately and recognisably. Do not invent a logo. If a logo cannot be
rendered accurately, leave a clearly marked empty square in its place with the
product name beneath it, so it can be dropped in afterwards, rather than drawing
something approximate.

### Style

- Flat, clean, modern editorial illustration. Think a well designed
  documentation page, not a corporate slide.
- Rounded rectangles with 2px borders in the element's meaning colour.
- Arrows are thick enough to read at a glance, with clear solid arrowheads.
  Label the arrow itself when what moves is not obvious.
- Use simple line icons for concepts that have no logo: a padlock for security, a
  magnifying glass for search, a person silhouette for the human, a document for
  content, a warning triangle for failure.
- No 3D. No drop shadows. No gradients. No glow or neon. No isometric
  perspective. No stock photography. No watermarks.

---

## 2. The thirteen diagrams

### Slide 1 — Chat versus agent

**Idea to convey:** a chat window is a dead end; an agent is a loop that can act
and see what happened.

Split the slide down the middle.

**Left, titled "Chat":** a person icon at the top, an arrow down to a chat bubble,
an arrow down to a page of code, an arrow down to a red warning triangle labelled
"It Breaks", and then a final arrow pointing down into nothing. Draw the whole
left side in grey and red to feel like a dead end.

**Right, titled "Agent":** four elements arranged in a circle with thick curved
arrows flowing clockwise between them: a person icon labelled "Objective", the
Claude logo labelled "Agent" in purple, a gear or terminal icon labelled "Act",
and a green tick labelled "Observe". The arrow from "Observe" curves back to the
agent, closing the ring. The closed loop is the point of the whole slide.

### Slide 2 — What fits in the context window

**Idea to convey:** the model has limited working space, and things fall out.

Draw a large open box in blue, like a desk seen from above, labelled "Context
Window". Inside it, five cards of different sizes: "Instructions", "Your Code",
"The Question", "Tool Result", "History". Outside the box, tumbling off the right
edge, one more card in amber labelled "Dropped", drawn slightly rotated as though
it has fallen. A small purple Gemini logo sits beside the box, reading from it.

### Slide 3 — How a tool actually works

**Idea to convey:** the agent asks for something, real code runs, the answer comes
back, and that return path is what makes it useful.

A ring of four elements with thick clockwise arrows: the Claude logo in purple
labelled "Agent"; a puzzle piece or plug icon in blue labelled "Tool"; then a
group of three real logos stacked together labelled "Real Systems", showing the
**Supabase**, **Vercel** and **GitHub** logos; and a document icon in green
labelled "Result". Draw the arrow from "Result" back to "Agent" noticeably
thicker than the other three and colour it green, with the small label "this is
the part that matters".

### Slide 4 — Which permissions are risky

**Idea to convey:** reading is safe, writing is not, and production is not local.

A two by two grid, large and clear. Columns are labelled "Local" and
"Production". Rows are labelled "Read" and "Write".

- Top left, "Read Local", green, with a small green tick.
- Top right, "Read Production", green, with a green tick.
- Bottom left, "Write Local", amber, with a warning triangle.
- Bottom right, "Write Production", red, filled solid red with white text, with a
  padlock icon. Make this square visibly heavier than the other three.

Down the left edge, an arrow pointing downward labelled "risk increases".

### Slide 5 — How the site assistant finds answers

**Idea to convey:** the model does not know your writing, so you search it first
and hand it only the relevant pieces.

A left to right pipeline with five stages, each with an icon:

1. A person icon with a speech bubble, labelled "Question".
2. A magnifying glass in blue, labelled "Search".
3. The **Supabase** and **PostgreSQL** logos together in a database cylinder
   shape labelled "Vector Database", with the small word "pgvector" beneath it.
4. Three small document cards in green labelled "Relevant Bits", drawn emerging
   from the database.
5. The **Google Gemini** logo in purple labelled "Model", with a final arrow to a
   speech bubble in green labelled "Grounded Answer".

Below the database, a stack of document icons labelled "Your Blog Posts" feeding
upward into it with a thin arrow.

### Slide 6 — Precision and recall

**Idea to convey:** two different ways a search can fail.

Two large overlapping circles, Venn style, on a light background. The left circle
in blue outline labelled "Everything Useful". The right circle in green outline
labelled "What You Found". Fill the overlap solid green.

Two callout labels with leader lines: pointing at the left crescent, "Recall,
what you missed"; pointing at the right crescent, "Precision, junk you brought
back". Keep the callouts outside the circles.

### Slide 7 — A request is not a boundary

**Idea to convey:** telling the AI not to do something is the weakest possible
protection.

Three horizontal bars stacked vertically, each visibly heavier and more solid
than the one above.

- Top bar, thin dashed amber outline, nearly transparent, a speech bubble icon,
  labelled "Prompt Says No", with the small word "a request" beneath.
- Middle bar, solid blue border, a checklist icon, labelled "Code Checks First",
  with "a control" beneath.
- Bottom bar, thick solid green, filled, a padlock icon, labelled "Cannot Do It",
  with "a boundary" beneath.

To the right of the stack, a downward arrow labelled "stronger".

### Slide 8 — Layers of defence

**Idea to convey:** several cheap boring layers, not one clever one.

Five concentric or stacked protective layers, drawn as a shield or as nested
rounded bands, each labelled with a small icon:

1. "Narrow Permissions", a key icon, blue.
2. "Least Privilege", a smaller key icon, blue.
3. "Database Rules", the **PostgreSQL** logo, green, drawn as the thickest and
   most solid layer.
4. "Rate Limits", a speedometer or timer icon, amber.
5. "Human Approval", a person icon, green, at the centre or the base.

Somewhere on the slide, an arrow labelled "an attack" coming from outside and
stopping at the "Database Rules" layer, showing where it actually gets blocked.

### Slide 9 — The verification loop

**Idea to convey:** each check catches something the one before it cannot.

A ring of five stages with thick clockwise arrows, each with an icon and a small
question beneath the label:

1. A pencil icon, "Change".
2. A hammer or gear icon with the **Next.js** logo, "Build", beneath it "does it
   compile?".
3. A green tick clipboard, "Tests", beneath it "does it behave?".
4. The **GitHub Actions** and **Lighthouse** logos, "CI Checks", beneath it "does
   it hold up?".
5. A monitor or graph icon with the **Vercel** logo, "Logs", beneath it "what
   really happened?".

The arrow from "Logs" back to "Change" closes the ring.

### Slide 10 — How a bug becomes permanent knowledge

**Idea to convey:** you do not just fix it, you make it impossible to forget.

A left to right flow of four stages. A red bug icon labelled "Bug". Arrow to a
lightbulb icon labelled "Understand It". Arrow to a blue box labelled "Encode
It", which fans down with three small arrows to three green chips: "A Test", "A
Rule", "A Comment". Arrow onward to a final green box with a brain or archive
icon labelled "System Remembers", with the small line beneath it "not a person".

### Slide 11 — The whole architecture of this website

**Idea to convey:** this is the real system the series is about, end to end.

This is the flagship architecture slide. Draw it as a genuine architecture
diagram, left to right, with real logos throughout.

**Far left:** a person icon labelled "Visitor", and below it a separate person
icon labelled "Me", with the **Claude** logo beside it labelled "Coding Agent".

**Left to centre:** the "Me plus Agent" pair connects by an arrow labelled "commits"
to the **GitHub** logo. GitHub connects by an arrow labelled "deploys" to the
**Vercel** logo.

**Centre:** Vercel contains a rounded box labelled "The Website" showing the
**Next.js** logo, with two smaller boxes inside it labelled "Blog Posts" (a
document icon) and "Chat API" (a speech bubble icon).

**Right:** the "Chat API" box has two arrows out. One goes to the **Google
Gemini** logo labelled "Model" in purple. The other goes down to the **Supabase**
and **PostgreSQL** logos in a database cylinder labelled "Knowledge Base", with
the small line "published content only" beneath it, drawn with a green padlock on
the connection.

**Bottom:** the **GitHub Actions** and **Lighthouse** logos in a box labelled
"Automated Checks", with an arrow going up into GitHub labelled "blocks bad
changes" in red.

The visitor on the far left connects by a single arrow to "The Website".

### Slide 12 — The model lives inside a box that cannot be argued with

**Idea to convey:** put the unpredictable part inside the predictable part.

One large solid rounded rectangle filling most of the frame, thick green border,
labelled "Deterministic" at the top, with four small icons along its inside edge:
a padlock, a clipboard, a database, a gear, labelled "Permissions", "Tests",
"Schema", "Deployments".

Centred inside it, a much smaller rounded rectangle with a dashed purple border,
containing the **Google Gemini** logo, labelled "Probabilistic", with the small
word "the model" beneath.

Plenty of empty space between the inner box and the outer border, so the
containment is obvious at a glance.

### Slide 13 — One agent versus many

**Idea to convey:** more agents multiplies everything, including the cost.

Split the slide.

**Top half:** one purple Claude logo labelled "One Agent", with a single green
speech bubble beside it labelled "One Conversation", and a small green tick.

**Bottom half:** five purple agent icons in a row, each with its own amber speech
bubble above it, drawn to look visibly busier and more cluttered. To the right,
four short lines with small icons: a money icon "Five Bills", a box icon "Five
Contexts", a warning triangle "Five Failures", a magnifying glass "Harder To
Debug".

Between the two halves, a horizontal divider with the question "what did the
extra complexity buy?" in deep navy.

---

## 3. What to produce

Thirteen slides, one per diagram, in the order above, 16:9, following section 1
exactly. No title slide, no summary slide, no bullet point slides. Every slide is
a diagram.
