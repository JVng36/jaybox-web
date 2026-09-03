import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const landingDirectory = new URL('.', import.meta.url);
const indexHtml = await readFile(new URL('index.html', landingDirectory), 'utf8');

test('landing page loads its stylesheet instead of embedding CSS', async () => {
  assert.match(
    indexHtml,
    /<link\s+rel="stylesheet"\s+href="\.\/styles\.css">/,
  );
  assert.doesNotMatch(indexHtml, /<style\b/i);

  const stylesheet = await readFile(new URL('styles.css', landingDirectory), 'utf8');
  assert.match(stylesheet, /:root\s*\{/);
});
