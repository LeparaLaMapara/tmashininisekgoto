// ============================================================
// The Neural Observatory — Data Layer
// All structured content for Thabang Mashinini-Sekgoto's portfolio
// ============================================================

// --- Types ---

/** A public link a visitor can inspect. Every one is verified before it ships. */
export interface Artifact {
  kind: 'github' | 'pypi' | 'docs' | 'examples' | 'paper' | 'publication' | 'site' | 'product'
  href: string
  /** Overrides the default label for the kind. */
  label?: string
}

/**
 * The deep case study, following one honest template. A section is only filled
 * where it can be supported; contribution stays verb-precise and never converts
 * team work into solo work.
 */
export interface CaseStudy {
  problem: string
  why: string
  context: string
  contribution: string
  changed: string
  benefited: string
  remained: string
  /** The stack, shown in a collapsed block for readers who want it. */
  technicalContext?: string
}

export interface Project {
  slug: string
  title: string
  category: 'open-source' | 'telecoms' | 'banking' | 'insurance' | 'research' | 'education' | 'social-impact' | 'building-now'
  /** Explicit page order, low first. */
  order: number
  /** Problem-oriented card title, plain English, not a product name. */
  cardTitle: string
  /** One sentence naming the problem and what came of it. */
  oneLiner: string
  /** Why it was worth solving. */
  why: string
  /** One verified outcome for the card. Omitted rather than softened. */
  outcome?: string
  /** 3-6 topics, used on the card and by search/related/hubs. Not skill badges. */
  topics: string[]
  /** Verified public links. */
  artifacts: Artifact[]
  /** The Level-3 deep story. */
  caseStudy: CaseStudy
  /** Cross-link to the matching /resume role, where one exists. */
  resume?: { org: string; period: string }

  // --- Legacy fields, still read by search, related, RAG and schema. ---
  problem: string
  solution: string
  impact: string
  skills: string[]
  /** Optional: some stories (confidential employer work) have no fitting image. */
  image?: string
  /** How the image sits in its 16:9 frame. 'contain' suits a logo; default 'cover'. */
  imageFit?: 'cover' | 'contain'
  ghLink?: string
  productLink?: string
  paperLink?: string
  /** Live sites shipped under this project, shown as a list on the card */
  siteLinks?: { label: string; href: string }[]
  /** Set for work in progress; the card shows a Building now badge */
  building?: boolean
}

export interface Talk {
  id: number
  title: string
  description: string
  date: string
  event: string
  videoUrl: string
  slidesUrl?: string
  slidesLabel?: string
}

export interface Writing {
  id: number
  title: string
  description: string
  link: string
  date: string
  image?: string | null
}

export interface TechItem {
  name: string
  category: 'ml-ai' | 'data-engineering' | 'languages' | 'web' | 'infrastructure' | 'devops'
  icon: string // path to SVG in /public/icons/ or react-icons identifier
}

export interface ImpactNumber {
  label: string
  value: string
  suffix: string
  context: string
}

// --- Social Links ---

export const SOCIAL_LINKS = {
  github: 'https://github.com/LeparaLaMapara',
  linkedin: 'https://www.linkedin.com/in/thabang-mashinini-0081b5b6/',
  youtube: 'https://www.youtube.com/@tmashininisekgoto',
  instagram: 'https://www.instagram.com/thabanglukheto',
  twitter: 'https://x.com/thabangline',
  email: 'thabangline@gmail.com',
  scholar: 'https://scholar.google.com/citations?hl=en&authuser=1&user=aLjffFkAAAAJ',
  // Where the blog is syndicated. Listed so the copies are declared as the same
  // person's work rather than looking like someone reposting it.
  devto: 'https://dev.to/thabanglukheth0',
  medium: 'https://medium.com/@thabangline',
  booking: 'https://calendar.app.google/JzUn4JQ2pnzmmjLx5',
  // ORCID. Fill this the moment the iD is registered (the full URL, e.g.
  // https://orcid.org/0000-0002-1825-0097). Empty means no ORCID yet; it
  // flows automatically into sameAs and the Person schema when set, so no
  // other file needs touching.
  orcid: '',
} as const

// --- Typewriter Roles ---

export const TYPEWRITER_ROLES = [
  'AI Systems Architect',
  'Founder, Ubunye AI Ecosystems',
  'Distributed Systems Engineer',
  'Open Source Framework Developer',
]

// --- Impact Numbers ---

export const IMPACT_NUMBERS: ImpactNumber[] = [
  { label: 'Annual OPEX Savings', value: 'R1B', suffix: '+', context: 'Vodacom Smart Generators' },
  { label: 'Latency Reduction', value: '80-90', suffix: '%', context: 'ABSA ML Platform' },
  { label: 'Forecast Accuracy Gain', value: '15', suffix: '%', context: 'IBM Climate Intelligence' },
  { label: 'Subsidy Generated', value: 'R2M', suffix: '+', context: 'Wits Enrollment System' },
]

// --- Projects ---

