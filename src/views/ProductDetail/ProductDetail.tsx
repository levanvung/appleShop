import React, { useState, useRef } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Chip, 
  IconButton, 
  Rating, 
  Snackbar,
  Paper,
  Divider
} from '@mui/material';
import Grid from '@mui/material/Grid';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { ShoppingCart, Favorite, Share, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useCart, CartItemType } from '../../contexts/CartContext';
import './ProductDetail.css';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Color name mapping for display purposes
const colorMap: Record<string, string> = {
  "#000000": "Black",
  "#FFFFFF": "White",
  "#6F8FAF": "Steel Blue",
};

// Mock product data
const products = [
  {
    id: 1,
    name: 'Premium Leather Jacket',
    price: 299.99,
    rating: 4.5,
    reviewCount: 128,
    description: 'Genuine leather jacket with premium stitching and comfortable fit. Perfect for all seasons.',
    details: [
      'Genuine Leather Material',
      'Premium Stitching',
      'Comfortable Fit',
      'Multiple Pockets',
      'Water Resistant'
    ],
    colors: ['#000000', '#784212', '#5D6D7E'],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      '/images/products/leather-jacket-1.jpg',
      '/images/products/leather-jacket-2.jpg',
      '/images/products/leather-jacket-3.jpg',
      '/images/products/leather-jacket-4.jpg'
    ],
    promotions: [
      'Free Shipping',
      '30-Day Returns',
      '2-Year Warranty'
    ]
  }
];

const ProductDetail = () => {
  const { productId } = useParams();
  const product = products.find(p => p.id === Number(productId)) || products[0];
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[1]);
  const [quantity, setQuantity] = useState(1);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  const { addToCart } = useCart();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handlePrevImage = () => {
    setSelectedImageIndex(prev => (prev > 0 ? prev - 1 : product.images.length - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex(prev => (prev < product.images.length - 1 ? prev + 1 : 0));
  };

  const handleAddToCart = () => {
    // Prepare cart item
    const cartItem: CartItemType = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[selectedImageIndex],
      color: selectedColor,
      size: selectedSize,
      quantity: quantity
    };
    
    // Add to cart
    addToCart(cartItem);
    
    // Show success message
    setOpenSnackbar(true);
  };

  const handleBuyNow = () => {
    // Add to cart and redirect to checkout
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
      image: product.images[selectedImageIndex]
    });
    
    // Redirect to checkout (implement later)
    console.log('Redirecting to checkout...');
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleQuantityChange = (amount: number) => {
    const newQuantity = Math.max(1, quantity + amount);
    setQuantity(newQuantity);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const handleImageSelect = (image: string) => {
    setSelectedImageIndex(product.images.indexOf(image));
  };

  return (
    <Container className="product-detail-page">
      <Grid container spacing={4} sx={{ py: 4 }}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 2, overflow: 'hidden' }}>
            <Box className="product-image-container">
              <img 
                src={product.images[selectedImageIndex] || '/images/placeholder.jpg'} 
                alt={product.name} 
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
              />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <IconButton onClick={handlePrevImage}>
                <ArrowBackIos />
              </IconButton>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {product.images.map((img, index) => (
                  <Box 
                    key={index}
                    sx={{
                      width: 60,
                      height: 60,
                      border: index === selectedImageIndex ? '2px solid #1976d2' : '1px solid #ddd',
                      borderRadius: 1,
                      overflow: 'hidden',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleImageSelect(img)}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} ${index + 1}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </Box>
                ))}
              </Box>
              <IconButton onClick={handleNextImage}>
                <ArrowForwardIos />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
        
        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={product.rating} precision={0.5} readOnly />
            <Typography variant="body2" sx={{ ml: 1 }}>
              ({product.reviewCount} reviews)
            </Typography>
          </Box>
          
          <Typography variant="h5" component="p" sx={{ fontWeight: 'bold', my: 2 }}>
            ${product.price.toFixed(2)}
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3 }}>
            {product.description}
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          {/* Color Selection */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
              Color: {colorMap[selectedColor]}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {product.colors.map((color) => (
                <Box
                  key={color}
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: color,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    border: selectedColor === color ? '2px solid #1976d2' : '1px solid #e0e0e0',
                    boxShadow: selectedColor === color ? 2 : 0,
                    '&:hover': {
                      opacity: 0.8,
                    },
                  }}
                  onClick={() => handleColorSelect(color)}
                />
              ))}
            </Box>
          </Box>
          
          {/* Size Selection */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
              Size: {selectedSize}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  variant={selectedSize === size ? 'contained' : 'outlined'}
                  sx={{
                    minWidth: 40,
                    height: 40,
                  }}
                >
                  {size}
                </Button>
              ))}
            </Box>
          </Box>
          
          {/* Quantity */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
              Quantity:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                size="small"
              >
                <RemoveIcon />
              </IconButton>
              <Typography sx={{ mx: 2, minWidth: 30, textAlign: 'center' }}>
                {quantity}
              </Typography>
              <IconButton 
                onClick={() => handleQuantityChange(1)}
                size="small"
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button 
              variant="contained" 
              size="large" 
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              ref={buttonRef}
              sx={{ flex: 1 }}
            >
              Add to Cart
            </Button>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              onClick={handleBuyNow}
              sx={{ flex: 1 }}
            >
              Buy Now
            </Button>
            <IconButton color="primary">
              <Favorite />
            </IconButton>
            <IconButton color="primary">
              <Share />
            </IconButton>
          </Box>
          
          {/* Product Details */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Product Details:
            </Typography>
            <ul>
              {product.details.map((detail, index) => (
                <li key={index}>
                  <Typography variant="body2">{detail}</Typography>
                </li>
              ))}
            </ul>
          </Box>
          
          {/* Promotions */}
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Promotions:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {product.promotions.map((promo, index) => (
                <Chip key={index} label={promo} color="success" variant="outlined" />
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
      
      {/* Success Snackbar */}
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{ zIndex: 9999 }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          Đã thêm sản phẩm vào giỏ hàng thành công!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductDetail; 