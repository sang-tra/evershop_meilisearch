# Meilisearch For EverShop

This extension intergrate evershop with Meilisearch

## Requirement
This extension requires EverShop version 1.0.0-rc.6 or higher.
This extension requires Meilisearch version 1.13 or higher.

## Installation guide

### Step 1: Install the extension using npm:
Using npm
```bash
  npm install evershop_meilisearch
```
Using yarn
```bash
  yarn add evershop_meilisearch
```
### Step 2: Enable the extension

Edit the `config/default.json` file in the root directory of your EverShop installation and add the following line to the `extensions` section:

```json
  {
    ...,
    "system": {
      ...,
      "extensions": [
        ...,
        {
          "name": "meilisearch",
          "resolve": "node_modules/evershop_meilisearch/dist",
          "enabled": true,
          "priority": 10
        },
      ],
      "search_engine": "meilisearch"
    }
  }
```

### Step 3: Set Meilisearch key
Edit your `.env` file add the following line (change your value)
```bash
  EVERSHOP_MEILISEARCH_API_KEY="secretKey"
  EVERSHOP_MEILISEARCH_HOST="https://your-meilisearch-host"
```

### Step 4: Using Meilisearch service
Option 1: Ysing by import service directly
```bash
  const { meiliSearchService } = require('evershop_meilisearch')

  // implement your logic code
```

Option 2: Using by get via registerd process `searchEngine`
```bash
  const { getValueSync } = require('@evershop/evershop/src/lib/util/registry');
  const { getConfig } = require('@evershop/evershop/src/lib/util/getConfig');

  const searchEngine = getValueSync(
    'searchEngine',
    null,
    {
      config: getConfig('system.search_engine')
    },
  )
```
###  Resources
- getIndex({ name: string })
- getIndexs({
    offset?: number
    limit?: number
  })
- createIndex({
    name: string
    options: Record<string, unknown>
  })
- updateIndex({
    name: string
    options: Record<string, unknown>
  })
- updateSettingsOfIndex({
    name: string
    settings: Record<string, any>
  })
- deleteIndex(name: string)
- deleteIndexIfExists(name: string)
- searchDocuments({
  indexName: string
  query: string
  options?: Record<string, any>
})