export const PROJECTS: Project[] = [
  {
    slug: 'ubunye-engine',
    title: 'Ubunye Engine',
    category: 'open-source',
    order: 1,
    cardTitle: 'Everything you build sits on engineering',
    oneLiner:
      'Most of what an organisation builds with data and AI is gated by engineering, not by the idea, and the same plumbing gets rebuilt on every team and every platform. Ubunye Engine is one agreed way to describe a pipeline, wherever it ends up running.',
    why:
      'The tools are not the problem. People work on laptops, on-prem clusters and different clouds, and piping it all together is where the effort goes. Whether the team is small or large, and whether the job is one file or big data, that part should only be solved once.',
    outcome:
      'A standardisation layer over Spark: one YAML plus a Python class, seven built-in connectors, a model registry and lineage. A build job runs the same pipeline across six environments and fails if the outputs differ by a single byte.',
    topics: ['AI Engineering', 'MLOps', 'Data Pipelines', 'Reproducible Research', 'Open Source'],
    artifacts: [
      { kind: 'github', href: 'https://github.com/ubunye-ai-ecosystems/ubunye_engine' },
      { kind: 'pypi', href: 'https://pypi.org/project/ubunye-engine/' },
      { kind: 'docs', href: 'https://ubunye-ai-ecosystems.github.io/ubunye_engine/' },
      { kind: 'examples', href: 'https://github.com/ubunye-ai-ecosystems/ubunye-examples' },
      { kind: 'github', href: 'https://github.com/ubunye-ai-ecosystems', label: 'Ubunye AI Ecosystems' },
    ],
    caseStudy: {
      problem:
        'You join a team, open the repo, and find five Spark projects, each structured differently, each with its own way of handling configs, credentials and deployment. One uses a JSON file, another hardcodes everything, a third has a 300-line bash script that someone wrote and that just works. Building a pipeline from scratch is mostly plumbing: wire up the connection, juggle credentials, learn a framework’s quirks, and write the same read, transform, write scaffold again. It is a lot of glue code standing between you and the three lines that actually matter.',
      why:
        'A lot of the intelligence an organisation builds, and most research that has to become a working system, is gated by engineering rather than by the idea. The individual tools are good at their own layer. The difficulty is that people work on laptops, on on-prem clusters and on different clouds, and connecting all of it is where the time goes. Engineering sits underneath everything else, so it is worth solving once rather than per team.',
      context:
        'The pattern showed up in every environment I worked in: real-time analytics on national telecoms infrastructure at Vodacom, enterprise ML at ABSA, geospatial models going into a product at IBM Research. The specifics changed, the pattern did not. Ubunye Engine is one artifact inside Ubunye AI Ecosystems, a broader open-source effort built on the idea that we should also build tools from the problems we keep hitting, not only consume them. Ubunye is isiZulu for unity, and the goal was never to add another tool to the stack, it was to agree on how the pieces fit.',
      contribution:
        'I built the Engine around three ideas. Config over code: a pipeline is a YAML file declaring inputs, outputs and settings, not a program. Plugins for everything: a connector is a small class registered from outside, so a new data source needs no engine edits. Folders as architecture: every project is laid out as use case, pipeline, task, and the CLI uses that structure to scaffold, validate, plan and run. You write a transform() method; the engine handles connections, the Spark session, the read and write loop, model versioning and lineage.',
      changed:
        'The same task folder runs on a laptop, in Docker, on Kubernetes, against object storage, on Databricks and through a cloud submit path, with no code change. That is tested rather than claimed: a build job runs one pipeline across six environments and fails if a single byte of output differs. One rule makes it work, and it is deliberately strict: a task never chooses its own cluster, and the engine refuses a config that tries to, because a silent single-node run on paid compute is worse than an error.',
      benefited:
        'Teams that have outgrown scattered scripts, at either end of the size range, and the next person who opens the repo and can run something in minutes instead of a week. It is also deliberately scoped, which matters as much as what it does: it is not an agent framework, not an orchestrator and not a compute engine. It is the standardisation layer between data sources and applications, and it makes the plumbing boring.',
      remained:
        'A published framework on PyPI with a documentation site and eleven worked examples that have all actually been run, seven built-in connectors, a model registry that writes to a local folder, a Databricks volume, S3 or GCS chosen purely by the path, lineage you can trace after the fact, and a plugin contract that lets someone add a source the engine has never seen. Claims that could not be executed were removed from the docs rather than left to mislead.',
      technicalContext:
        'Apache Spark, Python, config as YAML with Jinja2 templating validated by Pydantic, connectors for hive, jdbc, delta, s3, unity, binary and rest_api, a CLI (init, validate, plan, run, test, lineage, models), a Python API for Databricks, Delta Lake, Docker, Kubernetes, and submit paths for EMR Serverless and Dataproc Serverless. The package ships its types and a type checker guards every merge.',
    },
    // Legacy fields for search/related/RAG/schema.
    problem:
      'Every team rebuilds the same pipeline plumbing, structured differently each time, and the tooling is split across laptops, on-prem clusters and different clouds.',
    solution:
      'A standardisation layer over Spark: describe a pipeline as a YAML file plus a Python transform, and run that same task folder on a laptop, Docker, Kubernetes, object storage, Databricks or a cloud submit path.',
    impact:
      'Published on PyPI with a documentation site, eleven worked examples, seven connectors, a model registry and lineage, with a build job that runs one pipeline across six environments and fails if the outputs differ by a byte.',
    skills: ['Python', 'Apache Spark', 'Databricks', 'Kubernetes', 'Docker', 'CI/CD'],
    image: '/projects/ubunye-ai.png',
    ghLink: 'https://github.com/ubunye-ai-ecosystems/ubunye_engine',
    productLink: 'https://ubunye-ai-ecosystems.github.io/ubunye_engine/',
  },
  {
    slug: 'tfilterspy',
    title: 'Tfilterspy',
    category: 'open-source',
    order: 2,
    cardTitle: 'Making noisy sensor data easier to work with',
    oneLiner:
      'Working with telemetry across telecoms and insurance, the same problem kept coming back, real sensors lie, so I built the filtering methods I kept re-implementing into one library behind an API people already know.',
    why:
      'The mathematics is well known, but the available implementations assumed you were already a state-estimation specialist, which put an expert in the path of an ordinary modelling task.',
    outcome:
      'Five Bayesian filters, Kalman, Extended, Unscented, Ensemble and Particle, behind one scikit-learn compatible fit, predict and score API, with smoothing, forecasting and streaming updates. Published on PyPI with documentation and worked examples.',
    topics: ['Sensor Data', 'State Estimation', 'Kalman Filtering', 'Time Series', 'Open Source'],
    artifacts: [
      { kind: 'github', href: 'https://github.com/ubunye-ai-ecosystems/tfilterspy' },
      { kind: 'pypi', href: 'https://pypi.org/project/tfilterspy/' },
      { kind: 'docs', href: 'https://ubunye-ai-ecosystems.github.io/tfilterspy' },
    ],
    caseStudy: {
      problem:
        'Real sensors lie. GPS drifts, radar is noisy, vehicle trackers and IoT devices produce readings you cannot use directly, and you need an honest estimate of the state underneath the noise.',
      why:
        'Bayesian filtering solves this and the mathematics is well established, but re-deriving Kalman, Particle or Ensemble filters from papers on each new project is slow and error prone. The bigger problem was that existing implementations tended to assume a state-estimation background, so a practitioner who simply needed a clean signal had to become a specialist first, or find one.',
      context:
        'The recurring context was telemetry: the same class of noisy time-series problem appearing across telecommunications and insurance, in telematics and IoT. The methods themselves are not specific to vehicles, which shaped the scope. The same five filters serve radar tracking, robot localisation, high-dimensional weather and ocean models, EEG, image denoising, and even smoothing signals in text.',
      contribution:
        'I built Tfilterspy as an open-source Python library. The design decision that mattered was familiarity: every filter is a scikit-learn compatible estimator, so fit, predict, score, get_params and set_params behave the way a practitioner already expects, and a filter can slot into tooling built around that convention. I also wrote the part people actually get stuck on, a decision guide for choosing among the five: a Kalman filter for linear systems, an Extended Kalman filter where you can supply Jacobians, an Unscented Kalman filter where you cannot, an Ensemble Kalman filter for very high-dimensional states, and a Particle filter for non-Gaussian or multimodal problems. It is built to scale beyond one machine, with optional Dask parallelism for the ensemble and particle methods.',
      changed:
        'Filtering stopped being a re-derivation exercise and became fitting a familiar estimator. Beyond the forward pass there is RTS smoothing, forecasting a number of steps ahead, and a filter_step call for online use against a live stream. Particle degeneracy is visible rather than silent through effective sample size monitoring, and a memory mode drops covariance storage for roughly an 80 percent saving on very long series, so a million-step run is practical.',
      benefited:
        'Engineers and scientists working with noisy time series who are not filtering specialists, and the production telematics state-estimation work it has been used in.',
      remained:
        'A published, documented library on PyPI: five filters behind one API, worked examples for GPS vehicle tracking, radar tracking and robot localisation, notebooks covering EEG, image denoising and benchmarks across all five, and a test suite that includes a ten thousand step dataset.',
      technicalContext:
        'Python, NumPy, SciPy, a scikit-learn BaseEstimator API, optional Dask for parallel ensemble and particle propagation, a parameter estimator utility, 37+ tests including a 10,000-step run, PyPI.',
    },
    problem:
      'Real sensors lie. GPS, radar, vehicle trackers and IoT devices all produce noisy readings, and you need an honest estimate of what is actually happening underneath the noise.',
    solution:
      'An open-source Python library of five Bayesian filters, Kalman, Extended, Unscented, Ensemble and Particle, behind one scikit-learn compatible API, with smoothing, forecasting, streaming updates and optional Dask parallelism.',
    impact:
      'Published on PyPI with documentation and worked examples across GPS, radar and robotics, and used in production telematics state-estimation work.',
    skills: ['Python', 'NumPy', 'SciPy', 'Dask', 'PyPI', 'CI/CD'],
    image: '/projects/tfilterspy.png',
    ghLink: 'https://github.com/ubunye-ai-ecosystems/tfilterspy',
    productLink: 'https://ubunye-ai-ecosystems.github.io/tfilterspy',
  },
  {
    slug: 'insurance-data-science-capability',
    title: 'Building the capability around the models',
    category: 'insurance',
    order: 3,
    cardTitle: 'Building the capability around the models',
    oneLiner:
      'Leading insurance data science, the work was less about any single model and more about the people, engineering and governance that let models reach production reliably.',
    why:
      'A data-science capability is more than a collection of models. It needs repeatable engineering, governance, and knowledge that does not live in one person’s head.',
    outcome:
      'A scoring cycle that used to take about two months now runs in under a day, and models move to production through repeatable engineering rather than one-off effort.',
    topics: ['Production ML', 'MLOps', 'Geospatial AI', 'Telematics', 'Technical Leadership', 'AI Governance'],
    artifacts: [],
    caseStudy: {
      problem:
        'Insurance data science had capable people building models, but getting those models into production reliably depended on individual knowledge and one-off effort. The bottleneck was the engineering and governance around the models, not the models themselves.',
      why:
        'When a capability depends on who happens to know how a thing works, it does not scale and it does not survive people leaving. Underwriting, retention, fraud, telematics and climate-risk work all need models that reach production dependably.',
      context:
        'A large, regulated enterprise environment, where governance, cloud architecture and repeatable practice matter as much as model quality, and where confidentiality limits what can be said about specific systems.',
      contribution:
        'I lead the insurance data science capability. The emphasis has been on the things that let a team ship reliably: modernising the telematics platform, building reusable engineering practice and lifecycle discipline, geospatial flood-risk modelling, and governance, so the team’s work depends less on any one person.',
      changed:
        'Efficiency and reliability, stated as change rather than counts: a telematics scoring cycle that took about two months now runs in under a day, and models move to production through repeatable practice instead of heroics.',
      benefited:
        'Insurance operations, the data scientists on the team who can now ship more reliably, and ultimately customers on the other end of underwriting, retention and risk decisions.',
      remained:
        'Reusable engineering practice, governance, and a more self-sufficient team, capability that outlasts any single project. Some of the modernisation runs on Ubunye Engine.',
      technicalContext:
        'Cloud-first architecture, Databricks, geospatial ML, MLOps and model-lifecycle practice, AI governance. Specifics are limited by employer confidentiality.',
    },
    problem:
      'A data-science capability is more than a collection of models. Getting models into production reliably depended on individual knowledge and one-off effort.',
    solution:
      'Leading the insurance data science capability, with the emphasis on the engineering, governance and repeatable practice that let models reach production, plus telematics modernisation and geospatial flood-risk work.',
    impact:
      'A telematics scoring cycle that took about two months now runs in under a day, and the team ships to production through repeatable engineering rather than one-off effort.',
    skills: ['Databricks', 'Geospatial ML', 'MLOps', 'AI Governance', 'Enterprise AI'],
    image: '/projects/absa-activate.jpg',
    resume: { org: 'ABSA Insurance', period: 'Mar 2024 - Present' },
  },
  {
    slug: 'vodacom-smart-generators',
    title: 'Keeping a network running when the power doesn’t',
    category: 'telecoms',
    order: 4,
    cardTitle: 'Keeping a network running when the power doesn’t',
    oneLiner:
      'Load-shedding forced thousands of mobile sites onto generators, and every bad dispatch call burned fuel or dropped the network for real customers.',
    why:
      'With constrained fuel and crews, someone had to decide where intervention actually mattered, in real time, across the whole estate.',
    outcome:
      'A nationwide real-time decision system across Vodacom’s estate of 15,000+ sites, processing on the order of a million events a day and supporting roughly R1B in annual savings.',
    topics: ['Optimization', 'Real-Time Streaming', 'Telemetry', 'Production ML', 'Decision Systems'],
    artifacts: [
      { kind: 'product', href: 'https://www.vodacombusiness.co.za/business/solutions/internet-of-things/smart-generator-monitoring', label: 'Vodacom product page' },
    ],
    caseStudy: {
      problem:
        'Load-shedding pushed thousands of network sites, across a nationwide estate of more than 15,000, onto diesel generators and batteries. Fuel was limited, crews were limited, and telemetry and alarms were noisy, so every decision about which site to attend to, and when, had consequences for cost and for whether the network stayed up.',
      why:
        'A dropped site is dropped service for real people, and wasted diesel is real money at national scale. The hard part was deciding where intervention mattered most under genuine resource constraints.',
      context:
        'More than 15,000 mobile sites nationwide, with interdependent network effects, unreliable power, and a constant stream of telemetry and alarms that had to be turned into operational decisions in real time.',
      contribution:
        'I led a team of data scientists and engineers. We built a constrained-optimisation engine over real-time streaming telemetry that decides which generators to run, where and when, and I architected the platform behind it.',
      changed:
        'Dispatch moved from reactive to informed: across the national estate of 15,000+ sites, the system weighs cost, network impact and constraints and directs effort where it matters, in real time.',
      benefited:
        'The network-operations teams who keep South Africa connected through power cuts, and the customers who stayed connected because of better decisions.',
      remained:
        'A production decision system, and the streaming engineering underneath it, including a custom stream-processing framework built to handle the telemetry volume.',
      technicalContext:
        'Real-time streaming on the order of a million events a day, constrained optimisation (CVXPY), PyFlink / PySpark / Kafka, Kubernetes, Docker, GitLab CI.',
    },
    problem:
      'Load-shedding forced thousands of network sites onto diesel generators, and every bad dispatch decision burned fuel and dropped the network for real customers.',
    solution:
      'A constrained-optimisation engine with real-time streaming analytics that decides which generators to run, where, and when, built for the network-operations teams who keep South Africa connected through power cuts.',
    impact:
      'A nationwide real-time decision system across 15,000+ sites that processes on the order of a million events a day and supported roughly R1B in annual savings.',
    skills: ['PyFlink', 'Kafka', 'CVXPY', 'PySpark', 'Kubernetes', 'Docker', 'GitLab CI'],
    image: '/projects/smart-generators.png',
    productLink: 'https://www.vodacombusiness.co.za/business/solutions/internet-of-things/smart-generator-monitoring',
    resume: { org: 'Vodacom', period: 'Nov 2021 - Mar 2024' },
  },
  {
    slug: 'ibm-geospatial',
    title: 'Turning environmental data into something people can use',
    category: 'research',
    order: 5,
    cardTitle: 'Turning environmental data into something people can use',
    oneLiner:
      'Satellite and climate data is huge and awkward, many formats, raster and vector, heavy to process, and few organisations can handle it alone.',
    why:
      'Environmental and climate-risk questions need planet-scale data turned into something an organisation can actually act on.',
    outcome:
      'Analytics workflows on IBM PAIRS processing multi-terabyte datasets, feeding IBM’s Environmental Intelligence Suite.',
    topics: ['Geospatial AI', 'Remote Sensing', 'Applied Research', 'Climate Risk', 'Distributed Computing'],
    artifacts: [
      { kind: 'github', href: 'https://github.com/IBM/ibmpairs', label: 'IBM PAIRS' },
      { kind: 'product', href: 'https://www.ibm.com/products/environmental-intelligence-suite', label: 'IBM Environmental Intelligence Suite' },
      { kind: 'publication', href: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=aLjffFkAAAAJ&citation_for_view=aLjffFkAAAAJ:UeHWp8X0CEIC' },
    ],
    caseStudy: {
      problem:
        'Climate and environmental-risk questions need planet-scale satellite data, and almost no organisation can process it on its own: the data is enormous, comes in many raster and vector formats, and varies in spatial and temporal resolution.',
      why:
        'Environmental, climate and supply-chain risk intelligence is only useful if the underlying data can be processed and turned into something an organisation can act on.',
      context:
        'Research at IBM Research, working on the PAIRS geospatial platform, where the challenge was as much data engineering at scale as it was modelling.',
      contribution:
        'I researched and built machine-learning and geospatial analytics for environmental and climate applications, deployed climate-forecasting models onto the IBM PAIRS platform, and contributed to a COVID-19 risk-index dashboard for Gauteng.',
      changed:
        'Multi-terabyte satellite datasets became analytics workflows that could feed a product, rather than a processing problem each organisation faced alone.',
      benefited:
        'Enterprises needing environmental, climate and supply-chain risk intelligence, through IBM’s Environmental Intelligence Suite.',
      remained:
        'Research contributions, a publication, and work that fed a production environmental-intelligence product.',
      technicalContext:
        'IBM PAIRS, IBM Cloud, Python, TensorFlow, GeoPandas, Hadoop, Airflow, large-scale raster and vector processing.',
    },
    problem:
      'Climate and environmental-risk questions need planet-scale satellite data, and almost no organisation can process it on its own.',
    solution:
      'Analytics workflows on IBM PAIRS that process multi-terabyte satellite raster and vector datasets, for enterprises that need environmental, climate and supply-chain risk intelligence.',
    impact:
      "Work that fed IBM's Environmental Intelligence Suite for global environmental monitoring.",
    skills: ['IBM PAIRS', 'IBM Cloud', 'Airflow', 'Python', 'Hadoop', 'GeoPandas', 'TensorFlow'],
    image: '/projects/ibm-geospatial.png',
    ghLink: 'https://github.com/IBM/ibmpairs',
    productLink: 'https://www.ibm.com/products/environmental-intelligence-suite',
    paperLink: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=aLjffFkAAAAJ&citation_for_view=aLjffFkAAAAJ:UeHWp8X0CEIC',
    resume: { org: 'IBM Research', period: 'Apr 2020 - Nov 2021' },
  },
  {
    slug: 'wits-student-success',
    title: 'A recommendation system for student success',
    category: 'research',
    order: 6,
    cardTitle: 'A recommendation system for student success',
    oneLiner:
      'Institutional planning needed to find the students and interventions that mattered in a lot of noisy administrative data.',
    why:
      'The outputs fed real decisions about planning and student support, and the knowledge had to outlast me, so part of the work was teaching it.',
    outcome:
      'A clustering-based recommendation engine associated with over R2M a year in government subsidy; 76+ staff and students trained.',
    topics: ['Recommendation Systems', 'Applied Research', 'Analytics', 'AI Education'],
    artifacts: [],
    caseStudy: {
      problem:
        'A university’s institutional planning and student-success work sat on a lot of noisy administrative data, and the useful signals, which students and which interventions mattered, were hard to surface.',
      why:
        'The outputs were not a demo: they fed real decisions about planning and student support, where getting it right changes outcomes for students.',
      context:
        'Business Intelligence Services at the University of the Witwatersrand, where the work also had to be usable and maintainable by staff after I moved on.',
      contribution:
        'I built a clustering-based recommendation engine and the reporting and analytics around it, and I trained 76+ staff and students so the capability did not leave with me.',
      changed:
        'Planning gained a data-driven way to target support, and the institution kept both the system and the people who understood it.',
      benefited:
        'Institutional planning, the staff and students trained, and the students the interventions were designed to support.',
      remained:
        'A recommendation and analytics system in use for planning, and trained people, an early instance of a pattern that runs through the later work: leave capability behind, not just software.',
      technicalContext:
        'Python, SQL, clustering and recommendation methods, Power BI reporting.',
    },
    problem:
      'Institutional planning needed to find the students and interventions that mattered in a lot of noisy administrative data.',
    solution:
      'A clustering-based recommendation engine and the reporting and analytics around it, built to be maintainable by staff, with 76+ staff and students trained to use it.',
    impact:
      'A recommendation engine associated with over R2M a year in government subsidy, and 76+ staff and students trained.',
    skills: ['Recommendation Systems', 'Clustering', 'Analytics', 'Power BI'],
    image: '/projects/wits-recommender.png',
    resume: { org: 'Business Intelligence Services - University of the Witwatersrand', period: 'Jun 2018 - Apr 2020' },
  },
  {
    slug: 'kasilam-digital',
    title: 'Teaching people to build for themselves',
    category: 'social-impact',
    order: 7,
    cardTitle: 'Teaching people to build for themselves',
    oneLiner:
      'Township businesses can’t afford agencies and township youth aren’t taught the skills that now pay, so Kasilam teaches people to build with AI by doing real work.',
    why:
      'Building everything for people creates dependency. Transferring the capability changes what they can do next: a website helps once; knowing how to build the next one is the thing that lasts.',
    outcome:
      'A growing set of real sites shipped for local businesses at no cost, built by participants learning to earn with AI, not built by me.',
    topics: ['AI Education', 'Community', 'Capability Building', 'Applied AI'],
    artifacts: [
      { kind: 'site', href: 'https://kasilamdigitialplatforms.vercel.app/', label: 'Community builds' },
      { kind: 'github', href: 'https://github.com/orgs/Kasilam-Projects/repositories', label: 'Kasilam Projects' },
    ],
    caseStudy: {
      problem:
        'Two problems with one root. Township businesses stay invisible online because agencies cost more than they can spend, and township youth cannot turn their potential into income because the skills that now pay, building with AI, are taught almost everywhere except where they are.',
      why:
        'Handing a business a website solves one thing once. Handing a young person the ability to build the next one, and the one after, changes what they can do afterwards, and can turn into income.',
      context:
        'A free community initiative, not an agency. The deliberate constraint is that participants do the building; the point is capability transfer, not a portfolio of sites with my name on them.',
      contribution:
        'I teach: learners, schools, small businesses and local entrepreneurs, showing them how to use AI and digital tools to build for themselves. I do not build the participants’ projects for them.',
      changed:
        'Businesses that could not afford a presence got one, and young people gained an in-demand skill, a public portfolio and a path to earning, rather than a one-off favour.',
      benefited:
        'Township small businesses, and the young people who did the building and kept the skill.',
      remained:
        'The capability that stays with the participants, and a growing set of real community builds that they made.',
      technicalContext:
        'Participants build with AI assistance and web tooling (HTML, CSS, JavaScript, React, GitHub Pages), described in plain English, with no formal coding background required.',
    },
    problem:
      'Township businesses stay invisible online because agencies cost too much, and township youth are not taught the skills that now pay: building with AI.',
    solution:
      'A free initiative that teaches young people to build with AI by doing real work: participants ship real websites and tools for township SMEs, described in plain English, with no formal coding background needed.',
    impact:
      'A growing set of live sites shipped for real businesses at no cost, each one built by a participant learning to earn with AI.',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'AI', 'GitHub Pages'],
    image: '/projects/kasilam.png',
    ghLink: 'https://github.com/orgs/Kasilam-Projects/repositories',
    productLink: 'https://kasilamdigitialplatforms.vercel.app/',
    siteLinks: [
      { label: 'Community builds', href: 'https://kasilamdigitialplatforms.vercel.app/' },
    ],
  },
]

