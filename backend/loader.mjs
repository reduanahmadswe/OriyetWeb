import { createMatchPath } from 'tsconfig-paths';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load tsconfig to get the path mappings
const matchPath = createMatchPath(resolve(__dirname, './tsconfig.json'));

// Create a custom loader that resolves paths
export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    const resolved = matchPath(specifier);
    if (resolved) {
      return nextResolve(resolved, context);
    }
  }
  return nextResolve(specifier, context);
}
