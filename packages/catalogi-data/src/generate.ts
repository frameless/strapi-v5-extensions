import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import { create } from 'xmlbuilder2';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, '../dist');

export const generateGemeenteJson = () => {
  const xmlPath = path.join(__dirname, 'gemeente.xml');
  const xml = fs.readFileSync(xmlPath, 'utf-8');

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const doc = create(xml);
  const gemeenteJson = doc.toObject();

  const outputPath = path.join(dir, 'gemeente.json');
  fs.writeFileSync(outputPath, JSON.stringify(gemeenteJson));
};

generateGemeenteJson();
