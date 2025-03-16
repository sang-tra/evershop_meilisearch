import { v4 as uuidv4 } from 'uuid';
import { select } from '@evershop/postgres-query-builder';
import { buildUrl } from '@evershop/evershop/src/lib/router/buildUrl';
import { meiliSearchService } from "../../services/melisearch";
import { MEILISEACH_PRODUCT_INDEX } from '../../utils/constants';

module.exports = {
  MeilisearchProduct: {
    url: async (product, _, { pool }) => {
      // Get the url rewrite for this product
      const urlRewrite = await select()
        .from('url_rewrite')
        .where('entity_uuid', '=', product.uuid)
        .and('entity_type', '=', 'product')
        .load(pool);
      if (!urlRewrite) {
        return buildUrl('productView', { uuid: product.uuid });
      } else {
        return urlRewrite.request_path;
      }
    },
    description: ({ description }) => {
      try {
        return JSON.parse(description);
      } catch (e) {
        // This is for backward compatibility. If the description is not a JSON string then it is a raw HTML block
        const rowId = `r__${uuidv4()}`;
        return [
          {
            size: 1,
            id: rowId,
            columns: [
              {
                id: 'c__c5d90067-c786-4324-8e24-8e30520ac3d7',
                size: 1,
                data: {
                  time: 1723347125344,
                  blocks: [
                    {
                      id: 'AU89ItzUa7',
                      type: 'raw',
                      data: {
                        html: description
                      }
                    }
                  ],
                  version: '2.30.2'
                }
              }
            ]
          }
        ];
      }
    }
  },
  Query: {
    meilisearchProducts: async (_, { filters = [] }) => {

      const products = await meiliSearchService.searchDocuments({
        indexName: MEILISEACH_PRODUCT_INDEX,
        query: 'Loafers',
        // options: {
        //   offset: filters[1],
        //   limit: filters[2],
        // }
      })
      return products;
    }
  }
};
