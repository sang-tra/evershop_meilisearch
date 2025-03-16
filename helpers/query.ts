import { select } from '@evershop/postgres-query-builder';

export const buildQueryLoadListProduct = () => {
  const query = select()
    .select('product_description.product_id', 'id')
    .select('product.uuid')
    .select('product.sku')
    .select('product_description.name', 'name')
    .select('product_description.description', 'description')
    .select('product_description.short_description', 'short_description')
    .select('product_description.meta_title', 'meta_title')
    .select('product_description.meta_description', 'meta_description')
    .select('product_description.meta_keywords', 'meta_keywords')
    .select('product_description.url_key', 'url_key')
    .select('product_image.thumb_image', 'thumb_image')
    .from('product')
  query.leftJoin('product_description')
    .on(
      'product.product_id',
      '=',
      'product_description.product_description_product_id'
    )

  query.leftJoin('product_image')
    .on('product_image.product_image_product_id', '=', 'product.product_id')
    .and('product_image.is_main', '=', true)
  query.where('variant_group_id', 'IS NULL');
  return query
}

export const buildQuertLoadProductById = (id: number) => {
  const query = select()
    .select('product_description.product_id', 'id')
    .select('product.uuid')
    .select('product.sku')
    .select('product_description.name', 'name')
    .select('product_description.description', 'description')
    .select('product_description.short_description', 'short_description')
    .select('product_description.meta_title', 'meta_title')
    .select('product_description.meta_description', 'meta_description')
    .select('product_description.meta_keywords', 'meta_keywords')
    .select('product_description.url_key', 'url_key')
    .select('product_image.thumb_image', 'thumb_image')
    .from('product')
  query.leftJoin('product_description')
    .on(
      'product.product_id',
      '=',
      'product_description.product_description_product_id'
    )
  query.leftJoin('product_image')
    .on('product_image.product_image_product_id', '=', 'product.product_id')
    .and('product_image.is_main', '=', true)
  query.where('variant_group_id', 'IS NULL')
    .andWhere('product_id', '=', id)
  return query;
}