/**
 * The topic ontology: every subject the work on this site is about.
 *
 * This is the vocabulary that connects everything else. A project, a research
 * line, a publication, a post and a talk are related when they share a topic
 * here, and a topic with enough real work behind it gets a hub page at
 * /topics/<slug> that gathers all of it.
 *
 * Rules, so the list stays honest:
 *
 * 1. A topic exists only because something on the site is about it. The list
 *    was derived from the projects, research, publications, posts and talks,
 *    not from a list of fashionable terms.
 * 2. `wikidata` is the concept's Wikidata id, checked by hand against the
 *    label and description. It becomes `sameAs` on the DefinedTerm, which is
 *    what lets a machine know that "Kalman filtering" here is the same concept
 *    as Q846780 everywhere else. Leave it out rather than guess.
 * 3. A hub page is generated only when BOTH hold: the topic has an `intro`, and
 *    enough distinct work is attached (see `HUB_THRESHOLD` in lib/graph). A
 *    topic with one project behind it is better served by that project's own
 *    page, so it stays a term in the markup and does not become a thin page.
 * 4. Intros describe what is on the site, in plain sentences. No claims the
 *    linked pages do not support, no keyword lists.
 */

export type TopicKind = 'field' | 'method' | 'domain' | 'technology'

export interface TopicDef {
  slug: string
  /** The concept's name, as a DefinedTerm. */
  name: string
  kind: TopicKind
  /** Wikidata item id, verified by hand. */
  wikidata?: string
  /** Broader topics, by slug. Used for navigation and for `broader` relations. */
  broader?: string[]
  /** H1 for the hub page when it should read differently from `name`. */
  heading?: string
  /** One or two paragraphs on what the work here contributes. Required for a hub. */
  intro?: string
  /** Meta description for the hub, under 160 characters. Required with `intro`. */
  description?: string
}