/** A single project by slug. */
export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug)
}

/** Projects in explicit display order. */
export function getProjectsOrdered(): Project[] {
  return [...PROJECTS].sort((a, b) => a.order - b.order)
}

/** The /work case study for a CV role, matched on org + period. */
export function getProjectForRole(org: string, period: string): Project | undefined {
  return PROJECTS.find((p) => p.resume?.org === org && p.resume?.period === period)
}

// --- Talks ---

export const TALKS: Talk[] = [
  {
    id: 17,
    title: "Session 6.7: How to get AI to teach you writing & research",
    description: "Co-hosting with Prof Phakeng on a different way to think about AI — using it to strengthen your own thinking rather than replace it. We explore how AI can challenge your assumptions, improve your writing, and deepen your understanding of a research problem.",
    date: "2026-06-14",
    event: "FabAcademic Unfiltered [Prof Mamokgethi Phakeng]",
    videoUrl: "https://www.youtube.com/embed/ovSJuLqfgf4",
  },
  {
    id: 16,
    title: "Session 6.5: You describe it. AI builds it — the Extern AI journey",
    description: "Joining Prof Phakeng in conversation with Luncedo Simelane, a 21-year-old entrepreneur who built Extern AI, a platform that lets people create software and AI solutions without coding — with a live demonstration of how it works.",
    date: "2026-06-01",
    event: "FabAcademic Unfiltered [Prof Mamokgethi Phakeng]",
    videoUrl: "https://www.youtube.com/embed/QOarIoj9AA0",
  },
  {
    id: 15,
    title: "Session 6.3: A 20-year-old builds an AI tender system",
    description: "Co-hosting with Prof Phakeng alongside Sange Zwane, a 20-year-old student entrepreneur who built an AI-powered tender system. A conversation about possibility — what happens when exposure meets talent and young Africans start building with AI.",
    date: "2026-05-18",
    event: "FabAcademic Unfiltered [Prof Mamokgethi Phakeng]",
    videoUrl: "https://www.youtube.com/embed/5SL_KRfMBAQ",
  },
  {
    id: 14,
    title: "Session 6.2: Building AI accounting software for informal traders",
    description: "A conversation with Karabo, an award-winning AI champion, professional accountant, and founder of AEGL, who used AI to build a platform for informal traders — people often overlooked, yet who form the backbone of our economies.",
    date: "2026-05-04",
    event: "FabAcademic Unfiltered [Prof Mamokgethi Phakeng]",
    videoUrl: "https://www.youtube.com/embed/1QrY6ViPnlU",
  },
  {
    id: 13,
    title: "Session 6 Launch: From learning AI to building with it",
    description: "Launching Season 6 with Prof Phakeng — a season focused on real case studies of people building meaningful things with AI. We reconnect with Tshepo from Lebowakgomo, who returns to share the progress of his platform STACU.",
    date: "2026-04-27",
    event: "FabAcademic Unfiltered [Prof Mamokgethi Phakeng]",
    videoUrl: "https://www.youtube.com/embed/o8E8JX-uzos",
  },
  {
    id: 12,
    title: "Session 5.13: From learning to building with AI",
    description: "Exploring how to move from being a consumer of AI to a creator in an AI-native creative economy. We use South Africa as a case study, but the conversation is relevant to anyone who wants to turn AI knowledge into real opportunities.",
    date: "2026-04-20",
    event: "FabAcademic Unfiltered [Prof Mamokgethi Phakeng]",
    videoUrl: "https://www.youtube.com/embed/kYmRkidbimo",
  },
  {
    id: 11,
    title: "Session 5.12: Your free digital assistant",
    description: "A live, practical demonstration of using AI as your digital assistant — no theory, no jargon. I show how Claude Cowork can handle your admin for you, freeing up time to focus on high-value work.",
    date: "2026-04-13",
    event: "FabAcademic Unfiltered [Prof Mamokgethi Phakeng]",
    videoUrl: "https://www.youtube.com/embed/c1pWhJKn0jg",
  },
  {
    id: 10,
    title: "Session 5.11: AI as a knowledge equaliser",
    description: "A real case study on how ordinary people from marginalised communities are already using AI to learn new skills, create opportunities, and transform their lives — no theory, no hype, just evidence.",
    date: "2026-03-30",
    event: "FabAcademic Unfiltered [Prof Mamokgethi Phakeng]",
    videoUrl: "https://www.youtube.com/embed/uls_eef97ds",
  },
  {
    id: 9,
    title: "Session 5.10: Learning a new skill with AI 2.0",
    description: "Continuing the series on using AI to accelerate learning — this session explores advanced techniques for acquiring new skills with AI tools.",
    date: "2026-03-22",
    event: "FabAcademic Unfiltered [Prof Mamokgethi Phakeng]",
    videoUrl: "https://www.youtube.com/embed/U9ZtGwCjlDU",
  },
  {
    id: 8,
    title: "Session 5.8: How to use AI to learn a new skill - data analytics",
    description: "A hands-on session showing how to use AI to learn data analytics from scratch — breaking down the learning process into practical, AI-assisted steps.",
    date: "2026-03-08",
    event: "FabAcademic Unfiltered [Prof Mamokgethi Phakeng]",
    videoUrl: "https://www.youtube.com/embed/njv5ZVhvSUM",
  },
  {
    id: 7,
    title: "Session 5.7: Your AI Skill Coach - Building Agents to Accelerate Your Career",
    description: "Building AI agents that act as personal skill coaches — helping you identify gaps, create learning plans, and accelerate your career development.",
    date: "2026-03-01",
    event: "FabAcademic Unfiltered [Prof Mamokgethi Phakeng]",
    videoUrl: "https://www.youtube.com/embed/k2iKehY8Zq0",
  },
  {
    id: 6,
    title: "Building your personal AI Assistant to get jobs, scholarships & study opportunities",
    description: "If you are still manually searching for jobs in 2026, you are already behind. Today we build a personal AI assistant that finds jobs, tracks scholarships and helps you apply properly.",
    date: "2026-02-22",
    event: "FabAcademic Unfiltered [Prof Mamokgethi Phakeng]",
    videoUrl: "https://www.youtube.com/embed/pGqiz1vp6i4",
  },
  {
    id: 5,
    title: "Building AI Agents for township businesses with no coding knowledge",
    description: "AI doesn't need to be complicated to be powerful. In this session I'm joined by Thabang, an AI & Data Scientist who is making AI simple, practical, and accessible for all.",
    date: "2026-02-15",
    event: "FabAcademic Unfiltered [Prof Mamokgethi Phakeng]",
    videoUrl: "https://www.youtube.com/embed/jnklbzfZjNw",
  },
  {
    id: 1,
    title: "Session 5.4: AI Agents for online shopping",
    description: "AI is evolving fast. The next phase is AI agents that can work for you. If you want to understand the future of online shopping, business operations and decision-making then this conversation is relevant for you.",
    date: "2026-02-08",
    event: "FabAcademic Unfiltered [Prof Mamokgethi Phakeng]",
    videoUrl: "https://www.youtube.com/embed/SsvfCIOL16Q",
    slidesUrl: "https://notebooklm.google.com/notebook/7aeffeae-ba0f-4cf5-a227-3e4c73352f94?artifactId=c9dbfab2-c0d8-460d-81d9-411b0593249b",
    slidesLabel: "View Notes",
  },
  {
    id: 2,
    title: "Scientists have discovered 300,000 new galaxies",
    description: "Scientists have discovered 300,000 new galaxies in a recent study. This discovery has significant implications for our understanding of the universe.",
    date: "2019-03-10",
    event: "SABC News Interview",
    videoUrl: "https://www.youtube.com/embed/ghs_9Qqb_wA",
  },
  {
    id: 3,
    title: 'Frenzy Interview Preview: "We talked all things Space"',
    description: "In this interview with Frenzy, we discussed all things space, including the latest discoveries, the future of space exploration, and how AI is being used to analyze space data.",
    date: "2019-02-02",
    event: "Crazy TV Interview",
    videoUrl: "https://www.youtube.com/embed/961zYJHuklg",
  },
  {
    id: 4,
    title: "Follow me Turtle Bot Project",
    description: "Our follow me turtle bot project, used python and ROS to design turtle-bot that follows an object. This was done at the Witwatersrand University school of Computer Science and Applied Mathematics.",
    date: "2017-12-16",
    event: "Wits University Honours Project",
    videoUrl: "https://www.youtube.com/embed/yjbHcEru0u8",
  },
]

