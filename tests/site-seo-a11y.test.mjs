import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const file=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('SEO metadata includes canonical and description on homepage and guide',()=>{
 for(const p of ['index.html','public/how-to-play.html']){
  const s=file(p);assert.match(s,/<link rel="canonical" href="https:\/\/cbw29512.github.io\/DNDblocksbattlemaps\//);assert.match(s,/<meta name="description" content="[^"]{45,}/);
 }
});
test('help page root and public copies remain identical',()=>assert.equal(file('how-to-play.html'),file('public/how-to-play.html')));
test('all app pages provide keyboard skip-link destination',()=>{
 assert.match(file('index.html'),/class="skip-link"/);
 for(const p of ['src/app/home.ts','src/app/builder.ts','src/app/join.ts','public/how-to-play.html'])
  assert.match(file(p),/id="main-content"/,p);
});
test('crawl configuration includes both public pages',()=>{
 assert.match(file('public/robots.txt'),/Sitemap: https:\/\/cbw29512.github.io\/DNDblocksbattlemaps\/sitemap.xml/);
 assert.match(file('public/sitemap.xml'),/how-to-play.html/);
});
