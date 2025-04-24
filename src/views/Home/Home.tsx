import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent, Button, Box, Snackbar, Alert } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

const featuredProducts = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    price: '29.990.000 ₫',
    image: 'https://placehold.co/300x200/333/fff?text=iPhone+15+Pro',
    category: 'Điện thoại'
  },
  {
    id: 2,
    name: 'MacBook Pro M3',
    price: '49.990.000 ₫',
    image: 'https://placehold.co/300x200/333/fff?text=MacBook+Pro+M3',
    category: 'Laptop'
  },
  {
    id: 3,
    name: 'iPad Pro',
    price: '24.990.000 ₫',
    image: 'https://placehold.co/300x200/333/fff?text=iPad+Pro',
    category: 'Máy tính bảng'
  },
  {
    id: 4,
    name: 'AirPods Pro',
    price: '6.990.000 ₫',
    image: 'https://placehold.co/300x200/333/fff?text=AirPods+Pro',
    category: 'Tai nghe'
  }
];

interface LocationState {
  loginSuccess?: boolean;
  signupSuccess?: boolean;
}

const Home = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'info';
  }>({
    show: false,
    message: '',
    type: 'success'
  });

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

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Grid container spacing={4} justifyContent="center" sx={{ mx: 'auto' }}>
            {featuredProducts.map((product) => (
              <Grid 
                item
                key={product.id} 
                xs={12} 
                sm={6} 
                md={3}
              >
                <Card className="product-card">
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.name}
                    height="200"
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {product.category}
                    </Typography>
                    <Typography variant="h6" component="h3">
                      {product.name}
                    </Typography>
                    <Typography variant="body1" color="text.primary" sx={{ fontWeight: 'bold', mt: 1 }}>
                      {product.price}
                    </Typography>
                    <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
                      Mua ngay
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
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