// --- Writings / Press ---

export const WRITINGS: Writing[] = [
  {
    id: 1,
    title: 'An early warning system could be an answer to fatalities in SA mines',
    description: 'The DSIDE programme at the University of the Witwatersrand has been instrumental in developing innovative solutions to address challenges in South Africa.',
    link: 'https://mg.co.za/article/2018-02-09-00-students-in-dside-programme-come-up-with-innovative-solutions',
    date: '2018-01',
    image: '/posts/dside-mg-2018.jpeg',
  },
  {
    id: 2,
    title: 'Youth Explorer: Data-Driven Insights for Youth Employment',
    description: 'Youth Explorer uses data collected in Census 2011 on challenges facing the youth, enabling researchers and policy-makers to focus on areas of concern.',
    link: 'https://web.archive.org/web/20250628211217/https://www.dsti.gov.za/images/dst_newsletter_march_2018_web.pdf',
    date: '2018-01',
    image: null,
  },
]

// --- Publications ---

export const SEMANTIC_SCHOLAR_AUTHOR_ID = '1419516441'

export interface Publication {
  title: string
  authors: string
  venue: string
  year: number
  citations?: number
  scholarUrl: string
  semanticScholarId?: string
  doi?: string
  aiSummary: string
  applications: string[]
}

export const PUBLICATIONS: Publication[] = [
  {
    title: 'Mine workers threshold shift estimation via optimization algorithms for deep recurrent neural networks',
    authors: 'MCI Madahana, JED Ekoru, TL Mashinini, OTC Nyandoro',
    venue: 'IFAC-PapersOnLine 52 (14), 117-122',
    year: 2019,
    citations: 10,
    scholarUrl: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=aLjffFkAAAAJ&citation_for_view=aLjffFkAAAAJ:u5HHmVD_uO8C',
    semanticScholarId: 'e1e1b14c8862a9e73b79ca06f3756e7c1f5d1057',
    doi: '10.1016/j.ifacol.2019.09.174',
    aiSummary: 'Uses deep recurrent neural networks with optimization algorithms to estimate hearing threshold shifts in mine workers caused by noise exposure. The model predicts permanent hearing damage progression, enabling earlier intervention.',
    applications: ['Occupational health monitoring', 'Mining safety systems', 'Predictive hearing loss detection', 'Industrial noise management'],
  },
  {
    title: 'Noise level policy advising system for mine workers',
    authors: 'MCI Madahana, JED Ekoru, TL Mashinini, OTC Nyandoro',
    venue: 'IFAC-PapersOnLine 52 (14), 249-254',
    year: 2019,
    citations: 8,
    scholarUrl: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=aLjffFkAAAAJ&citation_for_view=aLjffFkAAAAJ:d1gkVwhDpl0C',
    semanticScholarId: '8e3e6948efbd0f5c392eecba48085724579d39db',
    doi: '10.1016/j.ifacol.2019.09.195',
    aiSummary: 'Proposes an intelligent policy advising system that recommends noise exposure limits for mine workers. Combines real-time noise monitoring with ML models to generate actionable safety policies that comply with occupational health regulations.',
    applications: ['Mining regulatory compliance', 'Real-time safety policy generation', 'Occupational noise control', 'Workplace health AI systems'],
  },
  {
    title: 'Long-range seasonal forecasting of 2m-temperature with machine learning',
    authors: 'EE Vos, A Gritzman, S Makhanya, T Mashinini, CD Watson',
    venue: 'arXiv preprint arXiv:2102.00085',
    year: 2021,
    citations: 8,
    scholarUrl: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=aLjffFkAAAAJ&citation_for_view=aLjffFkAAAAJ:UeHWp8X0CEIC',
    semanticScholarId: '7655474fe5524b7e1aa5ebeb9de6a7464f3eb8bc',
    aiSummary: 'Developed ML models for long-range seasonal temperature forecasting, outperforming traditional numerical weather prediction at extended lead times. Published during IBM Research Africa tenure, integrated into climate intelligence workflows.',
    applications: ['Climate risk assessment', 'Agricultural planning', 'Energy demand forecasting', 'Insurance & reinsurance modeling'],
  },
  {
    title: 'Learning Level Set Method by Echo State Network for Image Segmentation',
    authors: 'TL Mashinini',
    venue: 'MSc Thesis, University of the Witwatersrand, 2022',
    year: 2022,
    scholarUrl: 'https://wiredspace.wits.ac.za/items/2c23f3d9-05fd-410e-ad52-31ecffbbf643',
    aiSummary: 'Proposes a novel approach using Echo State Networks for learning variational level set segmentation as a spatiotemporal method. Compares ESN, RNN, GRU, LSTM, and 3D CNN architectures. Found that leaking rate and spectral radius critically influence ESN performance.',
    applications: ['Medical image segmentation', 'Autonomous vehicle vision', 'Satellite imagery analysis', 'Real-time object detection'],
  },
]