export const TOPICS: TopicDef[] = [
  // --- Fields ---------------------------------------------------------------
  { slug: 'artificial-intelligence', name: 'Artificial intelligence', kind: 'field', wikidata: 'Q11660' },
  {
    slug: 'machine-learning',
    name: 'Machine learning',
    kind: 'field',
    wikidata: 'Q2539',
    broader: ['artificial-intelligence'],
  },
  {
    slug: 'data-science',
    name: 'Data science',
    kind: 'field',
    wikidata: 'Q2374463',
    intro:
      'Data science here means the whole path from a question to a decision someone acts on, inside real organisations: a university deciding where students need support, a municipality seeing where service delivery breaks, a national network deciding which of 15,000 sites needs attention first, and an insurer understanding physical risk across its portfolio. The writing covers the other half of the job, which is building the capability around the models: the roadmap from analyst to someone trusted with production systems, and what a modern data scientist now needs beyond modelling.',
    description:
      'Applied data science in insurance, telecoms, research and higher education, and writing on building the capability around the models.',
  },
  {
    slug: 'data-engineering',
    name: 'Data engineering',
    kind: 'field',
    wikidata: 'Q104659521',
    intro:
      'Most of the data science on this site only worked because of the engineering underneath it: streaming pipelines for tens of millions of network events a day, a telematics workload modernised on Databricks, and decision support systems built over municipal data. Ubunye Engine is the open source result of meeting the same pipeline plumbing problem in every one of those places, and the case studies say what the data layer had to do in each.',
    description:
      'Data engineering behind production analytics: streaming telemetry, Spark and Databricks pipelines, and the open source Ubunye Engine.',
  },
  {
    slug: 'mlops',
    name: 'MLOps',
    kind: 'field',
    wikidata: 'Q60753505',
    broader: ['machine-learning', 'software-engineering'],
    heading: 'MLOps and production machine learning',
    intro:
      'Getting a model into production and keeping it there is a different problem from building it. The work here covers that problem from three sides: modernising an insurance data science function toward a governed path from experiment to production on Databricks, running optimisation and streaming systems for a national telecoms network, and Ubunye Engine, an open source framework whose model registry, lineage and run anywhere guarantee are tested rather than promised.',
    description:
      'Production machine learning from practice: governed ML on Databricks, real time systems at telecoms scale, and the open source Ubunye Engine.',
  },
  {
    slug: 'software-engineering',
    name: 'Software engineering',
    kind: 'field',
    wikidata: 'Q80993',
    intro:
      'The craft underneath the models. Most of the writing here is about engineering practice around AI systems: how agents change the way software gets built, where they need guard rails, how to test and ship what they produce, and how to package Python so other people can rely on it. The open source projects are where those opinions are put into code that anyone can inspect.',
    description:
      'Software engineering for AI systems: agents in the development workflow, reliability, security, CI, packaging, and open source code to inspect.',
  },
  {
    slug: 'software-architecture',
    name: 'Software architecture',
    kind: 'field',
    broader: ['software-engineering'],
  },
  {
    slug: 'computer-vision',
    name: 'Computer vision',
    kind: 'field',
    wikidata: 'Q844240',
    broader: ['artificial-intelligence'],
    intro:
      'Computer vision work on this site is research rather than product. The MSc dissertation asked whether the iterative evolution of a level set segmentation, a method normally driven by a partial differential equation, can be learned as a sequence by recurrent networks, and compared an echo state network against trained convolutional RNN, LSTM, GRU and 3D CNN models on four image datasets. Earlier, a Wits honours project team, his included, built a TurtleBot that follows an object using Python and ROS.',
    description:
      'Computer vision research: learning level set image segmentation with echo state networks and recurrent models, plus an object following robot.',
  },
  {
    slug: 'ai-education',
    name: 'AI education',
    kind: 'domain',
    heading: 'AI education and practical AI literacy',
    intro:
      'A large part of the work here is teaching, in public and in South African communities that the industry usually reaches last. That means co hosting FabAcademic Unfiltered with Prof. Mamokgethi Phakeng, where sessions explain how to build with AI in plain language; Kasilam, a free initiative where township youth learn to build real websites for local businesses; and, earlier, analytics and machine learning workshops for staff and students at Wits. The common thread is transferring the capability rather than delivering an artefact.',
    description:
      'Practical AI education from South Africa: FabAcademic Unfiltered sessions, Kasilam township capability building, and university ML workshops.',
  },
  { slug: 'technical-leadership', name: 'Technical leadership', kind: 'domain' },

  // --- Methods --------------------------------------------------------------
  {
    slug: 'ai-agents',
    name: 'AI agents',
    kind: 'method',
    wikidata: 'Q132451509',
    broader: ['artificial-intelligence'],
    intro:
      'A practical roadmap to building with AI agents, written from using them to build real systems: moving from one agent to an agentic system, giving agents knowledge and retrieval, connecting tools and integrations, setting permissions and security boundaries, and keeping the result reliable in CI. The public sessions come at the same subject for people who do not write code, from agents for township businesses to agents for online shopping.',
    description:
      'Building with AI agents in practice: agentic systems, retrieval, tools, security, reliability and CI, plus public sessions for non coders.',
  },
  {
    slug: 'retrieval-augmented-generation',
    name: 'Retrieval augmented generation',
    kind: 'method',
    wikidata: 'Q121362277',
    broader: ['ai-agents'],
  },
  {
    slug: 'recurrent-neural-networks',
    name: 'Recurrent neural networks',
    kind: 'method',
    wikidata: 'Q1457734',
    broader: ['machine-learning'],
    intro:
      'Recurrent networks run through three separate research lines here. For mine workers, a recurrent network estimated hearing threshold shift from noise exposure, with a comparison of optimisation methods for training it. For seasonal climate forecasting, an RNN was tested against a CNN at predicting 2m temperature up to 52 weeks ahead. And in the MSc work, an echo state network, a recurrent model whose internal weights are never trained, was compared against trained convolutional RNN, LSTM and GRU models at learning level set image segmentation.',
    description:
      'Recurrent neural networks across three research lines: hearing loss in mine workers, seasonal climate forecasting and echo state networks.',
  },
  {
    slug: 'reservoir-computing',
    name: 'Reservoir computing',
    kind: 'method',
    wikidata: 'Q7315328',
    broader: ['recurrent-neural-networks'],
  },
  {
    slug: 'echo-state-networks',
    name: 'Echo state networks',
    kind: 'method',
    wikidata: 'Q5332763',
    broader: ['reservoir-computing'],
  },
  { slug: 'image-segmentation', name: 'Image segmentation', kind: 'method', wikidata: 'Q56933', broader: ['computer-vision'] },
  { slug: 'level-set-method', name: 'Level set method', kind: 'method', wikidata: 'Q1751397', broader: ['image-segmentation'] },
  { slug: 'deep-learning', name: 'Deep learning', kind: 'method', wikidata: 'Q197536', broader: ['machine-learning'] },
  {
    slug: 'bayesian-filtering',
    name: 'Bayesian filtering',
    kind: 'method',
    wikidata: 'Q3059012',
    broader: ['state-estimation'],
  },
  { slug: 'state-estimation', name: 'State estimation', kind: 'method', broader: ['time-series'] },
  { slug: 'kalman-filtering', name: 'Kalman filtering', kind: 'method', wikidata: 'Q846780', broader: ['bayesian-filtering'] },
  { slug: 'ensemble-kalman-filter', name: 'Ensemble Kalman filter', kind: 'method', wikidata: 'Q3072268', broader: ['kalman-filtering'] },
  { slug: 'particle-filtering', name: 'Particle filtering', kind: 'method', wikidata: 'Q1151499', broader: ['bayesian-filtering'] },
  { slug: 'time-series', name: 'Time series', kind: 'method', wikidata: 'Q186588' },
  { slug: 'mathematical-optimisation', name: 'Mathematical optimisation', kind: 'method', wikidata: 'Q141495' },
  { slug: 'recommender-systems', name: 'Recommender systems', kind: 'method', wikidata: 'Q554950', broader: ['machine-learning'] },
  { slug: 'stream-processing', name: 'Stream processing', kind: 'method', wikidata: 'Q2006448', broader: ['data-engineering'] },
  { slug: 'etl', name: 'Extract, transform, load', kind: 'method', wikidata: 'Q1276130', broader: ['data-engineering'] },
  { slug: 'seasonal-forecasting', name: 'Seasonal forecasting', kind: 'method', wikidata: 'Q117824594', broader: ['climate-risk'] },
  { slug: 'reproducibility', name: 'Reproducibility', kind: 'method', wikidata: 'Q1425625' },

  // --- Domains --------------------------------------------------------------
  {
    slug: 'climate-risk',
    name: 'Climate risk',
    kind: 'domain',
    wikidata: 'Q3433166',
    heading: 'Climate risk and geospatial machine learning',
    intro:
      'Climate work here runs from research into production. At IBM Research, machine learning models for long range seasonal forecasting of 2m temperature and precipitation were published at NeurIPS and EGU and deployed into IBM PAIRS Geoscope, a petabyte scale geospatial platform. In insurance, the same kind of thinking became geospatial flood and natural catastrophe risk models across more than 230,000 insured properties. The proposed doctoral research, not yet registered, continues the thread with physics informed self supervised learning for flood mapping from radar imagery.',
    description:
      'Climate risk and geospatial ML: seasonal forecasting research, models in a petabyte scale platform, and flood risk across 230,000+ properties.',
  },
  { slug: 'geospatial-ml', name: 'Geospatial machine learning', kind: 'domain', wikidata: 'Q2901148', broader: ['machine-learning'] },
  { slug: 'remote-sensing', name: 'Remote sensing', kind: 'domain', wikidata: 'Q199687' },
  { slug: 'synthetic-aperture-radar', name: 'Synthetic aperture radar', kind: 'domain', wikidata: 'Q740686', broader: ['remote-sensing'] },
  { slug: 'telematics', name: 'Telematics', kind: 'domain', wikidata: 'Q485669' },
  { slug: 'decision-support', name: 'Decision support systems', kind: 'domain', wikidata: 'Q330268' },
  { slug: 'noise-induced-hearing-loss', name: 'Noise induced hearing loss', kind: 'domain', wikidata: 'Q1475712' },
  { slug: 'occupational-health', name: 'Occupational health and safety', kind: 'domain', wikidata: 'Q629029' },
  { slug: 'telecommunications', name: 'Telecommunications', kind: 'domain', wikidata: 'Q418' },
  { slug: 'insurance', name: 'Insurance', kind: 'domain', wikidata: 'Q43183' },
  { slug: 'public-sector', name: 'Public sector', kind: 'domain' },
  { slug: 'capacity-building', name: 'Capacity building', kind: 'domain', wikidata: 'Q1417724' },
  { slug: 'robotics', name: 'Robotics', kind: 'domain', wikidata: 'Q170978' },
  {
    slug: 'open-source',
    name: 'Open source software',
    kind: 'domain',
    wikidata: 'Q1130645',
    heading: 'Open source',
    intro:
      'Tools built in public, in Python, from problems met repeatedly at work. Ubunye Engine separates what a data or ML pipeline does from where it runs, and tests that the same folder produces byte identical output across execution environments. TFiltersPy puts five Bayesian filters behind one estimator interface. Both are on PyPI with documentation and worked examples, and the writing includes a walkthrough of taking a library from an idea to something other people can install.',
    description:
      'Open source Python from production problems: Ubunye Engine for portable Spark pipelines, TFiltersPy for Bayesian filtering, and how to package.',
  },

  // --- Technologies ---------------------------------------------------------
  {
    slug: 'python',
    name: 'Python',
    kind: 'technology',
    wikidata: 'Q28865',
    intro:
      'Python is the language nearly everything here is written in, used as an engineering language rather than a scripting one. The open source libraries are the clearest examples: a Spark pipeline framework with a typed plugin contract, and a Bayesian filtering library that follows the scikit-learn estimator convention without depending on it. The writing covers packaging a Python library properly so that other people can install it and depend on it.',
    description:
      'Python as an engineering language: open source libraries for Spark pipelines and Bayesian filtering, and how to package a library properly.',
  },
  {
    slug: 'apache-spark',
    name: 'Apache Spark',
    kind: 'technology',
    wikidata: 'Q7573619',
    intro:
      'Spark sits under the largest systems described here: streaming and batch processing of network telemetry at Vodacom, telematics and risk workloads on Databricks in insurance, and Ubunye Engine, an open source framework that runs the same Spark pipeline folder on a laptop, Docker, Kubernetes, object storage, spark-submit and Databricks.',
    description:
      'Apache Spark in production and open source: telecoms telemetry, insurance workloads on Databricks, and portable pipelines with Ubunye Engine.',
  },
  { slug: 'databricks', name: 'Databricks', kind: 'technology', wikidata: 'Q18350420' },
  { slug: 'kubernetes', name: 'Kubernetes', kind: 'technology', wikidata: 'Q22661306' },
  { slug: 'docker', name: 'Docker', kind: 'technology', wikidata: 'Q15206305' },
  { slug: 'dask', name: 'Dask', kind: 'technology', wikidata: 'Q65065147' },
  { slug: 'apache-kafka', name: 'Apache Kafka', kind: 'technology', wikidata: 'Q16235208' },
  { slug: 'apache-flink', name: 'Apache Flink', kind: 'technology' },
  { slug: 'mlflow', name: 'MLflow', kind: 'technology' },
  { slug: 'tensorflow', name: 'TensorFlow', kind: 'technology', wikidata: 'Q21447895' },
  { slug: 'django', name: 'Django', kind: 'technology', wikidata: 'Q842014' },
  { slug: 'numpy', name: 'NumPy', kind: 'technology', wikidata: 'Q197520' },
]

