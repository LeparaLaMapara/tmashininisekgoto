// ============================================================
// The Neural Observatory — Data Layer
// All structured content for Thabang Mashinini-Sekgoto's portfolio
// ============================================================

// --- Types ---

export interface Project {
  slug: string
  title: string
  category: 'open-source' | 'telecoms' | 'banking' | 'research' | 'education' | 'social-impact'
  problem: string
  solution: string
  impact: string
  skills: string[]
  image: string
  ghLink?: string
  productLink?: string
  paperLink?: string
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
  email: 'thabangvisionstudios@gmail.com',
  scholar: 'https://scholar.google.com/citations?hl=en&authuser=1&user=aLjffFkAAAAJ',
  booking: 'https://calendar.app.google/JzUn4JQ2pnzmmjLx5',
} as const

// --- Typewriter Roles ---

export const TYPEWRITER_ROLES = [
  'AI Systems Architect',
  'Founder, Ubunye AI Ecosystems',
  'Distributed Systems Engineer',
  'ML Researcher, Wits University',
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
  // Open Source
  {
    slug: 'ubunye-ai-ecosystems',
    title: 'Ubunye AI Ecosystems (UAIE)',
    category: 'open-source',
    problem: 'ABSA lacked consistent ML/ETL standards, reusable engineering patterns, and scalable workflows.',
    solution: 'Built a modular open-source ecosystem providing declarative ETL engines, ML pipelines, feature stores, and YAML-driven orchestration.',
    impact: 'Accelerated model delivery, improved data quality, and uplifted engineering capability across teams.',
    skills: ['Python', 'Dask', 'Spark', 'YAML', 'Databricks', 'Docker', 'CI/CD'],
    image: '/projects/ubunye-ai.png',
    ghLink: 'https://github.com/ubunye-ai-ecosystems',
    productLink: 'https://ubunye-ai-ecosystems.github.io/ubunye_engine/',
  },
  {
    slug: 'tfilterspy',
    title: 'Tfilterspy: Bayesian Filtering Library',
    category: 'open-source',
    problem: 'IoT and telematics pipelines required robust filtering for noisy sensor data and real-time state estimation.',
    solution: 'Created an open-source Bayesian filtering library supporting Kalman, Particle, and Ensemble filters with distributed execution.',
    impact: 'Improved reliability of IoT forecasting, telematics scoring, and real-time analytics at scale.',
    skills: ['Python', 'NumPy', 'Dask', 'PyPI', 'CI/CD'],
    image: '/projects/tfilterspy.png',
    ghLink: 'https://github.com/ubunye-ai-ecosystems/tfilterspy',
    productLink: 'https://ubunye-ai-ecosystems.github.io/tfilterspy',
  },
  {
    slug: 'kasilam-digital',
    title: 'Kasilam Digital Platforms',
    category: 'social-impact',
    problem: 'Township businesses and individuals lack the technical skills and budget to build a web presence.',
    solution: 'A community non-profit initiative that uses AI to help people in townships build websites using plain English — powered by an easy-to-use template project requiring no coding knowledge.',
    impact: 'Empowering township entrepreneurs and community members to establish a digital presence with zero technical barriers.',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'AI', 'GitHub Pages'],
    image: '/projects/kasilam.png',
    ghLink: 'https://github.com/orgs/Kasilam-Projects/repositories',
    productLink: 'https://kasilamdigitialplatforms.vercel.app/',
  },
  // Professional & Research
  {
    slug: 'vodacom-smart-generators',
    title: 'Vodacom Smart Generators Optimization',
    category: 'telecoms',
    problem: 'Load-shedding caused fuel inefficiency, network downtime, and poor generator deployment decisions.',
    solution: 'Developed a constrained optimisation engine with real-time streaming analytics to prioritise generator dispatch.',
    impact: 'Reduced downtime by 5%, lowered operational costs by 30%, and supported R1B annual savings.',
    skills: ['PyFlink', 'Kafka', 'CVXPY', 'PySpark', 'Kubernetes', 'Docker', 'GitLab CI'],
    image: '/projects/smart-generators.png',
    productLink: 'https://www.vodacombusiness.co.za/business/solutions/internet-of-things/smart-generator-monitoring',
  },
  {
    slug: 'ibm-geospatial',
    title: 'IBM GeoSpatial Analytics Suites',
    category: 'research',
    problem: 'Enterprises required scalable geospatial intelligence for environmental, climate, and supply-chain risk.',
    solution: 'Built analytics workflows using IBM PAIRS to process multi-terabyte raster and vector datasets.',
    impact: "Integrated into IBM's Environmental Intelligence Suite for global environmental monitoring.",
    skills: ['IBM PAIRS', 'IBM Cloud', 'Airflow', 'Python', 'Hadoop', 'GeoPandas', 'TensorFlow'],
    image: '/projects/ibm-geospatial.png',
    ghLink: 'https://github.com/IBM/ibmpairs',
    productLink: 'https://www.ibm.com/products/environmental-intelligence-suite',
    paperLink: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=aLjffFkAAAAJ&citation_for_view=aLjffFkAAAAJ:UeHWp8X0CEIC',
  },
]

// --- Talks ---

export const TALKS: Talk[] = [
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
    image: 'https://mg.co.za/wp-content/uploads/2019/03/866bd2be-00-students-in-dside-programme-come-up-with-innovative-solutions.jpeg',
  },
  {
    id: 2,
    title: 'Youth Explorer: Data-Driven Insights for Youth Employment',
    description: 'Youth Explorer uses data collected in Census 2011 on challenges facing the youth, enabling researchers and policy-makers to focus on areas of concern.',
    link: 'https://www.dsti.gov.za/images/dst_newsletter_march_2018_web.pdf',
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

export const PROJECT_CATEGORIES: Record<Project['category'], string> = {
  'open-source': 'Open Source',
  'telecoms': 'Telecoms',
  'banking': 'Banking',
  'research': 'Research',
  'education': 'Education',
  'social-impact': 'Social Impact',
}

// --- Bio content ---

export const BIO = {
  name: 'Thabang Mashinini-Sekgoto',
  location: 'Johannesburg, South Africa',
  title: 'Lead Data Scientist · AI & Analytics Engineering Leader',
  shortBio: `Data Science and AI leader with 10+ years of experience delivering enterprise-scale analytics, ML, and AI solutions across banking, telecoms, research, and education.`,
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