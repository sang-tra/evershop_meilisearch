import { getEnv } from '@evershop/evershop/src/lib/util/getEnv'
import { pool } from '@evershop/evershop/src/lib/postgres/connection';
import { getConfig } from '@evershop/evershop/src/lib/util/getConfig';
import { meiliSearchService } from "./melisearch";
import { ENUM_FLAG_LOAD_PRODUCTS } from "../utils/enums";
import { buildQueryLoadListProduct } from "../helpers/query";
import { ENV_EVERSHOP_MEILISEARCH, MEILISEACH_PRODUCT_INDEX, CONFIG_EVERSHOP_MEILISEARCH } from "../utils/constants";

export interface ProductConfig {
  searchableAttributes: string[]
  displayedAttributes: string[]
}
const productSetting: ProductConfig = {
  searchableAttributes: [
    'id',
    'uuid',
    'sku',
    'name',
    'description',
    'short_description',
    'meta_title',
    'meta_description',
    'meta_keywords',
    'url_key',
  ],
  displayedAttributes: [
    'id',
    'uuid',
    'sku',
    'name',
    'description',
    'short_description',
    'meta_title',
    'meta_description',
    'meta_keywords',
    'url_key',
    'thumb_image',
  ],
}

const flagLoadProducts: ENUM_FLAG_LOAD_PRODUCTS = getConfig(CONFIG_EVERSHOP_MEILISEARCH.FLAG_LOAD_PRODUCTS) || getEnv(ENV_EVERSHOP_MEILISEARCH.FLAG_LOAD_PRODUCTS);
const loadProducts = async () => {
  const query = buildQueryLoadListProduct();
  const products = await query.execute(pool);
  return products
}

export const loadProductDocuments = async (): Promise<void> => {
  console.log('meilisearch: load documents')
  if (flagLoadProducts === ENUM_FLAG_LOAD_PRODUCTS.DISABLE) {
    return
  }
  let productIndex;
  try {
    productIndex = await meiliSearchService.getIndex({
      name: MEILISEACH_PRODUCT_INDEX
    })
  } catch (error) {
  }

  const isForceUpsert = flagLoadProducts === ENUM_FLAG_LOAD_PRODUCTS.FORCE_UPSERT
  if (productIndex && !isForceUpsert) {
    return;
  }
  if (!productIndex) {
    await meiliSearchService.createIndex({
      name: MEILISEACH_PRODUCT_INDEX,
      options: {
        primaryKey: 'id'
      }
    })
  }
  await meiliSearchService.updateSettingsOfIndex({
    name: MEILISEACH_PRODUCT_INDEX,
    settings: productSetting
  })
  const products = await loadProducts();
  await meiliSearchService.deleteDocumentsByIndexName({
    name: MEILISEACH_PRODUCT_INDEX
  })
  await meiliSearchService.createDocuments({
    indexName: MEILISEACH_PRODUCT_INDEX,
    payload: products
  })
}