// --- Tech Stack ---

export const TECH_STACK: TechItem[] = [
  // ML & AI
  { name: 'PyTorch', category: 'ml-ai', icon: 'Pytorch' },
  { name: 'TensorFlow', category: 'ml-ai', icon: 'Tensorflow' },
  { name: 'MLflow', category: 'ml-ai', icon: 'Mlflow' },
  // Data Engineering
  { name: 'Databricks', category: 'data-engineering', icon: 'Databricks' },
  { name: 'Apache Spark', category: 'data-engineering', icon: 'Spark' },
  { name: 'Apache Flink', category: 'data-engineering', icon: 'Flink' },
  { name: 'Kafka', category: 'data-engineering', icon: 'Kafka' },
  { name: 'Airflow', category: 'data-engineering', icon: 'Airflow' },
  // Languages
  { name: 'Python', category: 'languages', icon: 'Python' },
  { name: 'TypeScript', category: 'languages', icon: 'Typescript' },
  { name: 'Go', category: 'languages', icon: 'go' },
  { name: 'Java', category: 'languages', icon: 'Java' },
  { name: 'C++', category: 'languages', icon: 'C++' },
  // Web
  { name: 'React', category: 'web', icon: 'React' },
  { name: 'Next.js', category: 'web', icon: 'Next' },
  { name: 'FastAPI', category: 'web', icon: 'Python' },
  { name: 'Node.js', category: 'web', icon: 'Node' },
  // Infrastructure
  { name: 'PostgreSQL', category: 'infrastructure', icon: 'SQL' },
  { name: 'AWS', category: 'infrastructure', icon: 'AWS' },
  { name: 'Docker', category: 'infrastructure', icon: 'Docker' },
  { name: 'Kubernetes', category: 'infrastructure', icon: 'Kubernates' },
  // DevOps
  { name: 'Git', category: 'devops', icon: 'Git' },
]

