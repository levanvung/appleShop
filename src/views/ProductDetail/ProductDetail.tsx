import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Chip, 
  IconButton, 
  Snackbar,
  Paper,
  Divider,
  CircularProgress,
  Alert as MuiAlert
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { AlertProps } from '@mui/material/Alert';
import { ShoppingCart, Favorite, Share, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import type { CartItem } from '../../context/CartContext';
import { productService, Product } from '../../api/product';
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

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('Sản phẩm đã được thêm vào giỏ hàng!');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) {
        setError('Product ID not found.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await productService.getProductById(id!);
        // Check if metadata is an object (not an array)
        if (response.metadata && typeof response.metadata === 'object' && !Array.isArray(response.metadata)) {
          // Directly use the metadata object as the product
          const fetchedProduct = response.metadata as Product;
          setProduct(fetchedProduct);
          // Set initial selected color/size based on new fields
          if (fetchedProduct.product_colors && fetchedProduct.product_colors.length > 0) {
            setSelectedColor(fetchedProduct.product_colors[0]);
          } else if (fetchedProduct.product_attributes?.color) {
            // Use color from product_attributes if product_colors doesn't exist
            setSelectedColor(fetchedProduct.product_attributes.color);
          }
          
          if (fetchedProduct.product_sizes && fetchedProduct.product_sizes.length > 0) {
             setSelectedSize(fetchedProduct.product_sizes[0]);
          }
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handlePrevImage = () => {
    if (!product || !product.product_images || product.product_images.length === 0) return;
    setSelectedImageIndex(prev => (prev > 0 ? prev - 1 : product.product_images!.length - 1));
  };

  const handleNextImage = () => {
    if (!product || !product.product_images || product.product_images.length === 0) return;
    setSelectedImageIndex(prev => (prev < product.product_images!.length - 1 ? prev + 1 : 0));
  };

  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index);
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

  const handleAddToCart = async () => {
    if (!product) return;
    
    // Create the cart item
    const cartItem: CartItem = { 
      id: product._id, 
      name: product.product_name,
      fullName: product.product_name,
      price: product.product_price.toString(),
      image: product.product_images?.[selectedImageIndex] || product.product_thumb,
      color: selectedColor || product.product_colors?.[0] || '', 
      colorName: colorMap[selectedColor || product.product_colors?.[0] || ''] || 'Default',
      size: selectedSize || product.product_sizes?.[0] || '',
      quantity: quantity,
    };
    
    try {
      const result = await addToCart(cartItem);
      
      if (result.success) {
        setSnackbarMessage('Sản phẩm đã được thêm vào giỏ hàng!');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage(result.message || 'Không thể thêm sản phẩm vào giỏ hàng');
        setSnackbarSeverity('error');
      }
      
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      setSnackbarMessage('Lỗi kết nối, vui lòng thử lại sau.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    
    // Create the cart item
    const cartItem: CartItem = { 
      id: product._id, 
      name: product.product_name,
      fullName: product.product_name,
      price: product.product_price.toString(),
      image: product.product_images?.[selectedImageIndex] || product.product_thumb,
      color: selectedColor || product.product_colors?.[0] || '', 
      colorName: colorMap[selectedColor || product.product_colors?.[0] || ''] || 'Default',
      size: selectedSize || product.product_sizes?.[0] || '',
      quantity: quantity,
    };
    
    try {
      const result = await addToCart(cartItem);
      
      if (result.success) {
        // Proceed to checkout
        console.log('Redirecting to checkout...');
        // Logic to navigate to checkout page
        // navigate('/checkout');
      } else {
        // Show error
        setSnackbarMessage(result.message || 'Không thể thêm sản phẩm vào giỏ hàng');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Failed to process buy now:", error);
      setSnackbarMessage('Lỗi kết nối, vui lòng thử lại sau.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Render Loading state
  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  // Render Error state
  if (error) {
    return (
      <Container sx={{ textAlign: 'center', py: 5 }}>
        <MuiAlert severity="error">{error}</MuiAlert>
        <Button variant="outlined" onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Back to Home
        </Button>
      </Container>
    );
  }

  // Render Not Found state
  if (!product) {
    return (
      <Container sx={{ textAlign: 'center', py: 5 }}>
        <MuiAlert severity="warning">Product not found.</MuiAlert>
         <Button variant="outlined" onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Back to Home
        </Button>
      </Container>
    );
  }
  
  // Use optional chaining and nullish coalescing for safety
  const productImages = product?.product_images ?? [product?.product_thumb].filter(Boolean) as string[];
  const productColors = product?.product_colors ?? [];
  const productSizes = product?.product_sizes ?? [];

  return (
    <Container className="product-detail-page">
      <Grid container spacing={4} sx={{ py: 4 }}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 2, overflow: 'hidden' }}>
            <Box className="product-image-container" sx={{ height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img 
                src={productImages[selectedImageIndex] || '/images/placeholder.jpg'} 
                alt={product.product_name} 
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
              />
            </Box>
            
            {productImages.length > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <IconButton onClick={handlePrevImage} disabled={productImages.length <= 1}>
                  <ArrowBackIos />
                </IconButton>
                <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', flexGrow: 1, justifyContent: 'center' }}>
                  {productImages.map((img, index) => (
                    <Box 
                      key={index}
                      sx={{
                        minWidth: 60,
                        height: 60,
                        border: index === selectedImageIndex ? '2px solid #1976d2' : '1px solid #ddd',
                        borderRadius: 1,
                        overflow: 'hidden',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleImageSelect(index)}
                    >
                      <img 
                        src={img} 
                        alt={`${product.product_name} ${index + 1}`} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </Box>
                  ))}
                </Box>
                <IconButton onClick={handleNextImage} disabled={productImages.length <= 1}>
                  <ArrowForwardIos />
                </IconButton>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.product_name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Chip label={product.product_type} color="secondary" size="small" />
          </Box>
          
          <Typography variant="h5" component="p" sx={{ fontWeight: 'bold', my: 2, color: 'primary.main' }}>
            {formatPrice(product.product_price)}
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3 }}>
            {product.product_description || 'Không có mô tả'}
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          {/* Attributes Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>Details</Typography>
            <Typography variant="body2">Manufacturer: {product.product_attributes?.manufacturer || 'N/A'}</Typography>
            <Typography variant="body2">Model: {product.product_attributes?.model || 'N/A'}</Typography>
            {product.product_attributes?.color && !productColors.length && (
              <Typography variant="body2">Color: {product.product_attributes.color}</Typography>
            )}
          </Box>
          
          {/* Color Selection */}
          {productColors.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                Color: {colorMap[selectedColor] || selectedColor}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {productColors.map((color) => (
                  <Box
                    key={color}
                    sx={{
                      width: 30,
                      height: 30,
                      bgcolor: color,
                      borderRadius: '50%',
                      cursor: 'pointer',
                      border: selectedColor === color ? '2px solid #1976d2' : '1px solid #e0e0e0',
                      boxShadow: selectedColor === color ? 2 : 0,
                      '&:hover': { opacity: 0.8 },
                    }}
                    onClick={() => handleColorSelect(color)}
                  />
                ))}
              </Box>
            </Box>
          )}
          
          {/* Size Selection */}
          {productSizes.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                Size: {selectedSize || 'Select a size'}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {productSizes.map((size) => (
                  <Chip 
                    key={size}
                    label={size}
                    clickable
                    color={selectedSize === size ? 'primary' : 'default'}
                    onClick={() => handleSizeSelect(size)}
                    variant={selectedSize === size ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Box>
          )}
          
          {/* Quantity */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mr: 2, fontWeight: 'bold' }}>Quantity:</Typography>
            <IconButton size="small" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
              <RemoveIcon />
            </IconButton>
            <Typography sx={{ mx: 2, minWidth: '20px', textAlign: 'center' }}>{quantity}</Typography>
            <IconButton size="small" onClick={() => handleQuantityChange(1)} disabled={quantity >= product.product_quantity}>
              <AddIcon />
            </IconButton>
             <Typography variant="body2" sx={{ ml: 2 }}>(In Stock: {product.product_quantity})</Typography>
          </Box>
          
          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<ShoppingCart />} 
              onClick={handleAddToCart}
              ref={buttonRef}
              disabled={product.product_quantity < 1}
              sx={{ flexGrow: 1 }}
            >
              Add to Cart
            </Button>
            <Button 
              variant="outlined" 
              color="secondary" 
              onClick={handleBuyNow}
              disabled={product.product_quantity < 1}
              sx={{ flexGrow: 1 }}
            >
              Buy Now
            </Button>
          </Box>
          
          {/* Social/Wishlist Icons */}
          <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
            <Button startIcon={<Favorite />}>Add to Wishlist</Button>
            <Button startIcon={<Share />}>Share</Button>
          </Box>
        </Grid>
      </Grid>
      
      {/* Success Snackbar */}
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductDetail; 