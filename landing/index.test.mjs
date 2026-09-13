import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const landingDirectory = new URL('.', import.meta.url);
const indexHtml = await readFile(new URL('index.html', landingDirectory), 'utf8');

test('landing page is a short introduction with its two existing destinations', () => {
  const body = indexHtml.match(/<body>([\s\S]*?)<\/body>/)[1];
  const visibleText = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  assert.equal(visibleText, "Jaybox Hi, I'm Jay. I use Jaybox for my portfolio, personal projects, and services I run for my own use. You’ll find links to the public parts below. Portfolio Herma");
  const links = [...body.matchAll(/<a\s+[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g)];
  assert.deepEqual(links.map(([, href, label]) => [href, label]), [
    ['https://portfolio.jaybox.dev', 'Portfolio'],
    ['https://herma.jaybox.dev', 'Herma'],
  ]);
});

test('landing page loads a content-versioned external stylesheet', async () => {
  const link = indexHtml.match(/<link\s+rel="stylesheet"\s+href="\.\/(styles\.([a-f0-9]{8})\.css)">/);
  assert.ok(link, 'Use a content-versioned stylesheet so old CSS cannot style the new page');
  assert.doesNotMatch(indexHtml, /<style\b/i);

  const stylesheet = await readFile(new URL(link[1], landingDirectory), 'utf8');
  const { createHash } = await import('node:crypto');
  assert.equal(createHash('sha256').update(stylesheet).digest('hex').slice(0, 8), link[2]);
  assert.match(stylesheet, /:root\s*\{/);
});
