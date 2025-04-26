import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent, Button, Box, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { productService, Product } from '../../api/product';
import './Home.css';

interface LocationState {
  loginSuccess?: boolean;
  signupSuccess?: boolean;
}

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'info' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success'
  });
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getPublishedProducts();
        // Kiểm tra và chuyển đổi metadata thành mảng
        if (response.metadata) {
          const productsData = Array.isArray(response.metadata) 
            ? response.metadata 
            : [response.metadata];
          setProducts(productsData);
        } else {
          setProducts([]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Check if user came from login/signup
  useEffect(() => {
    const state = location.state as LocationState;
    
    if (state?.loginSuccess && user) {
      setNotification({
        show: true,
        message: `Đăng nhập thành công! Chào mừng ${user.name || 'bạn'} quay trở lại.`,
        type: 'success'
      });
      
      // Clear the state to prevent showing notification again on refresh
      window.history.replaceState({}, document.title);
    } else if (state?.signupSuccess && user) {
      setNotification({
        show: true,
        message: `Đăng ký thành công! Chào mừng ${user.name || 'bạn'} đến với Apple Store.`,
        type: 'success'
      });
      
      // Clear the state to prevent showing notification again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location, user]);

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      show: false
    });
  };

  // Function to handle product click
  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  // Format price with Vietnamese currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="home" style={{ width: '100%', maxWidth: '100%' }}>
      <div className="hero-section">
        <Container maxWidth={false} sx={{ width: '100%', maxWidth: '100%' }}>
          <Box className="hero-content" sx={{ mx: 'auto', px: 3 }}>
            <Typography variant="h2" component="h1" gutterBottom>
              Thiết bị di động cao cấp
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
              Trải nghiệm công nghệ đỉnh cao với những sản phẩm chất lượng
            </Typography>
            <Button variant="contained" color="primary" size="large">
              Khám phá ngay
            </Button>
          </Box>
        </Container>
      </div>

      <Container maxWidth="xl" sx={{ py: 8, px: { xs: 3, md: 4 } }}>
        <Typography variant="h4" component="h2" gutterBottom textAlign="center" mb={5}>
          Sản phẩm nổi bật
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 3 }}>{error}</Alert>
        ) : products.length === 0 ? (
          <Alert severity="info" sx={{ my: 3 }}>Không có sản phẩm nào.</Alert>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Grid container spacing={4} justifyContent="center" sx={{ mx: 'auto' }}>
              {products.map((product) => (
                <Grid 
                  item
                  component="div"
                  key={product._id} 
                  xs={12} 
                  sm={6} 
                  md={3}
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
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {product.product_type}
                      </Typography>
                      <Typography variant="h6" component="h3" sx={{ flexGrow: 1 }}>
                        {product.product_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, minHeight: '40px' }}>
                        {product.product_description && product.product_description.length > 60 
                          ? `${product.product_description.substring(0, 60)}...` 
                          : product.product_description || 'Không có mô tả'}
                      </Typography>
                      <Typography variant="body1" color="text.primary" sx={{ fontWeight: 'bold', mt: 1 }}>
                        {formatPrice(product.product_price)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>

      <div className="cta-section">
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom>
            Đăng ký nhận thông tin ưu đãi
          </Typography>
          <Typography variant="body1" paragraph>
            Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt
          </Typography>
          <Button variant="contained" color="primary" size="large">
            Đăng ký ngay
          </Button>
        </Container>
      </div>

      <Snackbar
        open={notification.show}
        autoHideDuration={5000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.type} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Home; 