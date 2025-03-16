import { meiliSearchService } from './services/melisearch';
import { getValueSync } from '@evershop/evershop/src/lib/util/registry';
import { addProcessor } from '@evershop/evershop/src/lib/util/registry';
import { merge } from '@evershop/evershop/src/lib/util/merge';
import { loadProductDocuments } from './services/load-product-documents';

const init = async () => {
  addProcessor('configuratonSchema', (schema) => {
    merge(
      schema,
      {
        properties: {
          system: {
            type: 'object',
            properties: {
              search_engine: {
                enum: ['meilisearch']
              }
            }
          }
        }
      },
      100
    );
    return schema;
  });

  addProcessor('searchEngine', function (value: any) {
    if (this.config === 'meilisearch') {
      return meiliSearchService;
    } else {
      return value;
    }
  });

  loadProductDocuments()
    .then()
    .catch((err) => {
      console.log(err)
    })
};

export = init
