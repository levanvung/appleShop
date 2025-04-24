import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Grid, Card, CardMedia, CardContent, 
  Button, Box, FormControl, InputLabel, Select, MenuItem, TextField,
  Pagination, Chip, Rating, SelectChangeEvent
} from '@mui/material';
import './Products.css';

// Mock product data
const products = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    price: '29.990.000 ₫',
    image: 'https://placehold.co/300x200/333/fff?text=iPhone+15+Pro',
    category: 'Điện thoại',
    rating: 4.8,
    inStock: true
  },
  {
    id: 2,
    name: 'MacBook Pro M3',
    price: '49.990.000 ₫',
    image: 'https://placehold.co/300x200/333/fff?text=MacBook+Pro+M3',
    category: 'Laptop',
    rating: 4.9,
    inStock: true
  },
  {
    id: 3,
    name: 'iPad Pro',
    price: '24.990.000 ₫',
    image: 'https://placehold.co/300x200/333/fff?text=iPad+Pro',
    category: 'Máy tính bảng',
    rating: 4.7,
    inStock: true
  },
  {
    id: 4,
    name: 'AirPods Pro',
    price: '6.990.000 ₫',
    image: 'https://placehold.co/300x200/333/fff?text=AirPods+Pro',
    category: 'Tai nghe',
    rating: 4.6,
    inStock: true
  },
  {
    id: 5,
    name: 'Apple Watch Series 9',
    price: '12.990.000 ₫',
    image: 'https://placehold.co/300x200/333/fff?text=Apple+Watch+S9',
    category: 'Smart Watch',
    rating: 4.5,
    inStock: true
  },
  {
    id: 6,
    name: 'iMac M3',
    price: '39.990.000 ₫',
    image: 'https://placehold.co/300x200/333/fff?text=iMac+M3',
    category: 'Máy tính để bàn',
    rating: 4.7,
    inStock: false
  },
  {
    id: 7,
    name: 'Mac Mini M2',
    price: '15.990.000 ₫',
    image: 'https://placehold.co/300x200/333/fff?text=Mac+Mini+M2',
    category: 'Máy tính để bàn',
    rating: 4.6,
    inStock: true
  },
  {
    id: 8,
    name: 'AirPods Max',
    price: '13.990.000 ₫',
    image: 'https://placehold.co/300x200/333/fff?text=AirPods+Max',
    category: 'Tai nghe',
    rating: 4.4,
    inStock: true
  },
  {
    id: 9,
    name: 'iPhone 16 Promax',
    price: '24.090.000₫',
    image: 'https://placehold.co/300x200/333/fff?text=iPhone+16+Promax',
    category: 'Điện thoại',
    rating: 4.9,
    inStock: true
  }
];

const categories = [
  'Tất cả',
  'Điện thoại',
  'Laptop',
  'Máy tính bảng',
  'Tai nghe',
  'Smart Watch',
  'Máy tính để bàn'
];

const Products = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState('Tất cả');
  const [sortBy, setSortBy] = useState('default');
  const [page, setPage] = useState(1);

  // Filter products by category
  const filteredProducts = category === 'Tất cả' 
    ? products 
    : products.filter(product => product.category === category);

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') {
      return parseInt(a.price.replace(/\D/g, '')) - parseInt(b.price.replace(/\D/g, ''));
    } else if (sortBy === 'price-desc') {
      return parseInt(b.price.replace(/\D/g, '')) - parseInt(a.price.replace(/\D/g, ''));
    } else if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    return 0;
  });

  // Pagination
  const productsPerPage = 8;
  const pageCount = Math.ceil(sortedProducts.length / productsPerPage);
  const displayedProducts = sortedProducts.slice(
    (page - 1) * productsPerPage, 
    page * productsPerPage
  );

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setCategory(event.target.value);
    setPage(1);
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortBy(event.target.value);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="products">
      <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, md: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
          Sản phẩm
        </Typography>
        
        {/* Filters */}
        <Box sx={{ maxWidth: 1400, mx: 'auto', mb: 5 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Danh mục</InputLabel>
                <Select value={category} onChange={handleCategoryChange} label="Danh mục">
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sắp xếp theo</InputLabel>
                <Select value={sortBy} onChange={handleSortChange} label="Sắp xếp theo">
                  <MenuItem value="default">Mặc định</MenuItem>
                  <MenuItem value="price-asc">Giá: Thấp đến cao</MenuItem>
                  <MenuItem value="price-desc">Giá: Cao đến thấp</MenuItem>
                  <MenuItem value="rating">Đánh giá cao nhất</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={12} md={6}>
              <TextField
                fullWidth
                label="Tìm kiếm sản phẩm"
                variant="outlined"
                placeholder="Nhập tên sản phẩm..."
              />
            </Grid>
          </Grid>
        </Box>
        
        {/* Products */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: 1400, mx: 'auto' }}>
            {displayedProducts.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                <Card 
                  className="product-card"
                  onClick={() => handleProductClick(product.id)}
                >
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
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
                      <Rating value={product.rating} precision={0.1} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {product.rating}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      <Typography variant="body1" color="text.primary" sx={{ fontWeight: 'bold' }}>
                        {product.price}
                      </Typography>
                      <Chip 
                        label={product.inStock ? "Còn hàng" : "Hết hàng"} 
                        color={product.inStock ? "success" : "error"} 
                        size="small" 
                      />
                    </Box>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth 
                      sx={{ mt: 2 }}
                      disabled={!product.inStock}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product.id);
                      }}
                    >
                      Mua ngay
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
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
            />
          </Box>
        )}
      </Container>
    </div>
  );
};

export default Products; 