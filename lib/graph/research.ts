/**
 * Research lines: first class records for work that used to exist only as
 * rows in the papers section of /research.
 *
 * A research line is the unit a person searches for ("reservoir computing for
 * image segmentation"), not a single paper. It gathers the question, the
 * method, what was found, what was not, the code and the publications, and it
 * gets its own page at /research/<slug> when there is enough evidence to fill
 * one (`page: true`). Lines without that evidence are still listed on
 * /research with their status, so the record is complete without inventing
 * a page's worth of prose.
 *
 * Evidence rules. Every field states only what its source says, and the
 * source is recorded in `provenance`. Fields with no evidence are left out
 * rather than filled. Findings are the source's own findings; applications
 * and implications are labelled as such and never presented as results.
 */

export type ResearchStatus = 'completed' | 'published' | 'proposed'

export interface ResearchSoftware {
  name: string
  href: string
  note: string
}

export interface ResearchLine {
  slug: string
  /** Full name of the research line. */
  name: string
  /** Page title and H1: names the subject, under 60 characters. */
  headline: string
  /** Meta description, under 160 characters. */
  summary: string
  status: ResearchStatus
  /** Human readable period, exactly as the evidence supports it. */
  period: string
  /** ISO year the work was first made public, for structured data. */
  year?: number
  /** Organisation slug from lib/graph/organizations.ts, when the evidence names one. */
  organization?: string
  /** What Thabang's part was, verb precise. */
  role: string
  /** Named collaborators from the author lists. */
  collaborators?: string[]
  question?: string
  approach?: string
  datasets?: string[]
  /** The source's own findings. */
  findings?: string[]
  limitations?: string
  /** Possible uses, stated as possibilities, never as results. */
  implications?: string
  /** Publication keys from lib/data.ts. */
  publications: string[]
  software: ResearchSoftware[]
  /** Project slugs from lib/data.ts that this research fed into or came from. */
  relatedProjects: string[]
  /** Topic slugs from lib/graph/topics.ts. */
  topics: string[]
  /** What came before and after, in the author's own record. */
  lineage?: { before?: string; after?: string }
  /** Where each statement above comes from. */
  provenance: { label: string; href: string }[]
  /** Whether there is enough evidence for a page of its own. */
  page: boolean
}