const BY_SLUG = new Map(TOPICS.map((t) => [t.slug, t]))

export function getTopicDef(slug: string): TopicDef | undefined {
  return BY_SLUG.get(slug)
}

/**
 * Blog tags mapped onto the ontology. A post's tags are its public, syndicated
 * vocabulary (max five, shared with dev.to and Medium); this is how they join
 * the graph without changing that vocabulary.
 */
export const TAG_TO_TOPIC: Record<string, string> = {
  'ai agents': 'ai-agents',
  'software engineering': 'software-engineering',
  python: 'python',
  'open source': 'open-source',
  'data science': 'data-science',
  'data engineering': 'data-engineering',
  mlops: 'mlops',
  architecture: 'software-architecture',
  ai: 'artificial-intelligence',
  leadership: 'technical-leadership',
}

/**
 * Talk topics are a small controlled vocabulary of their own (lib/data.ts).
 * Each maps to at most one ontology topic; a value with no honest match maps
 * to nothing rather than to something close.
 */
export const TALK_TOPIC_TO_TOPIC: Record<string, string | undefined> = {
  'Building with AI': 'ai-education',
  'AI & Learning': 'ai-education',
  'Technology & Access': 'ai-education',
  'Data & Decision Making': 'data-science',
  'Computer Vision': 'computer-vision',
  Robotics: 'robotics',
  Entrepreneurship: undefined,
  Science: undefined,
  Research: undefined,
}
