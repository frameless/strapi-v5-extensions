# strapi-plugin-nl-government-fields

A Strapi v5 plugin that provides reusable custom fields for Dutch government and public-sector product metadata.

This plugin bundles multiple custom fields used in Dutch municipal, provincial, and national product information systems (PDC). It standardizes structured metadata such as UPL references, bevoegd gezag (authority), and municipality selection.

This plugin is compatible with **Strapi v5 and above**.

## Requirements

- **Strapi**: `>= 5.0.0`
- **Node.js**: `>= 22.0.0 < 25`
- **pnpm**: `>= 10.0.0`

```json

  "engines": {
    "node": ">=22.0.0 <25",
    "pnpm": ">=10.0.0"
  },
```

## Installation

To install the plugin, run the following command in your Strapi project:

```bash
pnpm add strapi-plugin-nl-government-fields
```

Then, rebuild your Strapi admin panel:

```bash
pnpm run build
```

## Usage

Once the plugin is installed and the Strapi admin panel has been rebuilt, the **nl-government-fields** custom field becomes available in the Content-Type Builder.

### Adding the field to a content type

1. Open the **Strapi Admin Dashboard**
2. Navigate to **Content-Type Builder**
3. Create a new content type or edit an existing one
4. Click **Add another field**
5. Switch to the **Custom** tab
6. Select the desired custom field from the list of available custom fields (e.g. "Uniform Product Name", "Bevoegd Gezag", "Gemeente")
7. Configure the field settings and save

### Field settings

Each custom field provided by this plugin has its own specific settings. For example, the "Bevoegd Gezag" (Authority) field allows you to select which types of authorities are applicable (e.g. gemeente, provincie, rijksoverheid, waterschap).

## Features

- ✅ Custom fields for Dutch government product metadata
- ✅ Standardized UPL reference field
- ✅ Authority (bevoegd gezag) selection field
- ✅ Municipality selection field
- ✅ Fully compatible with Strapi `>= 5.0.0`
- ✅ [References to Logius samenwerkende-catalogi for standardized metadata](https://www.logius.nl/domeinen/interactie/samenwerkende-catalogi/documentatie/informatie-publicatie-model)

## License

This project is licensed under the **European Union Public Licence (EUPL) v1.2**.

See the [LICENSE.md](../../LICENSE.md) file at the root of the monorepo for full license text.
