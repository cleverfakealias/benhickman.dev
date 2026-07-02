import { copyFile, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const localFiles = [
  { template: '.env.example', target: '.env' },
  { template: '.dev.vars.example', target: '.dev.vars' },
];

function isMissingFile(error) {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT';
}

async function shouldCreate(path) {
  try {
    return (await stat(path)).size === 0;
  } catch (error) {
    if (isMissingFile(error)) return true;
    throw error;
  }
}

for (const { template, target } of localFiles) {
  const sourcePath = resolve(projectRoot, template);
  const targetPath = resolve(projectRoot, target);

  if (await shouldCreate(targetPath)) {
    await copyFile(sourcePath, targetPath);
    console.log(`Created ${target} from ${template}.`);
  } else {
    console.log(`Kept existing ${target}.`);
  }
}

console.log('Local configuration is ready. Add optional credentials, then run `npm run dev`.');
