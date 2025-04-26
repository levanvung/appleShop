import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Container, Typography, Card, CardMedia, CardContent, 
  Button, Box, Pagination, Chip, CircularProgress, Alert
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import './Products.css';
import { productService, Product } from '../../api/product';

// Fixed categories
const categoryMap = {
  "iphone": {
    name: "IPHONE",
    displayName: "iPhone"
  },
  "ipad": {
    name: "IPAD",
    displayName: "iPad"
  },
  "macbook": {
    name: "MACBOOK",
    displayName: "MacBook"
  },
  "airpods": {
    name: "AIRPODS",
    displayName: "AirPods"
  }
};

const ProductList = () => {
  const navigate = useNavigate();
  const { category } = useParams<{ category?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  
  // Type safety for category lookup
  const safeCategory = category ? (categoryMap[category.toLowerCase() as keyof typeof categoryMap] || null) : null;

  // Load products when component mounts or category changes
  useEffect(() => {
    if (safeCategory) {
      fetchProductsByCategory(safeCategory.name);
    }
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, [category]);

  const fetchProductsByCategory = async (categoryName: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.searchProductsByCategory(categoryName);
      if (Array.isArray(response.metadata)) {
        setProducts(response.metadata);
      } else {
        setProducts([]);
      }
      setLoading(false);
    } catch (err) {
      console.error(`Error fetching products for category ${categoryName}:`, err);
      setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  // Pagination
  const productsPerPage = 8;
  const pageCount = Math.ceil(products.length / productsPerPage);
  const displayedProducts = products.slice(
    (page - 1) * productsPerPage, 
    page * productsPerPage
  );

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  // Format price with Vietnamese currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="products">
      <Container maxWidth="xl" sx={{ py: 6, px: { xs: 2, md: 4 } }}>
        {/* Product List Section */}
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
          {safeCategory ? (
            <>
              <Typography 
                variant="h3" 
                component="h1" 
                className="product-title"
                align="center"
                gutterBottom 
                sx={{ mb: 4 }}
              >
                Sản phẩm {safeCategory.displayName}
              </Typography>
              
              <Box className="products-container">
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                    <CircularProgress />
                  </Box>
                ) : error ? (
                  <Alert severity="error" sx={{ my: 3 }}>{error}</Alert>
                ) : products.length === 0 ? (
                  <Alert severity="info" sx={{ my: 3 }}>Không có sản phẩm nào trong danh mục này.</Alert>
                ) : (
                  <>
                    {/* Products Grid */}
                    <Box className="grid-container">
                      {displayedProducts.map((product) => (
                        <Box 
                          className="grid-item" 
                          key={product._id}
                          sx={{ 
                            width: { xs: '100%', sm: '50%', md: '33.33%', lg: '25%' },
                            height: '420px'
                          }}
                        >
                          <Card 
                            className="product-card"
                            onClick={() => handleProductClick(product._id)}
                            sx={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}
                          >
                            <CardMedia
                              component="img"
                              image={product.product_thumb || `https://placehold.co/300x200/333/fff?text=${encodeURIComponent(product.product_name)}`}
                              alt={product.product_name}
                              sx={{ height: 200, objectFit: 'contain' }}
                            />
                            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                              <Box>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  {product.product_type}
                                </Typography>
                                <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
                                  {product.product_name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: '40px' }}>
                                  {product.product_description.length > 60 
                                    ? `${product.product_description.substring(0, 60)}...` 
                                    : product.product_description}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold', mb: 2 }}>
                                  {formatPrice(product.product_price)}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Chip 
                                    label={product.product_quantity > 0 ? "Còn hàng" : "Hết hàng"} 
                                    color={product.product_quantity > 0 ? "success" : "error"} 
                                    size="small" 
                                    sx={{ fontWeight: 500 }}
                                  />
                                  <Button 
                                    variant="contained" 
                                    color="primary" 
                                    size="small"
                                    disabled={product.product_quantity <= 0}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleProductClick(product._id);
                                    }}
                                    startIcon={<ShoppingCartIcon />}
                                    sx={{ 
                                      borderRadius: '20px',
                                      textTransform: 'none',
                                      fontWeight: 600
                                    }}
                                  >
                                    Mua ngay
                                  </Button>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        </Box>
                      ))}
                    </Box>
                    
                    {/* Pagination */}
                    {pageCount > 1 && (
                      <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
                        <Pagination 
                          count={pageCount} 
                          page={page} 
                          onChange={handlePageChange} 
                          color="primary" 
                          size="large"
                          sx={{ '& .MuiPaginationItem-root': { color: 'white' } }}
                        />
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </>
          ) : (
            <Alert severity="warning" sx={{ my: 5 }}>Danh mục không hợp lệ. Vui lòng chọn một danh mục khác.</Alert>
          )}
        </Box>
      </Container>
    </div>
  );
};

export default ProductList; 