// Writes the two files AnyVendor's site content contract v1 asks for:
//   docs/anyvendor/the-bar-people.manifest.json  → staff load with set_site_manifest
//   docs/anyvendor/the-bar-people.content.json   → staff seed as draft v1, then publish v1
// Run: pnpm content:export   (tests fail if these files drift from the code)

import { writeFileSync } from 'node:fs';
import { TBP_MANIFEST } from '../src/content/manifest.ts';
import { TBP_DEFAULT_CONTENT } from '../src/content/defaults.ts';
import { manifestProblems, normaliseByManifest } from '../src/content/contract.ts';

const problems = manifestProblems(TBP_MANIFEST);
if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
const content = normaliseByManifest(TBP_MANIFEST, TBP_DEFAULT_CONTENT);
writeFileSync('docs/anyvendor/the-bar-people.manifest.json', `${JSON.stringify(TBP_MANIFEST, null, 2)}\n`);
writeFileSync('docs/anyvendor/the-bar-people.content.json', `${JSON.stringify(content, null, 2)}\n`);
console.log(`wrote manifest (${TBP_MANIFEST.sections.length} sections) and content`);
