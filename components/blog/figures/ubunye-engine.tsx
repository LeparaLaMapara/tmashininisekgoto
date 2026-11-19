'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { FileCode2, FileSliders, FolderOpen } from 'lucide-react'
import { C, FigButton, Figure, useInView, useReducedMotion } from './towers-shared'

// Product labels and numbers come from FACTS.md and the revised brief.
// Result switchers show saved observations; they do not execute jobs.
function EngineFigure({ label, caption, children }: { label: string; caption: ReactNode; children: ReactNode }) {
  return (
    <div data-ubunye-figure={label} className="motion-reduce:[&_*]:transition-none [&>figure]:rounded-none [&>figure]:border-2 [&>figure]:border-ivory [&_button]:rounded-none [&_button]:text-sm [&_button]:tracking-normal">
      <Figure label={label} caption={caption}>{children}</Figure>
    </div>
  )
}

/** Only the small flow marker moves. Every label and result reads at rest. */
function useFlow() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const reduced = useReducedMotion()
  const [tick, setTick] = useState(0)
  useEffect(() => {
    if (!inView || reduced) return
    const timer = setInterval(() => setTick((t) => (t + 1) % 80), 60)
    return () => clearInterval(timer)
  }, [inView, reduced])
  return { ref, position: inView && !reduced ? tick / 80 : 0.5 }
}

function FlowLine({ position }: { position: number }) {
  return (
    <div aria-hidden="true" className="relative mx-4 my-4 h-0.5 bg-border">
      <span className="absolute -top-1 h-2.5 w-2.5 bg-signal" style={{ left: `${position * 96}%` }} />
      <span className="absolute -right-0.5 -top-1 h-2.5 w-2.5 rotate-45 border-r-2 border-t-2 border-ivory" />
    </div>
  )
}

export function UbunyeTaskFolder() {
  const { ref, position } = useFlow()
  return (
    <EngineFigure label="One folder. Your decisions." caption="You name the work. The engine carries it through.">
      <div ref={ref}>
        <div className="border-2 border-ivory p-3 sm:p-4">
          <div className="mb-4 flex items-start gap-2 text-sm text-ivory">
            <FolderOpen className="h-5 w-5 shrink-0 text-synapse-ink" aria-hidden="true" />
            <span className="break-all font-mono">demo/starter/filter_adults/</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="min-w-0 border border-border p-3">
              <FileSliders aria-hidden="true" className="mb-3 h-12 w-12 text-synapse-ink" />
              <p className="break-all font-mono text-sm text-ivory">config.yaml</p>
              <p className="mt-1 text-sm text-muted">What to read. Where to write.</p>
            </div>
            <div className="min-w-0 border border-border p-3">
              <FileCode2 aria-hidden="true" className="mb-3 h-12 w-12 text-synapse-ink" />
              <p className="font-mono text-[11px] sm:text-sm [overflow-wrap:anywhere] text-ivory">transformations.py</p>
              <p className="mt-1 text-sm text-muted">What to change.</p>
            </div>
          </div>
        </div>
        <FlowLine position={position} />
        <div className="grid grid-cols-3 gap-2 text-center text-sm text-ivory">
          {['Read', 'Transform', 'Write'].map((step) => <div key={step} className="border-2 border-ivory py-4">{step}</div>)}
        </div>
        <div className="mt-3 flex flex-wrap justify-center gap-2 text-sm text-signal">
          <span className="border border-border px-3 py-2">Data checks</span>
          <span className="border border-border px-3 py-2">Run record</span>
        </div>
      </div>
    </EngineFigure>
  )
}

const ROLES = [
  { name: 'Analyst', before: 'File scripts', after: 'A local task', detail: 'Use pandas and check the plan. No Java needed.' },
  { name: 'Data scientist', before: 'Notebook experiment', after: 'Recorded run', detail: 'Keep the experiment and its run record together.' },
  { name: 'Data engineer', before: 'Duplicate batches', after: 'Explicit reruns', detail: 'Use batch checks and Delta merge to handle reruns.' },
  { name: 'ML engineer', before: 'Unvetted version', after: 'Promotion gates', detail: 'Check stored model gates before promotion; keep rollback available.' },
  { name: 'AI engineer', before: 'Changing answers', after: 'Record and replay', detail: 'Use llm.port to replay recorded requests instead of asking the model again.' },
  { name: 'Research scientist', before: 'Two green jobs', after: 'Compared data', detail: 'Compare recorded inputs, output data, schemas and row counts with prove.' },
  { name: 'Team lead', before: 'Did it run?', after: 'Job health', detail: 'Query recorded status, last success and consecutive failures.' },
  { name: 'Platform engineer', before: 'Integration patches', after: 'Installed plugins', detail: 'Add connectors through package entry points and keep platform control of Spark sessions.' },
]

