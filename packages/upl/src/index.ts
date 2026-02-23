import * as fs from 'node:fs';

const url = 'https://standaarden.overheid.nl/owms/oquery/UPL-actueel.json';

interface UPLBinding {
  URI: { type: string; value: string };
  UniformeProductnaam: { type: string; value: string };
}

interface UPLData {
  head: { vars: string[] };
  results: { bindings: UPLBinding[] };
}

const fetchWithRetry = async (url: string, options: RequestInit, retries = 3, delayMs = 2000): Promise<Response> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const response = await fetch(url, options);

    if (response.ok) return response;

    const isServerError = response.status >= 500 && response.status < 600;
    if (isServerError && attempt < retries) {
      // eslint-disable-next-line no-console
      console.log(`Retry attempt: ${attempt}. Waiting ${attempt * delayMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, attempt * delayMs));
      continue;
    }

    throw new Error(`Request failed with status ${response.status}`);
  }
  // Should never be reached, but satisfies TypeScript
  throw new Error('Unexpected error in fetchWithRetry');
};

const simplifyUPL = (data: UPLData) =>
  data.results.bindings.map((binding) => ({
    uri: binding.URI.value,
    value: binding.UniformeProductnaam.value,
  }));

const main = async () => {
  const response = await fetchWithRetry(url, { headers: { Accept: 'application/json' } });
  const json: UPLData = await response.json();

  const simplifiedData = simplifyUPL(json);
  const dir = './src/build';

  try {
    fs.mkdirSync(dir);
    // eslint-disable-next-line no-console
    console.log('Directory created successfully!');
  } catch (err: any) {
    if (err.code === 'EEXIST') {
      // eslint-disable-next-line no-console
      console.error('Directory already exists.');
    } else {
      throw err; // Don't silently swallow unexpected errors
    }
  }

  fs.writeFileSync(`${dir}/UPL-actueel.ts`, `export const uplActueel = ${JSON.stringify(json, null, 2)};`);
  fs.writeFileSync(
    `${dir}/UPL-key-value.ts`,
    `export const uplKeyValues = ${JSON.stringify(simplifiedData, null, 2)};`,
  );
  fs.writeFileSync(`${dir}/main.ts`, `export * from "./UPL-actueel";\nexport * from "./UPL-key-value";\n`);
  // eslint-disable-next-line no-console
  console.log('JSON data has been written to the files successfully!');
};

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Error fetching JSON data:', error);
  process.exit(1);
});
