import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardMedia, CardContent, Button, Box, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Carousel from 'react-material-ui-carousel';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAuth } from '../../context/AuthContext';
import { productService, Product } from '../../api/product';
import './Home.css';

interface LocationState {
  loginSuccess?: boolean;
  signupSuccess?: boolean;
}

interface BannerItem {
  id: number;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
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

  const bannerItems: BannerItem[] = [
    {
      id: 1,
      image: 'https://i0.wp.com/blog.ugreen.com/wp-content/uploads/2020/10/iphone-12-banner-1.png?fit=1140%2C680&ssl=1',
      title: 'iPhone 15 Pro',
      description: 'Trải nghiệm điện thoại cao cấp với công nghệ đỉnh cao',
      buttonText: 'Mua ngay',
      buttonLink: '/products/iphone'
    },
    {
      id: 2,
      image: 'https://tiendung.vn/images/product/iphone-16/2024-Banner-apple-iphone-16-pro.jpg?1725963330231',
      title: 'iPad Pro',
      description: 'Mạnh mẽ và linh hoạt, iPad Pro mới với chip M2',
      buttonText: 'Khám phá',
      buttonLink: '/products/ipad'
    },
    {
      id: 3,
      image: 'https://applescoop.org/image/story/iphone-18-rumors-variable-aperture-lenses-for-pro-models-applescoop-2024-11-09-13-23-19.jpg',
      title: 'MacBook Air',
      description: 'Mỏng nhẹ và mạnh mẽ với thời lượng pin cả ngày',
      buttonText: 'Tìm hiểu thêm',
      buttonLink: '/products/macbook'
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getPublishedProducts();
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

  useEffect(() => {
    const state = location.state as LocationState;
    
    if (state?.loginSuccess && user) {
      setNotification({
        show: true,
        message: `Đăng nhập thành công! Chào mừng ${user.name || 'bạn'} quay trở lại.`,
        type: 'success'
      });
      window.history.replaceState({}, document.title);
    } else if (state?.signupSuccess && user) {
      setNotification({
        show: true,
        message: `Đăng ký thành công! Chào mừng ${user.name || 'bạn'} đến với Apple Store.`,
        type: 'success'
      });
      window.history.replaceState({}, document.title);
    }
  }, [location, user]);

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      show: false
    });
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleBannerButtonClick = (link: string) => {
    navigate(link);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="home" style={{ width: '100%', maxWidth: '100%' }}>
      <div className="banner-slider">
        <Carousel
          animation="fade"
          autoPlay
          indicators
          navButtonsAlwaysVisible
          interval={6000}
          duration={1000}
          swipe
          sx={{ width: '100%' }}
        >
          {bannerItems.map((item) => (
            <div key={item.id} className="banner-item">
              <Box 
                sx={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${item.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '500px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  transition: 'all 0.5s ease-in-out'
                }}
              >
                <Container maxWidth="md">
                  <Box className="banner-content" sx={{ textAlign: 'center', color: 'white' }}>
                    <Typography variant="h2" component="h1" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4 }}>
                      {item.description}
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="large"
                      onClick={() => handleBannerButtonClick(item.buttonLink)}
                      className="banner-button"
                      sx={{
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 6px 10px rgba(0, 0, 0, 0.3)'
                        }
                      }}
                    >
                      {item.buttonText}
                    </Button>
                  </Box>
                </Container>
              </Box>
            </div>
          ))}
        </Carousel>
      </div>

      <div className="featured-products-section">
        <Container maxWidth="xl" sx={{ py: 8, px: { xs: 3, md: 4 } }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom 
            textAlign="center" 
            mb={5}
            className="featured-products-title"
          >
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
            <Box 
              sx={{ 
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                margin: '-16px'
              }}
            >
              {products.map((product) => (
                <Box
                  key={product._id}
                  sx={{
                    width: {
                      xs: '100%',
                      sm: '50%',
                      md: '25%'
                    },
                    padding: '16px',
                    boxSizing: 'border-box'
                  }}
                >
                  <Card 
                    className="featured-product-card"
                    onClick={() => handleProductClick(product._id)}
                    sx={{ 
                      width: '100%',
                      cursor: 'pointer', 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column'
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={product.product_thumb || `https://placehold.co/300x200/333/fff?text=${encodeURIComponent(product.product_name)}`}
                      alt={product.product_name}
                      sx={{ height: 300, objectFit: 'contain', padding: '16px', backgroundColor: '#000' }}
                    />
                    <CardContent className="featured-product-info" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', backgroundColor: 'transparent !important' }}>
                      <Typography className="featured-product-price" variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {formatPrice(product.product_price)}
                      </Typography>
                      <Typography className="featured-product-title" variant="body1" sx={{ mb: 1 }}>
                        {product.product_name}
                      </Typography>
                      <Typography className="featured-product-description" variant="body2" sx={{ mb: 2 }}>
                        {product.product_description}
                      </Typography>
                      
                      {/* Conditional Rendering based on stock_status */}
                      {product.stock_status === 'out_of_stock' ? (
                        <Typography 
                          variant="button" 
                          color="error" 
                          sx={{ fontWeight: 'bold', mt: 1 }}
                        >
                          Hết hàng !!
                        </Typography>
                      ) : (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick(product._id);
                          }}
                          className="featured-product-button"
                          sx={{ textTransform: 'none' }}
                        >
                          <ShoppingCartIcon sx={{ mr: 1 }} />
                          Xem
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          )}
        </Container>
      </div>

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