export const RESEARCH: ResearchLine[] = [
  {
    slug: 'echo-state-networks-level-set-segmentation',
    name: 'Learning level set image segmentation with echo state networks',
    headline: 'Echo state networks for level set image segmentation',
    summary:
      'MSc research at Wits: can recurrent models learn the iterative evolution of a level set segmentation? Echo state networks against trained RNN, LSTM and GRU.',
    status: 'completed',
    period: 'MSc at Wits, 2018 to 2019',
    year: 2019,
    organization: 'wits',
    role: 'MSc candidate and sole author of the dissertation',
    question:
      'The level set method segments an image by evolving a curve under a partial differential equation, one iteration at a time. The dissertation asked whether that iterative evolution can be treated as a spatiotemporal sequence and learned by recurrent neural networks, and in particular whether an echo state network, a reservoir computing model whose recurrent weights are fixed at random and never trained, can learn it as well as recurrent networks trained end to end.',
    approach:
      'Level set evolutions were generated in MATLAB from four image datasets and used as training sequences. Five models were compared on learning the evolution: a convolutional echo state network, and convolutional RNN, LSTM and GRU models and a 3D CNN, all trained with backpropagation. Hyperparameters were searched in parallel runs tracked with TensorBoard, and results were compared on intersection over union and F1 score. A separate set of experiments varied the reservoir itself: leaking rate, spectral radius, reservoir size and sparsity.',
    datasets: [
      'Weizmann Segmentation Database (200 images)',
      'Berkeley Segmentation Data Set (BSD500)',
      'CIFAR-10',
      'CIFAR-100',
    ],
    findings: [
      'The trained gated models did best. The convolutional GRU outperformed the other models on the Weizmann, BSD and CIFAR-100 experiments, and the convolutional LSTM on CIFAR-10.',
      'The echo state network did not outperform the trained recurrent models under the conditions tested. On the two small datasets it did no better than random, which the dissertation attributes to reservoir parameters that did not satisfy the echo state property.',
      'The trained models improved as the datasets grew. The echo state network had its best results on the largest dataset, CIFAR-100, though they were still not the best of the five.',
      'Raising the leaking rate improved IoU and F1, and raising the spectral radius slightly reduced them, which the dissertation reads as the reservoir treating level set evolution as a short term memory problem.',
      'Larger reservoirs improved performance, and 80% sparsity made reservoir updates cheap at the cost of capacity.',
      'Training the echo state network was fast because it needs no backpropagation, but finding reservoir parameters that work required a search the trained models did not.',
    ],
    limitations:
      'Echo state network performance was sensitive to its hyperparameters, and the dissertation notes that the best reservoir settings are task specific. The CIFAR experiments were capped at 10 million generated examples because of compute limits. The per dataset detail here is taken from the thesis source in the public code repository and agrees with the deposited abstract, which names the convolutional GRU and LSTM as the best architectures and the leaking rate and spectral radius as the main causes of the low performance of the echo state network. The deposited dissertation on WIReDSpace is the authoritative text.',
    implications:
      'A negative result with a useful shape: for this task a cheap untrained reservoir is not a drop in replacement for a trained gated network, and the leaking rate and spectral radius are where the difference lies.',
    publications: ['esn-level-set-segmentation-msc'],
    software: [
      {
        name: 'ESNIterativeSegmentation',
        href: 'https://github.com/LeparaLaMapara/ESNIterativeSegmentation/tree/master',
        note: 'Models, data generation scripts, notebooks and the thesis source. The code is on the master branch.',
      },
      {
        name: 'Echo-State-Master',
        href: 'https://github.com/LeparaLaMapara/Echo-State-Master',
        note: 'An earlier echo state network repository from 2019.',
      },
    ],
    relatedProjects: [],
    topics: [
      'echo-state-networks',
      'reservoir-computing',
      'recurrent-neural-networks',
      'image-segmentation',
      'level-set-method',
      'computer-vision',
      'deep-learning',
    ],
    lineage: {
      before:
        'A BSc in computational and applied mathematics and astronomy, and an honours project on wildfire estimation with kernel density estimators.',
      after:
        'The proposed doctoral research, at proposal stage and not registered, is described in the CV record as following on from this work.',
    },
    provenance: [
      { label: 'Dissertation record, WIReDSpace', href: 'https://hdl.handle.net/10539/33910' },
      { label: 'Code and thesis source', href: 'https://github.com/LeparaLaMapara/ESNIterativeSegmentation/tree/master' },
    ],
    page: true,
  },
  {
    slug: 'seasonal-climate-forecasting',
    name: 'Machine learning for long range seasonal climate forecasting',
    headline: 'Machine learning for seasonal climate forecasting',
    summary:
      'IBM Research work on forecasting 2m temperature and precipitation weeks to months ahead with machine learning, published at NeurIPS 2020 CCAI and EGU 2022.',
    status: 'published',
    period: '2020 to 2022, at IBM Research',
    year: 2020,
    organization: 'ibm-research',
    role: 'Co-author and machine learning research scientist',
    collaborators: [
      'EE Vos', 'A Gritzman', 'S Makhanya', 'CD Watson', 'MA Zaytar', 'B Zadrozny', 'D Salles Civitarese', 'TM Mathonsi',
    ],
    question:
      'A central challenge in seasonal climate prediction is whether a forecast can beat climatology, the long run average for that place and time of year. The work asked whether data driven models can do so for 2m temperature, and later for precipitation, at lead times of weeks to months.',
    approach:
      'The NeurIPS 2020 workshop paper tested two classes of model on predicting 2m temperature out to 52 weeks for six geographically diverse locations: a convolutional network, to use information related to teleconnections, and a recurrent network, to use long term historical signals. The EGU 2022 work built a daily probabilistic forecast of 2m temperature and total precipitation, combining physics based ensembles, climate modes and recent climatology as features for gradient boosting, U-Net and natural gradient boosting models.',
    findings: [
      'The 2020 models improved the accuracy of long range temperature forecasts up to a lead time of 30 weeks by correlation and 52 weeks by RMSE skill score, but only for select locations.',
      'The 2020 paper states that further work is needed for the models to add value beyond regions where climatology already has reduced correlation skill, namely the tropics.',
      'The 2022 abstract reports that the probabilistic model outperforms ECMWF 46 day forecasts and climatology.',
    ],
    limitations:
      'Skill in the 2020 work was location dependent. The 2022 result is a conference abstract rather than a peer reviewed paper.',
    implications:
      'Possible uses named in this line of work include climate risk assessment and agricultural and energy planning. These are applications, not results the papers demonstrate.',
    publications: ['seasonal-forecasting-2m-temperature', 'probabilistic-2m-temperature-precipitation'],
    software: [],
    relatedProjects: ['ibm-geospatial'],
    topics: ['seasonal-forecasting', 'climate-risk', 'time-series', 'recurrent-neural-networks', 'deep-learning', 'geospatial-ml'],
    lineage: {
      after:
        'Climate and geospatial risk continued in insurance, as flood and natural catastrophe risk models across more than 230,000 insured properties, and in the proposed doctoral research on flood mapping.',
    },
    provenance: [
      { label: 'NeurIPS 2020 CCAI workshop paper', href: 'https://www.climatechange.ai/papers/neurips2020/74' },
      { label: 'arXiv:2102.00085', href: 'https://arxiv.org/abs/2102.00085' },
      { label: 'EGU22-11063 abstract', href: 'https://meetingorganizer.copernicus.org/EGU22/EGU22-11063.html' },
    ],
    page: true,
  },
  {
    slug: 'mine-worker-noise-hearing-loss',
    name: 'Machine learning for noise induced hearing loss in mine workers',
    headline: 'Machine learning for hearing loss risk in mine workers',
    summary:
      'Two 2019 IFAC papers: a recurrent network estimating hearing threshold shift in mine workers, and a classifier based noise policy advising system.',
    status: 'published',
    period: '2019',
    year: 2019,
    role: 'Co-author (third of four authors on both papers)',
    collaborators: ['MCI Madahana', 'JED Ekoru', 'OTC Nyandoro'],
    question:
      'Noise exposure in mines causes permanent hearing damage. The two papers asked whether machine learning can estimate a worker\'s hearing threshold shift, and whether it can support decisions about which tasks to assign new employees given their hearing baseline.',
    approach:
      'The first paper used a recurrent neural network to estimate the hearing threshold shift of mining employees and compared optimisation methods for training it. The second clustered mine workers with K-means and compared logistic regression, support vector machines, decision trees and random forests for classifying new employees, with task recommendations based on each worker\'s baseline and predicted future threshold shift.',
    findings: [
      'The recurrent network predicted threshold shift with an accuracy of 95%, and the adaptive subgradient method (Adagrad) was preferred among the optimisers for its fast convergence.',
      'In the policy advising system the decision tree had the highest accuracy, 91.25% average on testing and 99.79% on training, while logistic regression generalised best on the test set.',
    ],
    limitations:
      'The first paper notes performance could improve with more inputs; the second lists a usable interface for mine administrators as future work.',
    implications:
      'The first paper suggests the results could be used to build an early intervention and monitoring system for mines. That is a stated possibility, not something the papers built.',
    publications: ['mine-threshold-shift-rnn', 'mine-noise-policy-advising'],
    software: [],
    relatedProjects: [],
    topics: ['noise-induced-hearing-loss', 'occupational-health', 'recurrent-neural-networks', 'machine-learning'],
    provenance: [
      { label: 'IFAC-PapersOnLine 52(14) 117 to 122, DOI 10.1016/j.ifacol.2019.09.174', href: 'https://doi.org/10.1016/j.ifacol.2019.09.174' },
      { label: 'IFAC-PapersOnLine 52(14) 249 to 254, DOI 10.1016/j.ifacol.2019.09.195', href: 'https://doi.org/10.1016/j.ifacol.2019.09.195' },
    ],
    page: true,
  },
  {
    slug: 'sar-flood-mapping-proposal',
    name: 'Physics informed self supervised learning for SAR flood mapping',
    headline: 'Proposed: self supervised flood mapping from radar',
    summary:
      'Proposed doctoral research, not yet registered: physics informed self supervised learning for flood extent mapping from synthetic aperture radar.',
    status: 'proposed',
    period: 'PhD in Computer Science at Wits, commencing 2027; proposal in preparation, not registered',
    organization: 'wits',
    role: 'Proposed doctoral researcher (not registered)',
    publications: [],
    software: [],
    relatedProjects: ['insurance-data-science-capability', 'ibm-geospatial'],
    topics: ['synthetic-aperture-radar', 'remote-sensing', 'climate-risk', 'geospatial-ml'],
    provenance: [{ label: 'CV', href: 'https://www.tmashininisekgoto.com/resume' }],
    page: false,
  },
  {
    slug: 'wildfire-kernel-density-estimation',
    name: 'Wildfire estimation using kernel density estimators',
    headline: 'Wildfire estimation with kernel density estimators',
    summary: 'BSc Honours project at Wits, 2017.',
    status: 'completed',
    period: '2017, BSc Honours at Wits',
    year: 2017,
    organization: 'wits',
    role: 'Honours student',
    publications: [],
    software: [],
    relatedProjects: [],
    topics: ['machine-learning'],
    provenance: [{ label: 'CV', href: 'https://www.tmashininisekgoto.com/resume' }],
    page: false,
  },
]

export function getResearch(slug: string): ResearchLine | undefined {
  return RESEARCH.find((r) => r.slug === slug)
}

export function getResearchWithPages(): ResearchLine[] {
  return RESEARCH.filter((r) => r.page)
}
