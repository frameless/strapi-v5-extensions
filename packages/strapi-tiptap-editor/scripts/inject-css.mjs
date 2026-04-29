/**
 *
 * WHY THIS SCRIPT EXISTS
 * ──────────────────────
 * The Strapi Plugin SDK (strapi-plugin build, v6+) derives its entire build
 * configuration from package.json exports. It does not read vite.config.ts or
 * any other custom build config, those files are silently ignored.
 *
 * When the SDK processes CSS imports (e.g. design tokens, component library
 * stylesheets) it correctly extracts them into `dist/style.css`, but it does
 * NOT inject a reference to that file into the compiled JS bundles. As a result,
 * Strapi's admin panel loads the plugin JS but never loads the CSS, so design
 * tokens, theming variables, and component styles are missing in production.
 * In development this goes unnoticed because Vite's dev server handles CSS
 * natively without needing an explicit import in the bundle.
 *
 * WHAT THIS SCRIPT DOES
 * ──────────────────────
 * After `strapi-plugin build` runs, this script:
 *   1. Reads the extracted `dist/style.css`
 *   2. Appends a self-executing style injector to both JS bundles
 *      (dist/admin/index.js and dist/admin/index.mjs)
 *
 * At runtime, when Strapi loads the plugin JS, the injector creates a <style>
 * tag and appends it to <head>, making all CSS custom properties and component
 * styles available immediately.
 *
 * WHEN TO REMOVE THIS SCRIPT
 * ──────────────────────────
 * Remove this script (and the `&& node scripts/inject-css.mjs` from the build
 * command in package.json) once the Strapi Plugin SDK natively supports
 * bundling CSS into the JS output, i.e. when `dist/style.css` no longer
 * exists as a standalone file after a build, or when the SDK officially
 * documents a way to configure CSS injection (e.g. via package.json or a
 * supported config file).
 *
 * Track: https://github.com/strapi/sdk-plugin/issues
 *  - https://github.com/strapi/sdk-plugin/issues/79
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";

const CSS_SOURCE = "./dist/style.css";
const JS_BUNDLES = ["./dist/admin/index.js", "./dist/admin/index.mjs"];

// Exit early if no CSS was extracted (e.g. the plugin has no CSS imports)
if (!existsSync(CSS_SOURCE)) {
  console.warn("[inject-css] No dist/style.css found, skipping CSS injection.");
  // eslint-disable-next-line no-undef
  process.exit(0);
}

const css = readFileSync(CSS_SOURCE, "utf-8")
  // Escape backticks so the CSS can safely be embedded in a template literal
  .replace(/`/g, "\\`")
  // Escape ${ to prevent accidental template literal interpolation
  .replace(/\$\{/g, "\\${");

const injector = [
  ";(function () {",
  '  const style = document.createElement("style");',
  `  style.textContent = \`${css}\`;`,
  "  document.head.appendChild(style);",
  "})();",
].join("\n");

for (const bundle of JS_BUNDLES) {
  if (!existsSync(bundle)) {
    console.warn(`[inject-css] Bundle not found, skipping: ${bundle}`);
    continue;
  }

  const original = readFileSync(bundle, "utf-8");
  writeFileSync(bundle, original + "\n" + injector);
  console.log(`[inject-css] ✔ Injected CSS into ${bundle}`);
}
