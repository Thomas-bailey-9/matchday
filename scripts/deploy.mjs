// Publishes the site: builds it, then pushes the finished files in dist/
// to the gh-pages branch on GitHub, which GitHub Pages serves.
// Run with: npm run deploy
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const run = (cmd, cwd = '.') => execSync(cmd, { cwd, stdio: 'inherit' });
const read = (cmd) => execSync(cmd).toString().trim();

const origin = read('git remote get-url origin');
const name = read('git config user.name');
const email = read('git config user.email');
const commit = read('git rev-parse --short HEAD');

run('npm run build');
// Tells GitHub Pages to serve the files as they are.
writeFileSync('dist/.nojekyll', '');

run('git init -q -b gh-pages', 'dist');
run(`git -c user.name="${name}" -c user.email="${email}" add -A`, 'dist');
run(`git -c user.name="${name}" -c user.email="${email}" commit -q -m "Publish site from ${commit}"`, 'dist');
run(`git push -f ${origin} gh-pages`, 'dist');

console.log('\nPublished. Live in a minute or two at https://thomas-bailey-9.github.io/matchday/');