// --- Skill → Icon mapping (maps project skill names to /public/icons/ SVG filenames) ---

export const SKILL_ICON_MAP: Record<string, string> = {
  'Python': 'Python',
  'TypeScript': 'Typescript',
  'JavaScript': 'Javascript',
  'Java': 'Java',
  'C++': 'C++',
  'Go': 'go',
  'Rust': 'go', // no rust icon, fallback
  'React': 'React',
  'Next.js': 'Next',
  'Node.js': 'Node',
  'Tailwind CSS': 'Tailwind',
  'HTML': 'Google Chrome',
  'CSS': 'Google Chrome',
  'HTML/CSS': 'Google Chrome',
  'PyTorch': 'Pytorch',
  'TensorFlow': 'Tensorflow',
  'Scikit-Learn': 'Scikit',
  'MLflow': 'Mlflow',
  'NumPy': 'Python',
  'SciPy': 'Python',
  'Pandas': 'Python',
  'Dask': 'Dask',
  'Apache Spark': 'Spark',
  'PySpark': 'Spark',
  'Apache Flink': 'Flink',
  'PyFlink': 'Flink',
  'Kafka': 'Kafka',
  'Airflow': 'Airflow',
  'Databricks': 'Databricks',
  'Docker': 'Docker',
  'Kubernetes': 'Kubernates',
  'Git': 'Git',
  'PostgreSQL': 'SQL',
  'MongoDB': 'Mongo',
  'Redis': 'Redis',
  'MySQL': 'SQL',
  'SQL Server': 'SQL',
  'AWS': 'AWS',
  'Firebase': 'Firebase',
  'IBM Cloud': 'AWS',
  'IBM PAIRS': 'AWS',
  'Spark': 'Spark',
  'YAML': 'vscode',
  'CI/CD': 'Git',
  'GitLab CI': 'Git',
  'PyPI': 'Python',
  'CVXPY': 'Python',
  'Hadoop': 'Spark',
  'GeoPandas': 'Python',
  'Dash': 'Python',
  'Plotly': 'Python',
  'Folium': 'Python',
  'Leaflet': 'Javascript',
  'Django': 'Python',
  'PowerBI': 'vscode',
  'Image Processing': 'Pytorch',
  'Deep Learning': 'Pytorch',
  'PCA': 'Scikit',
  'SVM': 'Scikit',
  'Random Forest': 'Scikit',
  'GitHub Pages': 'Git',
  'FastAPI': 'Python',
  'Claude API': 'vscode',
  'Twilio': 'vscode',
  'Supabase': 'SQL',
  'Playwright': 'Google Chrome',
  'BeautifulSoup': 'Python',
}

// --- Repo → Category mapping (for GitHub calendar filtering) ---

export const REPO_CATEGORY_MAP: Record<string, Project['category']> = {
  // open-source
  'ubunye-ai-ecosystems/tfilterspy': 'open-source',
  'ubunye-ai-ecosystems/ubunye_engine': 'open-source',
  'ubunye-ai-ecosystems/.github': 'open-source',
  'Kasilam-Projects/.github': 'open-source',
  // social-impact
  'LeparaLaMapara/uniapplytest': 'social-impact',
  'LeparaLaMapara/Uniapply-old': 'social-impact',
  // research
  'LeparaLaMapara/ESNIterativeSegmentation': 'research',
  // education
  'LeparaLaMapara/DSIDE': 'education',
  'LeparaLaMapara/Wits-Recommendation-System': 'education',
}

// --- Category labels ---

export const TECH_CATEGORIES: Record<TechItem['category'], string> = {
  'ml-ai': 'ML & AI',
  'data-engineering': 'Data Engineering',
  'languages': 'Languages',
  'web': 'Web',
  'infrastructure': 'Infrastructure',
  'devops': 'DevOps',
}

// --- Courses ---

export interface Course {
  slug: string
  title: string
  subtitle: string
  description: string
  tier: 'zero-code' | 'specialized'
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  format: string
  modules: string[]
  whoIsItFor: string[]
  status: 'coming-soon' | 'open' | 'full'
  waitlistCount: number
}

