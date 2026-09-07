# Diagram prompts for the AI agents series

Prompts for the six part series "The Practical Roadmap to Building With AI
Agents". Written for Gemini image generation, matching the house style already
used by `docs/diagram-prompts.md` so the two sets look like one site.

Every post currently carries ASCII diagrams inside ```text fences. Those work and
are mobile safe. These images are the upgrade, not a rescue. Replace the fence
with the image, or keep both where the ASCII is doing something the image cannot.

---

## Read this first

**Size.** `MdxImage` renders through `next/image` at a fixed 800 by 450, so
everything is 16:9. Generate at 1600x900 and let it downscale.

**Mobile.** Verified at 390 pixels wide. Six or seven labelled elements is the
ceiling. Fewer is better. Two words per label, maximum.

**No captions.** `MdxImage` takes `src` and `alt` only. The diagram has to stand
alone, and the explanation goes in the paragraph above it.

**Write a real alt each time.** Each prompt below comes with one. Do not reuse a
single alt string across images, which is a defect in some of the older posts.

**Text is the hard part.** Image models misspell labels. Generate three or four
variations and pick the one whose text is clean. For anything with more than six
labels, use the HTML route at the bottom instead. It is flagged where it applies.

Files go in `public/posts/` as PNG, snake_case names.

---

## The style block

Paste this first, then append one diagram brief.

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

---

## Part 1: From Chat to Agent

### Essential. `agent_chat_vs_agent.png`

> Draw two columns separated by generous space. The left column is a vertical
> sequence of four small rounded rectangles connected by downward arrows,
> labelled top to bottom: You Ask, It Answers, You Paste, It Breaks. The final
> arrow points down into empty space and stops, indicating a dead end. The right
> column is a closed circular flow of four rounded rectangles arranged in a ring,
> connected by curved arrows running clockwise, labelled: Objective, Act,
> Observe, Adjust. The arrow from Adjust curves back into Objective, closing the
> loop. Outline every rectangle in the right column in terracotta #b5501e. Above
> the left column place the single word Chat, above the right column the single
> word Agent, both in large text.

Alt: `A chat sequence that ends in a dead end after you ask, it answers, you paste and it breaks, beside an agent loop that cycles through objective, act, observe and adjust`

### Optional. `agent_context_window.png`

> Draw a single wide rounded rectangle occupying most of the frame, outlined in
> terracotta #b5501e, labelled Context Window in large text at the top left
> inside it. Inside the rectangle place five smaller rounded chips of varying
> widths packed left to right in a single row, labelled: Instructions, Your Code,
> The Question, Tool Result, History. To the right of the large rectangle, just
> outside its border, place one more chip of the same style in warm gold #d3a253,
> positioned as though it has fallen off the edge, labelled Dropped.

Alt: `A context window shown as a container holding instructions, code, the question, a tool result and history, with one more item fallen off the edge`

---

## Part 2: Giving an Agent Hands

### Essential. `agent_tool_loop.png`

> Draw four rounded rectangles arranged in a wide ring, connected by curved
> arrows flowing clockwise. Starting at the top and moving clockwise the labels
> are: Agent, Tool, Real System, Result. The arrow from Result curves back to
> Agent, closing the loop. Outline the Result rectangle in terracotta #b5501e and
> make its arrow back to Agent slightly thicker than the others, marking the
> return path as the important one. Leave the centre of the ring empty.

Alt: `A closed loop where an agent calls a tool, the tool acts on a real system, and the result returns to the agent, with the return path emphasised`

### Essential. `agent_permission_grid.png`

> Draw a two by two grid of four equal rounded rectangles with generous gaps
> between them. The top left is outlined in muted green #7cb593 and labelled Read
> Local. The top right is outlined in muted green #7cb593 and labelled Read
> Production. The bottom left is outlined in warm gold #d3a253 and labelled Write
> Local. The bottom right is outlined in terracotta #b5501e, filled slightly
> lighter than the others, and labelled Write Production. Place the word Safer as
> small text to the left of the top row and the word Riskier as small text to the
> left of the bottom row.

Alt: `A two by two grid of tool permissions, from reading locally as the safest through to writing to production as the riskiest`

---

## Part 3: Giving an Agent Knowledge

### Essential. `agent_rag_pipeline.png`

> Draw a single horizontal left to right flow of five rounded rectangles
> connected by thin arrows, evenly spaced. Left to right the labels are:
> Question, Search, Relevant Bits, Model, Grounded Answer. Outline the Relevant
> Bits rectangle in terracotta #b5501e to mark it as the important step. Below
> the Search rectangle, connected upward to it by a single short arrow, place a
> separate rounded rectangle labelled Your Writing.

Alt: `A retrieval pipeline running from question to search to the relevant bits to the model to a grounded answer, with the search drawing from your own writing`

### Optional. `agent_precision_recall.png`

> Draw two large circles side by side that partially overlap, in the manner of a
> Venn diagram, outlined in thin #998c78 lines with no fill. Label the left
> circle Everything Useful in text placed inside its left edge. Label the right
> circle What You Found in text placed inside its right edge. Fill only the
> overlapping region with muted green #7cb593 at low opacity. Place the word
> Recall as small text with a thin leader line pointing at the left circle's
> non-overlapping area, and the word Precision as small text with a thin leader
> line pointing at the right circle's non-overlapping area.

Alt: `Two overlapping circles showing everything useful against what your search found, with recall and precision labelling the two non-overlapping areas`

---

## Part 4: Making Agents Safe Enough to Act

### Essential. `agent_request_vs_boundary.png`

> Draw three wide rounded rectangles stacked vertically with generous spacing,
> each one visually heavier than the one above it. The top rectangle has a thin
> dashed border in warm gold #d3a253, labelled Prompt Says No, with the smaller
> word Request beneath the label inside the same rectangle. The middle rectangle
> has a normal solid border, labelled Code Checks First, with the smaller word
> Control beneath it. The bottom rectangle has a thick solid border in terracotta
> #b5501e and a slightly lighter fill, labelled Cannot Do It, with the smaller
> word Boundary beneath it. No arrows between them.

Alt: `Three tiers of protection, from a prompt instruction that is only a request, through a code check that is a control, down to a credential that makes the action impossible`

### Essential. `agent_defence_layers.png`

> Draw five wide rounded rectangles stacked vertically, evenly spaced, connected
> by a single thin arrow running down the left side from top to bottom. Top to
> bottom the labels are: Narrow Permissions, Least Privilege, Database Rules,
> Rate Limits, Human Approval. Outline the Database Rules rectangle in terracotta
> #b5501e, marking it as the strongest layer. Make each rectangle slightly
> narrower than the one above it so the stack tapers downward.

Alt: `Five layers of defence stacked from narrow permissions down through least privilege, database rules and rate limits to human approval, with database rules highlighted as the strongest`

---

## Part 5: Making Agents Reliable Enough to Ship

### Essential. `agent_verification_loop.png`

> Draw five rounded rectangles arranged in a ring, connected by curved arrows
> flowing clockwise, with the ring's centre left empty. Starting at the top and
> moving clockwise the labels are: Change, Build, Tests, CI Checks, Logs. The
> arrow from Logs curves back to Change, closing the loop. Outline the Change
> rectangle in terracotta #b5501e. Beside each of Build, Tests, CI Checks and
> Logs, place one line of small text outside the ring reading in order: Compiles,
> Behaves, Holds Up, Really Happened.

Alt: `A verification loop cycling from a change through build, tests, CI checks and logs and back to the next change, with each stage answering a different question`

### Essential. `agent_bug_to_memory.png`

> Draw four rounded rectangles in a single horizontal left to right flow,
> connected by thin arrows. Left to right the labels are: Bug, Understand It,
> Encode It, System Remembers. Outline the Encode It rectangle in terracotta
> #b5501e. Below the Encode It rectangle, connected downward to it by three short
> thin arrows fanning out, place three small chips side by side labelled: Test,
> Rule, Comment.

Alt: `A bug becoming permanent knowledge by being understood and then encoded as a test, a rule or a comment, so the system remembers instead of a person`

---

## Part 6: From One Agent to an Agentic System

### Essential. `agent_deterministic_box.png`

> Draw one large rounded rectangle occupying most of the frame, outlined in
> terracotta #b5501e with a thick border, labelled Deterministic in large text at
> the top left inside it, with the smaller line Permissions, Tests, Schema
> beneath the label. Centred inside that rectangle, draw a second much smaller
> rounded rectangle with a thin dashed border in warm gold #d3a253, labelled
> Probabilistic, with the smaller word Model beneath it. Leave generous empty
> space between the inner rectangle and the outer border on all sides.

Alt: `A small probabilistic model contained inside a much larger deterministic box of permissions, tests and schema`

### Essential. `agent_one_vs_many.png`

> Draw two groups separated by generous vertical space. The upper group is a
> single rounded rectangle outlined in muted green #7cb593 labelled One Agent,
> with one line of small text to its right reading One Conversation. The lower
> group is five smaller rounded rectangles in a horizontal row, each outlined in
> warm gold #d3a253 and each labelled Agent, with one line of small text to their
> right reading Five Of Everything. Below the row of five, place four short lines
> of small text stacked vertically: Five Bills, Five Contexts, Five Failures,
> More To Debug.

Alt: `One agent needing a single conversation, compared with five subagents needing five of everything including five bills and five places to fail`

### Use the HTML route. `agent_progression.png`

Nine labelled steps is well past what an image model will render cleanly. Use the
code route below with this description:

> A single vertical ladder of nine steps, each step a wide rounded rectangle,
> connected by a thin arrow running down the left side. Top to bottom the labels
> are: Chat, Agent, Plus Context, Plus Tools, Plus Boundaries, Plus Feedback,
> Specialised Agents, Orchestrated System, Bounded Autonomy. To the right of each
> arrow, one line of small muted text giving the reason for that step, in order:
> it can act, it knows your work, it reaches systems, it cannot do damage, it
> learns it is wrong, only if needed, with a clear reason, and nothing beside the
> last. Outline the final rectangle in terracotta #b5501e.

Alt: `A nine step ladder from chat up to bounded autonomy, each step labelled with the capability it adds`

---

## The HTML route, for anything text heavy

Ask Gemini for code rather than an image:

> Produce a single self contained HTML file with inline CSS that draws the
> following diagram. Use flat shapes, no images, no external fonts, no
> JavaScript. Canvas exactly 1600 by 900 pixels. Background #211b15. Text
> #ece2d0. Borders #4a3f33. Accent #b5501e. Then describe the diagram.

Then render it the same way the existing diagrams were made:

```bash
node docs/diagrams/render.mjs docs/diagrams/agent_progression.html public/posts/agent_progression.png
```

The text comes out perfect because it is real text rather than a model's
impression of text.

---

## Dropping them into the posts

Plain markdown, no component needed:

```
![A closed loop where an agent calls a tool, the tool acts on a real system, and the result returns to the agent, with the return path emphasised](/posts/agent_tool_loop.png)
```

Where each one goes:

| Image | Post | Replaces |
| --- | --- | --- |
| `agent_chat_vs_agent.png` | Part 1 | the CHAT / AGENT fence |
| `agent_context_window.png` | Part 1 | nothing, it is new |
| `agent_tool_loop.png` | Part 2 | the tool loop fence |
| `agent_permission_grid.png` | Part 2 | nothing, it is new |
| `agent_rag_pipeline.png` | Part 3 | the question to answer fence |
| `agent_precision_recall.png` | Part 3 | nothing, it is new |
| `agent_request_vs_boundary.png` | Part 4 | the request / control / boundary fence |
| `agent_defence_layers.png` | Part 4 | the defence in depth fence |
| `agent_verification_loop.png` | Part 5 | the build / tests / CI fence |
| `agent_bug_to_memory.png` | Part 5 | the bug to memory fence |
| `agent_deterministic_box.png` | Part 6 | the nested box fence |
| `agent_one_vs_many.png` | Part 6 | the subagent cost fence |
| `agent_progression.png` | Part 6 | the progression ladder fence |

Send me the PNGs and I will wire them in, remove the fences they replace, check
they load at desktop and mobile widths, and rebuild.

Two things worth keeping in mind. Every image adds page weight to posts that
currently load fast, and Part 5 is already the heaviest at ten minutes. And a
fence that reads perfectly on a phone is not automatically improved by becoming
a picture, so if a generated diagram is not clearly better than the ASCII it
replaces, keep the ASCII.
