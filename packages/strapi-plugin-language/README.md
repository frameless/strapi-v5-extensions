# Strapi Plugin Language

A **Strapi custom field** that provides a dropdown selector for languages.  
The field stores values as **ISO 639-1 language codes**, making it easy to integrate with APIs, localization logic, or external services.

Currently supported languages:

- English (`en`)
- Dutch (`nl`)
- Arabic (`ar`)
- Ukrainian (`uk`)
- Turkish (`tr`)

This plugin is compatible with **Strapi v5 and above**.

---

## Features

- ✅ Custom field with a language dropdown
- ✅ Returns standardized ISO 639-1 language codes
- ✅ Configurable default language
- ✅ Works with any content type
- ✅ Fully compatible with Strapi `>= 5.0.0`

---

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

## Usage

Once the plugin is installed and the Strapi admin panel has been rebuilt, the **Language** custom field becomes available in the Content-Type Builder.

### Adding the field to a content type

1. Open the **Strapi Admin Dashboard**
2. Navigate to **Content-Type Builder**
3. Create a new content type or edit an existing one
4. Click **Add another field**
5. Switch to the **Custom** tab
6. Select **Language** from the list of available custom fields
7. Configure the field settings and save

---

### Field settings

The Language custom field supports both **basic** and **advanced** configuration options.

#### Advanced settings

- **Default language**  
  Allows you to select a language that will be pre-selected when creating new entries.

---

### Stored value

The field stores and returns values using **ISO 639-1 language codes**.

Example API response:

```json
{
  "language": "en"
}

```

## License

This project is licensed under the **European Union Public Licence (EUPL) v1.2**.

See the [LICENSE.md](../../LICENSE.md) file at the root of the monorepo for full license text.
