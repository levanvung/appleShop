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
      // Get user ID and access token from localStorage
      const userId = localStorage.getItem('userId') || JSON.parse(localStorage.getItem('userInfo') || '{}')._id;
      const accessToken = localStorage.getItem('accessToken');
      
      // Configure headers
      const headers: Record<string, string> = {};
      if (userId) {
        headers['x-client-id'] = userId;
      }
      if (accessToken) {
        // Send only the token without 'Bearer ' prefix
        headers['authorization'] = accessToken;
      }
      
      console.log('API Headers:', headers); // For debugging
      const response = await apiClient.get('/product/published', { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching published products:', error);
      throw error;
    }
  },

  getProductById: async (productId: string): Promise<ProductsResponse> => {
    try {
      // Get user ID and access token from localStorage
      const userId = localStorage.getItem('userId') || JSON.parse(localStorage.getItem('userInfo') || '{}')._id;
      const accessToken = localStorage.getItem('accessToken');
      
      // Configure headers
      const headers: Record<string, string> = {};
      if (userId) {
        headers['x-client-id'] = userId;
      }
      if (accessToken) {
        // Send only the token without 'Bearer ' prefix
        headers['authorization'] = accessToken;
      }
      
      console.log(`API Headers for product ${productId}:`, headers); // For debugging
      const response = await apiClient.get(`/product/findOne/${productId}`, { headers });
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with ID ${productId}:`, error);
      throw error;
    }
  }
}; 