import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Container, Typography, Grid, Card, CardMedia, CardContent, 
  Button, Box, Pagination, Chip, CircularProgress, Alert,
  Breadcrumbs, Link as MuiLink
} from '@mui/material';
import { Link } from 'react-router-dom';
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
  
  // Get category info
  const categoryInfo = category ? categoryMap[category.toLowerCase()] : null;

  // Load products when component mounts or category changes
  useEffect(() => {
    if (categoryInfo) {
      fetchProductsByCategory(categoryInfo.name);
    }
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
      <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, md: 4 } }}>
        {/* Breadcrumbs navigation */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <MuiLink component={Link} to="/" color="inherit">
            Trang chủ
          </MuiLink>
          <MuiLink component={Link} to="/categories" color="inherit">
            Danh mục
          </MuiLink>
          {categoryInfo && (
            <Typography color="text.primary">{categoryInfo.displayName}</Typography>
          )}
        </Breadcrumbs>
        
        {/* Product List Section */}
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
          {categoryInfo ? (
            <>
              <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
                Sản phẩm {categoryInfo.displayName}
              </Typography>
              
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
                  <Grid container spacing={3}>
                    {displayedProducts.map((product) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
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
                          <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {product.product_type}
                            </Typography>
                            <Typography variant="h6" component="h3" sx={{ flexGrow: 1 }}>
                              {product.product_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, minHeight: '40px' }}>
                              {product.product_description.length > 60 
                                ? `${product.product_description.substring(0, 60)}...` 
                                : product.product_description}
                            </Typography>
                            <Typography variant="body1" color="text.primary" sx={{ fontWeight: 'bold', mt: 1 }}>
                              {formatPrice(product.product_price)}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                              <Chip 
                                label={product.product_quantity > 0 ? "Còn hàng" : "Hết hàng"} 
                                color={product.product_quantity > 0 ? "success" : "error"} 
                                size="small" 
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
                              >
                                Mua ngay
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                  
                  {/* Pagination */}
                  {pageCount > 1 && (
                    <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
                      <Pagination 
                        count={pageCount} 
                        page={page} 
                        onChange={handlePageChange} 
                        color="primary" 
                        size="large"
                      />
                    </Box>
                  )}
                </>
              )}
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