import { meiliSearchService } from "../../services/melisearch";
import { pool } from '@evershop/evershop/src/lib/postgres/connection';
import { buildQuertLoadProductById } from "../../helpers/query";
import { CONFIG_EVERSHOP_MEILISEARCH, ENV_EVERSHOP_MEILISEARCH, MEILISEACH_PRODUCT_INDEX } from "../../utils/constants";

import { getConfig } from '@evershop/evershop/src/lib/util/getConfig';
import { getEnv } from '@evershop/evershop/src/lib/util/getEnv'
import { ENUM_FLAG_LOAD_PRODUCTS } from "../../utils/enums";
const flagLoadProducts: ENUM_FLAG_LOAD_PRODUCTS = getConfig(CONFIG_EVERSHOP_MEILISEARCH.FLAG_LOAD_PRODUCTS) || getEnv(ENV_EVERSHOP_MEILISEARCH.FLAG_LOAD_PRODUCTS);

const updateProductDocument = async (data) => {
  const { product_id } = data
  console.log('hook product updated', product_id)

  if (flagLoadProducts === ENUM_FLAG_LOAD_PRODUCTS.DISABLE) {
    return
  }
  const query = buildQuertLoadProductById(product_id);
  const product = await query.load(pool);
  if (!product) {
    return
  }
  await meiliSearchService.updateDocuments({
    indexName: MEILISEACH_PRODUCT_INDEX,
    payload: [product]
  })
}
module.exports = updateProductDocument;