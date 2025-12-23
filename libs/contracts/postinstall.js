// eslint-disable-next-line @typescript-eslint/no-require-imports
const { execSync } = require('node:child_process');

execSync('npm run build');
execSync('mkdir src');
execSync('mv ./api ./src');
execSync('mv ./commands ./src');
execSync('mv ./constants ./src');
execSync('mv ./schemas ./src');
execSync('mv ./index.ts ./src');