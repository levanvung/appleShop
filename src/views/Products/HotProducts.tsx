import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Card, CardMedia, CardContent, 
  Button, Box, Chip, CircularProgress, Alert
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { productService, Product } from '../../api/product';
import { formatCurrency } from '../../utils/formatters';
import './Products.css';

const HotProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load hot products when component mounts
  useEffect(() => {
    fetchHotProducts();
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  const fetchHotProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getHotProducts();
      
      if (Array.isArray(response.metadata)) {
        setProducts(response.metadata);
      } else {
        // Handle the case where metadata is a single product
        setProducts([response.metadata]);
      }
    } catch (err) {
      console.error('Failed to fetch hot products:', err);
      setError('Không thể tải danh sách sản phẩm nổi bật. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <LocalFireDepartmentIcon sx={{ color: 'error.main', mr: 1, fontSize: 32 }} />
        <Typography variant="h4" component="h1" fontWeight="bold">
          Sản phẩm nổi bật
        </Typography>
      </Box>

      {products.length === 0 ? (
        <Alert severity="info">Hiện tại chưa có sản phẩm nổi bật.</Alert>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', margin: -1.5 }}>
          {products.map((product) => (
            <Box key={product._id} sx={{ width: { xs: '100%', sm: '50%', md: '33.33%' }, padding: 1.5 }}>
              <Card 
                className="product-card"
                onClick={() => handleProductClick(product._id)}
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    image={product.product_thumb}
                    alt={product.product_name}
                    sx={{ 
                      height: 200, 
                      objectFit: 'contain',
                      backgroundColor: '#f5f5f5',
                      pt: 2
                    }}
                  />
                  <Chip 
                    icon={<LocalFireDepartmentIcon />}
                    label="Hot"
                    color="error"
                    size="small"
                    sx={{ 
                      position: 'absolute', 
                      top: 10, 
                      right: 10,
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {product.product_name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mb: 2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                  >
                    {product.product_description}
                  </Typography>
                  <Box sx={{ mt: 'auto' }}>
                    <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mb: 1 }}>
                      {formatCurrency(product.product_price)} đ
                    </Typography>
                    <Chip 
                      label={product.stock_status === 'in_stock' ? "Còn hàng" : "Hết hàng"} 
                      color={product.stock_status === 'in_stock' ? "success" : "error"} 
                      size="small" 
                    />
                  </Box>
                </CardContent>
                <Button 
                  variant="contained" 
                  startIcon={<ShoppingCartIcon />}
                  fullWidth
                  sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                  disabled={product.stock_status !== 'in_stock'}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/product/${product._id}`);
                  }}
                >
                  Xem chi tiết
                </Button>
              </Card>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default HotProducts; 