export const COURSES: Course[] = [
  // ── Zero Code Courses ──
  {
    slug: 'ai-agents-no-code',
    title: 'AI Agents for Everyone',
    subtitle: 'Build practical AI assistants, no coding required',
    description: 'Learn to build AI agents that automate real tasks: job hunting, research, scheduling, and business operations. The same approach I demonstrated on FabAcademic with Prof Phakeng.',
    tier: 'zero-code',
    level: 'Beginner',
    duration: '4 weeks',
    format: 'Online, live sessions + recordings',
    modules: [
      'What AI agents actually are (no hype)',
      'Building your first agent with Claude & ChatGPT',
      'Automating job search & applications',
      'AI agents for small business operations',
      'Connecting agents to WhatsApp & email',
      'Responsible AI use & limitations',
    ],
    whoIsItFor: [
      'Students looking for jobs or scholarships',
      'Small business owners wanting to automate',
      'Anyone curious about AI, zero coding needed',
    ],
    status: 'coming-soon',
    waitlistCount: 0,
  },
  {
    slug: 'ai-productivity-mastery',
    title: 'AI Productivity Mastery',
    subtitle: 'Use AI to 10x your daily workflow. No code, just results',
    description: 'A hands-on course for professionals who want to use AI tools to write better, research faster, manage projects, and make decisions with data. No programming. Just practical skills you can use on Day 1.',
    tier: 'zero-code',
    level: 'Beginner',
    duration: '3 weeks',
    format: 'Online, live sessions + recordings',
    modules: [
      'Prompt engineering that actually works',
      'AI-powered writing, editing & content creation',
      'Research & analysis with AI assistants',
      'Automating repetitive tasks with Zapier + AI',
      'AI for presentations, proposals & reports',
      'Building a personal AI workflow stack',
    ],
    whoIsItFor: [
      'Professionals who want to work smarter with AI',
      'Managers, consultants, and freelancers',
      'Anyone overwhelmed by AI tools but ready to start',
    ],
    status: 'coming-soon',
    waitlistCount: 0,
  },

  // ── Specialized Courses ──
  {
    slug: 'agentic-engineering-claude-code',
    title: 'Agentic Engineering with Claude Code',
    subtitle: 'Build, ship, and orchestrate AI agents from the terminal',
    description: 'Master Claude Code as your AI pair programmer. Learn to build full applications, automate complex workflows, and orchestrate multi-step agents, all from the command line. Based on how I actually build software daily.',
    tier: 'specialized',
    level: 'Intermediate',
    duration: '5 weeks',
    format: 'Online, live sessions + recordings',
    modules: [
      'Claude Code deep dive: setup, config, and power-user workflows',
      'Building full-stack apps with agentic pair programming',
      'Prompt engineering for code generation at scale',
      'Custom slash commands, hooks, and MCP servers',
      'Multi-agent orchestration with Claude Agent SDK',
      'Deploying and monitoring agentic applications',
      'Real project: build and ship an AI-powered tool end-to-end',
    ],
    whoIsItFor: [
      'Developers who want to 10x their output with AI',
      'Engineers curious about agentic development workflows',
      'Anyone building with Claude who wants to go deeper',
    ],
    status: 'coming-soon',
    waitlistCount: 0,
  },
  {
    slug: 'mcp-agentic-infrastructure',
    title: 'MCP & Agentic Infrastructure',
    subtitle: 'Build the connective tissue between AI agents and real systems',
    description: 'The Model Context Protocol is how AI agents talk to databases, APIs, and tools. Learn to build MCP servers, design tool schemas, and create production-grade agentic infrastructure that connects AI to everything.',
    tier: 'specialized',
    level: 'Advanced',
    duration: '4 weeks',
    format: 'Online, live sessions + recordings',
    modules: [
      'MCP protocol deep dive: architecture, transports, and lifecycle',
      'Building your first MCP server (TypeScript & Python)',
      'Designing tool schemas that agents actually use well',
      'Connecting agents to databases, APIs, and file systems',
      'Authentication, rate limiting, and security for MCP',
      'Multi-server orchestration and tool composition',
      'Real project: production MCP server for a real-world use case',
    ],
    whoIsItFor: [
      'Backend engineers building AI-powered infrastructure',
      'Platform teams enabling agentic workflows',
      'Developers who want to understand the future of AI tooling',
    ],
    status: 'coming-soon',
    waitlistCount: 0,
  },
  {
    slug: 'codex-gemini-multi-agent',
    title: 'Multi-Agent Development: Codex, Gemini & Beyond',
    subtitle: 'Master every agentic coding tool and know when to use which',
    description: 'Not every agent is the same. Learn the strengths of OpenAI Codex CLI, Google Gemini CLI, Cursor, and Claude Code. Build workflows that combine multiple agents for maximum velocity. The polyglot approach to agentic engineering.',
    tier: 'specialized',
    level: 'Intermediate',
    duration: '4 weeks',
    format: 'Online, live sessions + recordings',
    modules: [
      'The agentic landscape: Claude Code vs Codex vs Gemini vs Cursor',
      'OpenAI Codex CLI deep dive: strengths and workflows',
      'Google Gemini CLI deep dive: strengths and workflows',
      'Cursor as an agentic IDE: rules, context, and composer',
      'Building hybrid workflows: the right agent for the right task',
      'Cost analysis and token optimization across providers',
      'Real project: multi-agent pipeline for a complex feature',
    ],
    whoIsItFor: [
      'Developers already using one AI tool who want to master all of them',
      'Tech leads evaluating agentic tools for their team',
      'Engineers who want the competitive edge of multi-agent workflows',
    ],
    status: 'coming-soon',
    waitlistCount: 0,
  },
  {
    slug: 'production-ml-systems',
    title: 'Production ML Systems',
    subtitle: 'From notebooks to production. The engineering you need',
    description: 'The course I wish existed when I moved from research to industry. How to build ML systems that survive real data, real users, and real organizational constraints. Based on lessons from Vodacom, ABSA, and IBM.',
    tier: 'specialized',
    level: 'Advanced',
    duration: '6 weeks',
    format: 'Online, live sessions + recordings',
    modules: [
      'Why notebooks fail in production',
      'ML pipelines with Spark & Databricks',
      'Feature engineering at scale',
      'Model serving & monitoring',
      'CI/CD for ML (MLOps fundamentals)',
      'Building config-driven frameworks (Ubunye Engine approach)',
    ],
    whoIsItFor: [
      'Data scientists tired of their models never deploying',
      'ML engineers building enterprise systems',
      'Senior devs moving into ML platform roles',
    ],
    status: 'coming-soon',
    waitlistCount: 0,
  },
]

export const PROJECT_CATEGORIES: Partial<Record<Project['category'], string>> = {
  'open-source': 'Open Source',
  'insurance': 'Insurance',
  'telecoms': 'Telecoms',
  'research': 'Research',
  'education': 'Education',
  'social-impact': 'Community',
}

// --- Bio content ---

export const BIO = {
  name: 'Thabang Mashinini-Sekgoto',
  location: 'Johannesburg, South Africa',
  title: 'Lead Data Scientist (Acting Head of Data Science), ABSA Insurance',
  /**
   * The one line that says what the work is, used wherever the site has to
   * introduce the discipline rather than the employer. Kept as one string so
   * the homepage, the metadata and the machine readable files cannot drift
   * apart from each other.
   */
  disciplines: 'Applied AI · Data Science · AI Engineering · Research',
  shortBio: `I have spent nine years building and deploying data and AI systems inside real organisations, across banking and insurance, telecommunications and research. That work kept surfacing the same problem: moving data science out of experimentation and into systems that run reliably. My work now spans data science, AI engineering, applied research and reusable open source infrastructure.`,
  philosophy: 'Strive to build things that make a difference.',
  hobbies: [
    { emoji: '🎥', label: 'Photography & Filmmaking' },
    { emoji: '🎶', label: 'Music Production' },
    { emoji: '🌍', label: 'Calisthenics & Exploring' },
    { emoji: '🪂', label: 'Skydiving' },
    { emoji: '🏁', label: 'Drag Racing' },
  ],
  github: 'LeparaLaMapara',
}

// --- Testimonials ---

