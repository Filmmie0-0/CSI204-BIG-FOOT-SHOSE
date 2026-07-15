export const translations = {
  en: {
    nav: {
      newArrivals: 'New Arrivals',
      men: 'Men',
      women: 'Women',
      searchPlaceholder: 'Search products...',
      viewAllResults: 'View all results',
      dashboard: 'Dashboard',
      signIn: 'Sign In'
    },
    home: {
      heroTitle: 'Step Into',
      heroTitleHighlight: 'Greatness.',
      heroDesc: 'Experience the perfect blend of premium comfort, cutting-edge style, and unmatched durability.',
      shopNow: 'Shop Now',
      newArrivals: 'New Arrivals',
      productsFound: 'Products Found',
      filter: 'Filter',
      noProducts: 'No products available',
      noProductsDesc: 'Please make sure your database server is connected or try a different search keyword.'
    }
  },
  th: {
    nav: {
      newArrivals: 'สินค้าใหม่',
      men: 'ผู้ชาย',
      women: 'ผู้หญิง',
      searchPlaceholder: 'ค้นหาสินค้า...',
      viewAllResults: 'ดูผลลัพธ์ทั้งหมด',
      dashboard: 'แดชบอร์ด',
      signIn: 'เข้าสู่ระบบ'
    },
    home: {
      heroTitle: 'ก้าวสู่ความ',
      heroTitleHighlight: 'ยิ่งใหญ่',
      heroDesc: 'สัมผัสความนุ่มสบายระดับพรีเมียม ดีไซน์ล้ำสมัย และความทนทานที่ไม่มีใครเทียบได้',
      shopNow: 'ช้อปเลย',
      newArrivals: 'สินค้าใหม่',
      productsFound: 'รายการที่พบ',
      filter: 'ตัวกรอง',
      noProducts: 'ไม่มีสินค้าจำหน่าย',
      noProductsDesc: 'โปรดตรวจสอบการเชื่อมต่อฐานข้อมูล หรือลองใช้คำค้นหาอื่น'
    }
  }
}

export const getTranslation = (lang, section, key) => {
  return translations[lang]?.[section]?.[key] || translations['en'][section]?.[key] || key;
}
