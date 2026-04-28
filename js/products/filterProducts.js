import { productMatchesQuery } from './searchNormalize.js';

/**
 * 선택된 카테고리 key 기준 상품 필터링
 */
export function filterProductsByCategory(products, categoryKey) {
  if (!categoryKey) return products;
  return products.filter((product) => Array.isArray(product.categories) && product.categories.includes(categoryKey));
}

/**
 * 카테고리 + 검색어(한글 브랜드명 등 지원)
 * @param {string} [searchQuery]
 */
export function filterProductsByCategoryAndSearch(products, categoryKey, searchQuery) {
  let list = filterProductsByCategory(products, categoryKey);
  const sq = String(searchQuery || '').trim();
  if (!sq) return list;
  return list.filter((p) => productMatchesQuery(p, sq));
}