export function UbunyeRoles() {
  const [selected, setSelected] = useState(0)
  const role = ROLES[selected]
  return (
    <EngineFigure label="Find your starting point" caption="Choose the work you do.">
      <div className="mb-5 grid grid-cols-2 gap-2" role="group" aria-label="Your role">
        {ROLES.map((item, i) => <FigButton key={item.name} active={selected === i} onClick={() => setSelected(i)}>{item.name}</FigButton>)}
      </div>
      <div aria-live="polite" aria-atomic="true">
        <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2">
          <div className="flex items-center border border-border p-3 text-sm text-muted">{role.before}</div>
          <span aria-hidden="true" className="self-center text-xl text-muted">→</span>
          <div className="flex items-center border-2 border-signal p-3 text-sm font-semibold text-ivory">{role.after}</div>
        </div>
        <p className="mt-4 min-h-12 text-sm leading-relaxed text-muted">{role.detail}</p>
      </div>
    </EngineFigure>
  )
}

const ENGINES = ['pandas', 'Spark', 'Databricks']
const RESULTS = [
  { name: 'order_lines', rows: 10, hash: 'bdf06e41b7a9' },
  { name: 'country_summary', rows: 5, hash: '7cf3823ab7bd' },
]

export function UbunyeSameAnswer() {
  const [selected, setSelected] = useState(0)
  const { ref, position } = useFlow()
  return (
    <EngineFigure label="Same task. Recorded agreement." caption="Select a recorded C01 result. Hashes are shortened.">
      <div ref={ref}>
        <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Recorded backend">
          {ENGINES.map((engine, i) => <FigButton key={engine} active={selected === i} onClick={() => setSelected(i)}>{engine}</FigButton>)}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-2 border-ivory p-4 text-sm">
          <span className="font-mono text-ivory">C01 portable ETL</span>
          <span className="font-semibold text-synapse-ink" aria-live="polite">{ENGINES[selected]}</span>
        </div>
        <FlowLine position={position} />
        <div className="grid gap-3 sm:grid-cols-2">
          {RESULTS.map((result) => (
            <div key={result.name} className="border border-border p-3">
              <p className="break-all font-mono text-sm text-ivory">{result.name}</p>
              <p className="my-3 text-3xl font-bold text-ivory">{result.rows} <span className="text-sm font-normal text-muted">rows</span></p>
              <p className="font-mono text-sm text-signal">{result.hash}…</p>
            </div>
          ))}
        </div>
        <div className="mt-3 border-2 border-signal p-3">
          <p className="text-sm text-muted">Same workload digest</p>
          <p className="mt-1 break-all font-mono text-xl font-bold text-signal">bb08a7d7a9fd</p>
        </div>
      </div>
    </EngineFigure>
  )
}

const TIERS = [
  {
    title: 'Proven', note: 'Published comparison · 0.7.2 · September 2026', color: C.up,
    items: [['pandas', 'Local'], ['Spark', 'Local'], ['Kubernetes', 'Local kind'], ['AWS Glue', 'Glue 5.0'], ['GCP Dataproc', 'Serverless'], ['Azure Container Apps', 'Spark local mode'], ['Databricks', 'Serverless job']],
  },
  {
    title: 'Supported, not proven', note: 'An implemented or documented route', color: 'var(--color-accent-ink)',
    items: [['EMR Serverless', 'Plan only'], ['Spark clusters', 'spark-submit route'], ['Redshift', 'JDBC route']],
  },
  {
    title: 'Not yet or unknown', note: 'No proving run for these targets', color: C.muted,
    items: [['EMR / YARN', 'Untested'], ['SageMaker / Vertex AI', 'No serving adapters'], ['Synapse / Fabric', 'Unknown support']],
  },
]

