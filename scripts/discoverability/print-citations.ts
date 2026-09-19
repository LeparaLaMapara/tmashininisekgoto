/** Print every publication in all three citation formats. `npx tsx scripts/discoverability/print-citations.ts` */
import { PUBLICATIONS } from '../../lib/data'
import { citations } from '../../lib/citations'
for (const p of PUBLICATIONS) {
  const c = citations(p)
  console.log(c.BibTeX, '\nAPA:', c.APA, '\nCHI:', c.Chicago, '\n')
}
