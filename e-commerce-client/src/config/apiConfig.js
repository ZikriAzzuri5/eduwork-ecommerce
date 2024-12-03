const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  PRODUCTS: `${API_BASE_URL}/product`,
  PRODUCT_DETAIL: (id) => `${API_BASE_URL}/single/${id}`,
  PRODUCT_IMAGE_BASE_URL: `https://sistemtoko.com/img/user/demo/product/`,
  PRODUCT_VARIANT: (id) => `${API_BASE_URL}/varian/${id}`,
  PRODUCT_CATEGORIES: `${API_BASE_URL}/cat`,
  PRODUCT_KEYWORD: `${API_BASE_URL}/categories`,

  SUBMIT_ORDER: `https://demo.sistemtoko.com/public/demo/web_order`,
  INVOICE: `https://demo.sistemtoko.com/public/show_invoice/`,
};
