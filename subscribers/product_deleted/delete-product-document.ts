import { getConfig } from '@evershop/evershop/src/lib/util/getConfig';
import { getEnv } from '@evershop/evershop/src/lib/util/getEnv'
import { ENUM_FLAG_LOAD_PRODUCTS } from "../../utils/enums";
import { meiliSearchService } from "../../services/melisearch";
import { CONFIG_EVERSHOP_MEILISEARCH, ENV_EVERSHOP_MEILISEARCH, MEILISEACH_PRODUCT_INDEX } from "../../utils/constants";

const flagLoadProducts: ENUM_FLAG_LOAD_PRODUCTS = getConfig(CONFIG_EVERSHOP_MEILISEARCH.FLAG_LOAD_PRODUCTS) || getEnv(ENV_EVERSHOP_MEILISEARCH.FLAG_LOAD_PRODUCTS);
const deleteProductDocument = async ({
  product_id
}) => {
  console.log('hook product removed', product_id)
  if (flagLoadProducts === ENUM_FLAG_LOAD_PRODUCTS.DISABLE) {
    return
  }

  await meiliSearchService.deleteDocumentById({
    indexName: MEILISEACH_PRODUCT_INDEX,
    id: product_id
  })
}
module.exports = deleteProductDocument;