import { pool } from '@evershop/evershop/src/lib/postgres/connection';
import { getConfig } from '@evershop/evershop/src/lib/util/getConfig';
import { getEnv } from '@evershop/evershop/src/lib/util/getEnv'
import { meiliSearchService } from "../../services/melisearch";
import { CONFIG_EVERSHOP_MEILISEARCH, ENV_EVERSHOP_MEILISEARCH, MEILISEACH_PRODUCT_INDEX } from "../../utils/constants";
import { ENUM_FLAG_LOAD_PRODUCTS } from "../../utils/enums";
import { buildQuertLoadProductById } from "../../helpers/query";

const flagLoadProducts: ENUM_FLAG_LOAD_PRODUCTS = getConfig(CONFIG_EVERSHOP_MEILISEARCH.FLAG_LOAD_PRODUCTS) || getEnv(ENV_EVERSHOP_MEILISEARCH.FLAG_LOAD_PRODUCTS);

const createProductDocument = async ({
  product_id
}) => {
  console.log('hook product created', product_id)
  if (flagLoadProducts === ENUM_FLAG_LOAD_PRODUCTS.DISABLE) {
    return
  }

  const query = buildQuertLoadProductById(product_id);
  const product = await query.load(pool);
  if (!product) {
    return
  }
  await meiliSearchService.createDocuments({
    indexName: MEILISEACH_PRODUCT_INDEX,
    payload: [product]
  })
}

module.exports = createProductDocument