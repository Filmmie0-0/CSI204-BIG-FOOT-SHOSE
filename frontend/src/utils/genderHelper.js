export const getProductGender = (product) => {
  if (!product) return '';
  
  if (product.gender) return product.gender;

  // 1. Check SKU first as it is the most reliable (e.g. SHOE-MEN-1, SHOE-WOMEN-6, SHOE-UNISEX-3)
  const sku = (product.sku || '').toUpperCase();
  if (sku.includes('-WOMEN-')) return 'Women';
  if (sku.includes('-MEN-')) return 'Men';
  if (sku.includes('-UNISEX-')) return 'Unisex';
  if (sku.includes('-KIDS-')) return 'Kids';

  // 2. Check name
  const name = (product.name || '').toLowerCase();
  if (name.includes('unisex')) return 'Unisex';
  if (name.includes('women')) return 'Women';
  if (/\bmen\b/i.test(name)) return 'Men'; // use word boundary to avoid matching "women"
  if (name.includes('kids') || name.includes('kid')) return 'Kids';

  // 3. Check description
  const desc = (product.description || '').toLowerCase();
  if (desc.includes('unisex')) return 'Unisex';
  if (desc.includes('women')) return 'Women';
  if (/\bmen\b/i.test(desc)) return 'Men';
  if (desc.includes('kids') || desc.includes('kid')) return 'Kids';

  return 'Unisex'; // Fallback
};
