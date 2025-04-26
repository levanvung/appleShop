import { apiClient } from './config';

export interface ProductAttribute {
  manufacturer: string;
  model: string;
  color: string;
}

export interface ProductShop {
  name: string;
  email: string;
}

export interface Product {
  _id: string;
  product_name: string;
  product_thumb: string;
  product_description: string;
  product_price: number;
  product_quantity: number;
  product_type: string;
  product_shop: ProductShop;
  product_attributes: ProductAttribute;
  product_images?: string[]; // Optional array of images
  product_colors?: string[]; // Optional array of colors
  product_sizes?: string[];  // Optional array of sizes
  isDraft: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  message: string;
  code: number;
  metadata: Product | Product[]; // Metadata can be a single Product object or an array of Products
}

export const productService = {
  getPublishedProducts: async (): Promise<ProductsResponse> => {
    try {
      console.log('Fetching published products'); // For debugging
      const response = await apiClient.get('/product/published');
      return response.data;
    } catch (error) {
      console.error('Error fetching published products:', error);
      throw error;
    }
  },

  getProductById: async (productId: string): Promise<ProductsResponse> => {
    try {
      console.log(`Fetching product with ID ${productId}`); // For debugging
      const response = await apiClient.get(`/product/findOne/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with ID ${productId}:`, error);
      throw error;
    }
  },
  
  searchProductsByCategory: async (category: string): Promise<ProductsResponse> => {
    try {
      console.log(`Searching products for category ${category}`); // For debugging
      const response = await apiClient.get(`/product/search/${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error searching products for category ${category}:`, error);
      throw error;
    }
  }
}; 