export function UbunyeRuntimeMap() {
  return (
    <EngineFigure label="Where you can take the work" caption="Proof: 0.7.2, September 2026. The current release is 0.9.3.">
      <div className="space-y-6">
        {TIERS.map((tier) => (
          <div key={tier.title} className="border-l-4 pl-3 sm:pl-4" style={{ borderColor: tier.color }}>
            <p className="font-semibold text-ivory">{tier.title}</p>
            <p className="mb-3 mt-1 text-sm text-muted">{tier.note}</p>
            <div className="grid grid-cols-2 gap-2">
              {tier.items.map(([name, note]) => (
                <div key={name} className="min-w-0 border border-border p-3">
                  <p className="text-sm font-semibold text-ivory">{name}</p>
                  <p className="mt-1 text-sm text-muted">{note}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </EngineFigure>
  )
}

const STARTER_STEPS = [
  {
    name: 'Scaffold',
    command: 'ubunye init -d pipelines -u demo -p starter -t filter_adults',
    output: 'created: pipelines/demo/starter/filter_adults/data/people.csv\ncreated: pipelines/demo/starter/filter_adults/config.yaml\ncreated: pipelines/demo/starter/filter_adults/transformations.py\ncreated: pipelines/demo/starter/filter_adults/notebooks/filter_adults_dev.ipynb\n[OK] Scaffold complete',
  },
  {
    name: 'Plan',
    command: 'ubunye plan -d pipelines -u demo -p starter -t filter_adults --backend pandas',
    output: 'Plan OK: 1 task(s) can run.',
  },
  {
    name: 'Run',
    command: 'ubunye run -d pipelines -u demo -p starter -t filter_adults --backend pandas --lineage',
    output: 'Starting task: filter_adults (Mode: DEV, Deploy: client)\n[OK] Run complete for filter_adults',
  },
  {
    name: 'Record',
    command: 'ubunye lineage list -d pipelines -u demo -p starter -t filter_adults',
    output: 'RUN_ID     STARTED              STATUS        DUR  ROWS\nc4543843  2026-11-19T13:37:53  success  1.2s  in:8  out:5',
  },
]

export function UbunyeQuickstart() {
  const [selected, setSelected] = useState(3)
  const [playing, setPlaying] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (!playing || !inView || reduced) return
    const timer = setInterval(() => setSelected((s) => (s + 1) % STARTER_STEPS.length), 4500)
    return () => clearInterval(timer)
  }, [playing, inView, reduced])
  const step = STARTER_STEPS[selected]
  return (
    <EngineFigure label="Your first task, step by step" caption="Four commands. Recorded 0.9.3 output, excerpted. Press play to follow along.">
      <div ref={ref}>
        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Starter steps">
          {STARTER_STEPS.map((item, i) => <FigButton key={item.name} active={selected === i} onClick={() => { setPlaying(false); setSelected(i) }}>{item.name}</FigButton>)}
        </div>
        <div className="min-w-0 border-2 border-ivory bg-surface p-3 sm:p-4">
          <p className="mb-3 font-mono text-sm text-muted">Recorded terminal / {step.name}</p>
          <p className="whitespace-pre-wrap break-all font-mono text-sm leading-relaxed text-ivory">$ {step.command}</p>
          <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-signal">{step.output}</pre>
        </div>
        {!reduced && <div className="mt-4"><FigButton active={playing} onClick={() => setPlaying((p) => !p)}>{playing ? 'Pause walkthrough' : 'Play walkthrough'}</FigButton></div>}
      </div>
    </EngineFigure>
  )
}

// Conceptual views use the implemented paths in FACTS.md, not timings or promises.
export function UbunyeYourWeek() {
  const [gathered, setGathered] = useState(true)
  const { ref, position } = useFlow()
  const plumbing = ['Connections', 'Reads', 'Writes', 'Checks', 'Run record', 'Backend']
  return (
    <EngineFigure label="Your week, with room for your work" caption="The surrounding work gets a common home. Your decisions stay in two files.">
      <div ref={ref}>
        <div className="mb-5 flex flex-wrap gap-2">
          <FigButton active={!gathered} onClick={() => setGathered(false)}>Without it</FigButton>
          <FigButton active={gathered} onClick={() => setGathered(true)}>With Ubunye</FigButton>
        </div>
        <div className="relative h-60 overflow-hidden border border-border" aria-label={gathered ? 'Plumbing gathered into the engine beneath your two task files' : 'Separate blocks of plumbing around your work'}>
          {plumbing.map((name, i) => (
            <div key={name} className="absolute flex h-10 w-[42%] items-center justify-center border border-border bg-surface text-xs text-muted transition-all duration-700"
              style={{ left: `${gathered ? 29 : 5 + (i % 2) * 48}%`, top: gathered ? 169 : 15 + Math.floor(i / 2) * 51, opacity: gathered ? 0 : 1, transform: gathered ? 'scale(.25)' : `rotate(${i % 2 ? 3 : -3}deg)` }}>{name}</div>
          ))}
          <div className="absolute inset-x-4 top-5 grid grid-cols-2 gap-3 transition-all duration-700" style={{ opacity: gathered ? 1 : 0, transform: `translateY(${gathered ? 0 : -30}px)` }}>
            {[['config.yaml', 'Read · Write'], ['transformations\u200b.py', 'Change']].map(([name, note]) => <div key={name} className="min-w-0 border-2 border-ivory bg-surface p-3"><FileCode2 aria-hidden className="mb-4 h-10 w-10 text-synapse-ink" /><p className="font-mono text-[11px] sm:text-xs [overflow-wrap:anywhere] text-ivory">{name}</p><p className="mt-2 text-xs text-muted">{note}</p></div>)}
          </div>
          <div className="absolute inset-x-4 bottom-4 border-2 border-signal p-3 text-center font-semibold text-signal transition-opacity duration-700" style={{ opacity: gathered ? 1 : 0 }}>Ubunye Engine</div>
        </div>
        <FlowLine position={position} />
        <p className="text-center text-lg font-semibold text-ivory">Your question. Your change.</p>
      </div>
    </EngineFigure>
  )
}

export function UbunyeArchitecture() {
  const { ref, position } = useFlow()
  const nodes = [
    { x: 136, y: 6, name: 'ports.py', note: 'Contracts' },
    { x: 260, y: 86, name: 'backends/', note: 'Execute' },
    { x: 260, y: 224, name: 'adapters/', note: 'Mechanics' },
    { x: 136, y: 302, name: 'plugins/', note: 'Integrations' },
    { x: 12, y: 224, name: 'CLI · API', note: 'Entry paths' },
    { x: 12, y: 86, name: 'Task files', note: 'Your work' },
  ]
  return (
    <EngineFigure label="Small centre. Open edges." caption="Folders sit under ubunye/. The port definitions live in core/ports.py.">
      <div ref={ref}>
        <svg viewBox="0 0 400 368" className="h-auto w-full" role="img" aria-label="Core surrounded by ports, backends, adapters, plugins, entry paths and task files">
          <path d="M200 36 L324 116 L324 254 L200 332 L76 254 L76 116 Z" fill="none" stroke={C.border} strokeWidth="2" />
          {nodes.map((n) => <path key={n.name} d={`M200 184 L${n.x + 64} ${n.y + 30}`} stroke={C.border} />)}
          <rect x="134" y="146" width="132" height="76" fill="var(--color-surface)" stroke={C.up} strokeWidth="3" />
          <text x="200" y="179" textAnchor="middle" fontSize="22" fontWeight="700" fill={C.ink}>core/</text>
          <text x="200" y="202" textAnchor="middle" fontSize="15" fill={C.up}>Decisions</text>
          {nodes.map((n) => <g key={n.name}><rect x={n.x} y={n.y} width="128" height="60" fill="var(--color-surface)" stroke={C.ink} /><text x={n.x + 64} y={n.y + 25} textAnchor="middle" fontSize="16" fill={C.ink}>{n.name}</text><text x={n.x + 64} y={n.y + 46} textAnchor="middle" fontSize="14" fill={C.muted}>{n.note}</text></g>)}
          <rect x={194 + position * 102} y="111" width="9" height="9" fill={C.up} />
        </svg>
      </div>
    </EngineFigure>
  )
}

export function UbunyePluginPort() {
  const [installed, setInstalled] = useState(false)
  return (
    <EngineFigure label="A new connector. The same core." caption="The Iceberg test installs mock entry points. It proves extension, not a shipped Iceberg connector.">
      <div className="mb-5"><FigButton active={installed} onClick={() => setInstalled((s) => !s)}>{installed ? 'Remove test plugin' : 'Install test plugin'}</FigButton></div>
      <svg viewBox="0 0 360 240" className="h-auto w-full" role="img" aria-label={installed ? 'Mock Iceberg connector attached through entry points with core unchanged' : 'Mock Iceberg connector outside the engine'}>
        <rect x="12" y="123" width="336" height="104" fill="none" stroke={C.ink} strokeWidth="2" />
        <text x="180" y="191" textAnchor="middle" fontSize="21" fontWeight="600" fill={C.ink}>Engine core</text>
        <text x="180" y="213" textAnchor="middle" fontSize="15" fill={C.muted}>Zero edits</text>
        <path d="M146 123 V104 H214 V123" fill="var(--color-surface)" stroke={C.up} strokeWidth="3" />
        <g className="transition-transform duration-700" style={{ transform: `translateY(${installed ? 51 : 0}px)` }}>
          <path d="M96 8 H264 V62 H210 V82 H150 V62 H96 Z" fill="var(--color-surface)" stroke={installed ? C.up : C.ink} strokeWidth="3" />
          <text x="180" y="41" textAnchor="middle" fontSize="18" fill={C.ink}>Mock Iceberg</text>
        </g>
      </svg>
      <p className="mt-4 break-all font-mono text-sm text-signal" aria-live="polite">{installed ? 'ubunye.readers + ubunye.writers' : 'Package → entry points → discovery'}</p>
    </EngineFigure>
  )
}

const RECORD_PARTS = [
  { name: 'Identity', keys: ['Task · run ID', 'Platform · job · git'] },
  { name: 'Work', keys: ['Code evidence', 'Configuration evidence'] },
  { name: 'Data', keys: ['Inputs · outputs', 'Rows · schema · hashes'] },
  { name: 'Outcome', keys: ['Status · timing', 'Errors · failure stage'] },
]

export function UbunyeRunRecord() {
  const [selected, setSelected] = useState(2)
  return (
    <EngineFigure label="A record you can open" caption="Inspect the work, the data and the outcome in one stored run record.">
      <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {RECORD_PARTS.map((p, i) => <FigButton key={p.name} active={i === selected} onClick={() => setSelected(i)}>{p.name}</FigButton>)}
      </div>
      <div className="mx-auto max-w-sm border-2 border-ivory p-5">
        <div className="flex items-center justify-between gap-2 border-b border-border pb-4"><FileCode2 aria-hidden className="h-12 w-12 text-synapse-ink" /><span className="font-mono text-lg text-ivory">Run record</span></div>
        <div className="my-5 space-y-2" aria-live="polite">{RECORD_PARTS[selected].keys.map((k) => <p key={k} className="border-l-4 border-signal py-3 pl-3 text-base font-semibold text-ivory">{k}</p>)}</div>
        <div aria-hidden className="flex gap-1">{Array.from({ length: 23 }, (_, i) => <span key={i} className="h-7 flex-1 bg-border" style={{ opacity: i % 3 ? 1 : .35 }} />)}</div>
      </div>
    </EngineFigure>
  )
}

const PROOFS = [
  ['C01', 'bb08a7d7a9fd'], ['R1 clean', 'f61e0f0544f5'], ['R1 monitor', '021cc19ca2b6'],
  ['R2 clean', '6affe2f5382c'], ['R2 orders', '6dcf270328d8'], ['R2 monthly', 'a0bd206029ca'],
]
const PROOF_ENVS = ['pandas', 'Local Spark', 'Local kind', 'AWS Glue', 'GCP Dataproc', 'Azure Container Apps', 'Databricks']

export function UbunyeProvingGrid() {
  const [selected, setSelected] = useState(0)
  return (
    <EngineFigure label="One workload. Seven recorded matches." caption="Published proof from 30 September 2026, engine 0.7.2. Digests are shortened to 12 characters.">
      <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-3" aria-label="Proving workload">{PROOFS.map(([name], i) => <FigButton key={name} active={selected === i} onClick={() => setSelected(i)}>{name}</FigButton>)}</div>
      <div className="mb-5 border-2 border-signal p-4 text-center" aria-live="polite"><p className="text-sm text-muted">{PROOFS[selected][0]} · common digest</p><p className="mt-2 break-all font-mono text-2xl font-bold text-signal">{PROOFS[selected][1]}</p></div>
      <div className="grid grid-cols-2 gap-2">{PROOF_ENVS.map((env) => <div key={env} className="flex min-h-20 items-center gap-3 border border-border p-3"><span aria-label="Pass" className="text-3xl font-bold text-signal">✓</span><span className="text-sm text-ivory">{env}</span></div>)}</div>
    </EngineFigure>
  )
}

const CONTRIBUTOR_STEPS = [
  ['Reproduce', 'A failing regression test'], ['Change', 'Fix the smallest useful part'],
  ['Explain', 'Docs and changelog together'], ['Check', 'Tests, typing and proof'],
]

export function UbunyeContributorPath() {
  const [selected, setSelected] = useState(0)
  return (
    <EngineFigure label="Leave the next person a test" caption="A small fix, its explanation and the checks travel in the same change.">
      <div className="grid grid-cols-2 gap-3">{CONTRIBUTOR_STEPS.map(([name], i) => <button key={name} type="button" aria-pressed={selected === i} onClick={() => setSelected(i)} className="min-h-28 border-2 p-4 text-left" style={{ borderColor: selected === i ? C.up : C.border }}><span className="block font-mono text-3xl font-bold" style={{ color: selected === i ? C.up : C.muted }}>{i + 1}</span><span className="mt-2 block text-sm font-semibold text-ivory">{name}</span></button>)}</div>
      <p className="mt-5 text-lg font-semibold text-ivory" aria-live="polite">{CONTRIBUTOR_STEPS[selected][1]}</p>
    </EngineFigure>
  )
}

const READ_TOOLS = ['tasks', 'doctor', 'plan', 'runs', 'record', 'gate', 'focus', 'health', 'upstream']

export function UbunyeToolBoundary() {
  const [allowRun, setAllowRun] = useState(false)
  return (
    <EngineFigure label="Nine ways to inspect. One way to run." caption="Tool registration: run appears only when you start the server with --allow-run.">
      <div className="grid grid-cols-3 gap-2">{READ_TOOLS.map((tool) => <div key={tool} className="border border-border py-4 text-center"><span aria-hidden className="block text-xl text-signal">◇</span><span className="mt-2 block font-mono text-sm text-ivory">{tool}</span></div>)}</div>
      <p className="my-4 text-sm font-semibold text-signal">9 read only tools</p>
      <div className="border-t-2 border-ivory pt-4"><FigButton active={allowRun} onClick={() => setAllowRun((r) => !r)}>{allowRun ? 'Remove --allow-run' : 'Add --allow-run'}</FigButton></div>
      <div className="mt-4 flex min-h-20 items-center justify-center border-2 border-dashed p-4 font-mono text-xl" style={{ borderColor: allowRun ? C.up : C.border, color: allowRun ? C.ink : C.muted }} aria-live="polite">{allowRun ? 'run → executes + records' : 'run is not registered'}</div>
    </EngineFigure>
  )
}

const AGENT_STEPS = [
  { tool: 'tasks', note: 'Find the task', result: 'demo/starter/filter_adults' },
  { tool: 'plan', note: 'Inspect before execution', result: 'Inputs → FilterAdults → outputs' },
  { tool: 'run', note: 'Execute with recording', result: '8 input rows → 5 output rows' },
  { tool: 'record', note: 'Read the saved evidence', result: 'Identity · status · counts · hashes' },
  { tool: 'health', note: 'Check the task history', result: 'Last status · last success · failures' },
]

export function UbunyeAgentWalkthrough() {
  const [selected, setSelected] = useState(0)
  const [playing, setPlaying] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (!playing || !inView || reduced) return
    const id = setInterval(() => setSelected((s) => (s + 1) % AGENT_STEPS.length), 2500)
    return () => clearInterval(id)
  }, [playing, inView, reduced])
  return (
    <EngineFigure label="Ask. Inspect. Run. Check." caption="A tool sequence over the starter task, not a captured MCP conversation. Only run executes the task.">
      <div ref={ref}>
        <div className="mb-5 flex flex-wrap gap-2">{AGENT_STEPS.map((s, i) => <FigButton key={s.tool} active={i === selected} onClick={() => { setSelected(i); setPlaying(false) }}>{s.tool}</FigButton>)}</div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2"><div className="border-2 border-ivory py-6 text-center text-lg font-semibold text-ivory">Agent</div><span aria-hidden className="text-2xl text-signal">⇄</span><div className="border-2 border-ivory py-6 text-center text-lg font-semibold text-ivory">Engine</div></div>
        <div className="mt-4 border-2 border-signal p-5" aria-live={playing ? 'off' : 'polite'}><p className="font-mono text-2xl font-bold text-signal">{AGENT_STEPS[selected].tool}</p><p className="mt-2 text-sm text-muted">{AGENT_STEPS[selected].note}</p><p className="mt-5 break-words text-lg text-ivory">{AGENT_STEPS[selected].result}</p></div>
        {!reduced && <div className="mt-4"><FigButton active={playing} onClick={() => setPlaying((p) => !p)}>{playing ? 'Pause walkthrough' : 'Play walkthrough'}</FigButton></div>}
      </div>
    </EngineFigure>
  )
}

export function UbunyeNotebookRun() {
  const { ref, position } = useFlow()
  return (
    <EngineFigure label="One notebook block. One run." caption="Keep read, transform and write inside a recorded notebook context.">
      <div ref={ref} className="border-2 border-ivory p-4"><p className="mb-5 font-mono text-sm text-synapse-ink">with ubunye.notebook(...)</p><div className="grid grid-cols-3 gap-2">{['read()', 'transform()', 'write()'].map((step) => <div key={step} className="min-w-0 border border-border py-6 text-center font-mono text-xs text-ivory sm:text-sm">{step}</div>)}</div><FlowLine position={position} /><div className="flex items-center justify-center gap-3 border-2 border-signal p-4"><FileCode2 aria-hidden className="h-9 w-9 text-signal" /><span className="text-lg font-semibold text-ivory">One run record</span></div></div>
    </EngineFigure>
  )
}

export function UbunyeRecordHandoff() {
  const [reader, setReader] = useState(false)
  const { ref, position } = useFlow()
  return (
    <EngineFigure label="Pass the record with the work" caption="A handoff you arrange through a shared record store. Agent orchestration is not built in.">
      <div ref={ref}>
        <div className="mb-5 flex gap-2"><FigButton active={!reader} onClick={() => setReader(false)}>Agent A</FigButton><FigButton active={reader} onClick={() => setReader(true)}>Agent B</FigButton></div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2"><div className="border-2 p-4 text-center" style={{ borderColor: reader ? C.border : C.up }}><span className="block text-3xl text-ivory">A</span><span className="mt-2 block font-mono text-xs text-muted">run</span></div><span aria-hidden className="text-xl text-muted">→</span><div className="border-2 p-4 text-center" style={{ borderColor: reader ? C.up : C.border }}><span className="block text-3xl text-ivory">B</span><span className="mt-2 block font-mono text-xs text-muted">record</span></div></div>
        <FlowLine position={position} />
        <div className="border-2 border-ivory p-5"><FileCode2 aria-hidden className="mx-auto h-14 w-14 text-synapse-ink" /><p className="mt-3 text-center text-lg font-semibold text-ivory">Shared run records</p><div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-signal">{['record', 'upstream', 'health'].map((tool) => <span key={tool} className="border border-border py-3 font-mono">{tool}</span>)}</div></div>
        <p className="mt-4 text-sm text-ivory" aria-live="polite">{reader ? 'Read the exact run. Check the batch and outcome.' : 'Run with recording. Keep the run ID for the handoff.'}</p>
      </div>
    </EngineFigure>
  )
}

export function UbunyeReplayBoundary() {
  const [mode, setMode] = useState(0)
  const { ref, position } = useFlow()
  return (
    <EngineFigure label="Replay the recorded request" caption="For calls through llm.port. Missing replay data fails the call; it does not switch to live.">
      <div ref={ref}>
        <div className="mb-5 flex flex-wrap gap-2"><FigButton active={mode === 0} onClick={() => setMode(0)}>Recorded request</FigButton><FigButton active={mode === 1} onClick={() => setMode(1)}>Missing request</FigButton></div>
        <div className="border-2 border-ivory p-5 text-center font-mono text-lg text-ivory">Request hash</div><FlowLine position={position} />
        <div className="border-2 p-5 text-center" style={{ borderColor: mode ? C.down : C.up }} aria-live="polite"><p className="text-3xl font-bold" style={{ color: mode ? C.down : C.up }}>{mode ? 'STOP' : 'REPLAY'}</p><p className="mt-3 text-sm text-ivory">{mode ? 'No recording for this request' : 'Return the stored answer'}</p></div>
      </div>
    </EngineFigure>
  )
}