export interface Testimonial {
  name: string
  role: string
  quote: string
  context: 'impact' | 'teaching' | 'engineering'
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Jaco du Toit, Ph.D.',
    role: 'AI/ML & Data Team Lead, Vodacom',
    quote: 'Thabang was an integral member of my team for several years, during which we tackled numerous challenging data science problems together. His dedication and passion for solving complex problems are truly commendable. His technical knowledge in data science is impressive, with hands-on experience in Gaussian process models, graph algorithms, probabilistic graphical models, and traditional machine learning algorithms.',
    context: 'impact',
  },
  {
    name: 'Etienne Vos, Ph.D.',
    role: 'Research Scientist Manager, IBM',
    quote: 'It was evident from the start that Thabang is an exceptional and hard-working researcher driven by achieving the goals set before him. He always found a way to get a task done — he took initiative, made a decision, and executed on it with speed and to the best of his ability. It was an absolute pleasure to have worked with him.',
    context: 'teaching',
  },
  {
    name: 'Akram Zaytar, Ph.D.',
    role: 'Senior Research Scientist, Microsoft | GeoAI',
    quote: 'As a data scientist, he played an instrumental role in enhancing our data and prediction pipelines. He identified new sources of predictability and tested multiple hyper-parameter search strategies, which ultimately boosted the performance of our models. His attention to detail, willingness to collaborate, and strong communication abilities made him an invaluable teammate.',
    context: 'engineering',
  },
]

// --- Career timeline ---
// Shared source for the resume page and the interactive /career journey.
// Order: newest-first (matches the resume display). The 3D journey walks
// this in reverse so visitors move chronologically (oldest -> present).

export type MilestoneKind = 'education' | 'work' | 'research'

export interface CareerMilestone {
  period: string
  role: string
  org: string
  /** Short label rendered on the 3D monument */
  shortOrg: string
  description: string
  kind: MilestoneKind
  /** Brand accent token (maps to CSS color + hex in the 3D scene) */
  accent: 'synapse' | 'signal' | 'accent'
  /** Chapter / era flavour title for the interactive journey */
  era: string
  /** Standout achievement, surfaced as a callout */
  highlight: string
  /** Skill tags shown as chips */
  skills: string[]
}

export const CAREER_TIMELINE: CareerMilestone[] = [
  {
    period: 'In preparation',
    role: 'Doctoral research proposal',
    org: 'University of the Witwatersrand',
    shortOrg: 'Research',
    description: 'Proposal stage, not yet registered. The direction is physics-informed self-supervised learning for SAR-based flood extent mapping, with applications to insurance risk and data-scarce regions. It follows on from the MSc work on echo state networks for level set segmentation, and from the geospatial and climate risk systems built at IBM Research and in insurance.',
    kind: 'research',
    accent: 'signal',
    era: 'The Next Question',
    highlight: 'Proposed research: physics-informed self-supervised learning for SAR flood mapping',
    skills: ['Physics-Informed ML', 'Self-Supervised Learning', 'Remote Sensing', 'Hydrology'],
  },
  {
    period: 'Mar 2024 - Present',
    role: 'Lead Data Scientist (Acting Head of Data Science)',
    org: 'ABSA Insurance',
    shortOrg: 'ABSA',
    description: 'Leading the Insurance Data Science capability across underwriting, retention, fraud, telematics, and climate risk. Championed hyperpersonalisation processing 2M+ daily signals. Modernised the telematics platform using Ubunye Engine, reducing latency from 2 months to under 24 hours. Developed geospatial flood-risk models across 230,000+ properties.',
    kind: 'work',
    accent: 'synapse',
    era: 'Leading the Fleet',
    highlight: 'Telematics latency reduced to under 24 hours · 230k+ properties flood-risk modeled',
    skills: ['Enterprise AI', 'Databricks', 'Geospatial ML', 'AI Governance', 'MLOps', 'Ubunye Engine'],
  },
  {
    period: 'Nov 2021 - Mar 2024',
    role: 'Senior Data Scientist',
    org: 'Vodacom',
    shortOrg: 'Vodacom',
    description: 'Led a high-performing team of 10 data scientists/engineers. Architected the Smart Generator Optimisation platform across 15,000+ sites, saving ≈R1 billion. Built streaming pipelines processing 25M+ daily events using Kafka, PySpark, Kubernetes, and a custom PyFlink stream-processing framework.',
    kind: 'work',
    accent: 'synapse',
    era: 'Scaling the Network',
    highlight: '≈R1B annual operational savings · Vodacom Star Award',
    skills: ['Real-time Analytics', 'PyFlink', 'Kafka', 'PySpark', 'Kubernetes', 'Optimisation'],
  },
  {
    period: 'Apr 2020 - Nov 2021',
    role: 'Machine Learning Research Scientist',
    org: 'IBM Research',
    shortOrg: 'IBM',
    description: 'Developed machine learning and geospatial analytics for environmental and climate-risk applications. Built predictive systems with TensorFlow and distributed data platforms. Deployed climate-forecasting models into IBM PAIRS Geoscope platform. Contributed to the Gauteng COVID-19 risk-index dashboard.',
    kind: 'work',
    accent: 'synapse',
    era: 'The Climate Quest',
    highlight: 'ML on the IBM PAIRS Geospatial Platform & COVID-19 analytics',
    skills: ['TensorFlow', 'Geospatial', 'Climate Risk', 'IBM PAIRS'],
  },
  {
    period: 'Jun 2018 - Apr 2020',
    role: 'Data Scientist',
    org: 'Business Intelligence Services - University of the Witwatersrand',
    shortOrg: 'Wits BIS',
    description: 'Developed recommendation and analytics systems supporting institutional planning and student success. Built reporting and analytics workflows using Python, SQL, and Power BI. Developed a clustering-based recommendation engine generating over R2M annually in government subsidy. Trained 76+ staff and students.',
    kind: 'work',
    accent: 'synapse',
    era: 'The First Expedition',
    highlight: 'R2M+ annual government subsidy impact',
    skills: ['Recommendation Systems', 'Clustering', 'Analytics', 'Power BI'],
  },
  {
    period: '2018 - 2019',
    role: 'MSc in Computer Science (Distinction)',
    org: 'University of the Witwatersrand',
    shortOrg: 'MSc',
    description: 'Thesis: Learning Level Set Method by Echo State Network for Image Segmentation. Proposed a novel spatiotemporal deep-learning formulation of variational level set segmentation, benchmarking five recurrent and convolutional architectures.',
    kind: 'education',
    accent: 'signal',
    era: 'Mastering the Craft',
    highlight: 'Distinction · Echo State Networks for image segmentation',
    skills: ['Recurrent Neural Nets', 'Image Segmentation', 'Research'],
  },
  {
    period: 'Nov 2017 - Jan 2018',
    role: 'Data Scientist & Software Engineer',
    org: 'Council for Scientific and Industrial Research (CSIR)',
    shortOrg: 'CSIR',
    description: 'Developed predictive analytics and operational intelligence systems supporting municipalities. Built Django-based decision-support systems serving 17 municipalities (including Cape Town and Gauteng) to identify operational bottlenecks and improve service delivery.',
    kind: 'research',
    accent: 'accent',
    era: 'Setting Sail',
    highlight: 'Recognised by Mail & Guardian, CSIR & DST for innovation',
    skills: ['Predictive Analytics', 'Decision Support', 'Software Engineering', 'Django'],
  },
  {
    period: 'Mar 2017 - Nov 2017',
    role: 'System Analyst & Support',
    org: 'ZAR X',
    shortOrg: 'ZAR X',
    description: 'Provided systems analysis and operational support for a newly launched stock exchange serving 13,000+ clients, supporting trading platform stability during go-live and early operations.',
    kind: 'work',
    accent: 'synapse',
    era: 'Trading Floor',
    highlight: 'Operational support for a newly launched stock exchange serving 13,000+ clients',
    skills: ['Systems Analysis', 'Operational Support', 'Trading Platforms'],
  },
  {
    period: '2017',
    role: 'BSc Honours in Computer Science',
    org: 'University of the Witwatersrand',
    shortOrg: 'Honours',
    description: 'Project: Wildfire Estimation Using Kernel Density Estimators.',
    kind: 'education',
    accent: 'signal',
    era: 'The Trials',
    highlight: 'Wildfire estimation with kernel density estimators',
    skills: ['Machine Learning', 'Statistics', 'Kernel Density Estimation'],
  },
  {
    period: '2014 - 2016',
    role: 'BSc in Computational & Applied Mathematics and Astronomy',
    org: 'University of the Witwatersrand',
    shortOrg: 'BSc',
    description: 'Mathematical modelling, astrophysics, simulation, and numerical methods.',
    kind: 'education',
    accent: 'signal',
    era: 'Where It Began',
    highlight: 'Foundations in mathematics, astrophysics & simulation',
    skills: ['Applied Mathematics', 'Astronomy', 'Numerical Methods'],
  },
]