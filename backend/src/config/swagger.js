import { readFileSync } from 'fs';
import { parse } from 'yaml';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getSwaggerSpec = () => {
  try {
    const swaggerYamlPath = join(__dirname, '..', '..', 'swagger.yaml');
    const file = readFileSync(swaggerYamlPath, 'utf8');
    return parse(file);
  } catch (error) {
    console.error('Error loading swagger.yaml:', error);
    return null;
  }
};
