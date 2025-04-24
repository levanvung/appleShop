import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Grid,
  Checkbox,
  Avatar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import { useCart } from '../../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { 
    cartItems, 
    cartCount, 
    isCartOpen, 
    closeCart, 
    removeFromCart, 
    increaseQuantity, 
    decreaseQuantity 
  } = useCart();

  // Tính tổng tiền
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      // Chuyển đổi giá từ string sang number (loại bỏ ký tự không phải số)
      const price = Number(item.price.replace(/[^\d]/g, ''));
      return total + price * item.quantity;
    }, 0);
  };

  // Format tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
    }).format(amount) + 'đ';
  };

  const total = calculateTotal();

  return (
    <Drawer
      anchor="right"
      open={isCartOpen}
      onClose={closeCart}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: '450px' },
          backgroundColor: 'white',
          color: 'black',
          boxSizing: 'border-box',
          padding: 0,
        },
      }}
    >
      <Box className="cart-container">
        {/* Header */}
        <Box className="cart-header">
          <Typography variant="h6" fontWeight="bold">
            Your cart ({cartCount})
          </Typography>
          <IconButton onClick={closeCart}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />

        {/* Cart items */}
        <Box className="cart-items">
          {cartItems.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1">Giỏ hàng trống</Typography>
            </Box>
          ) : (
            cartItems.map((item) => (
              <Box key={`${item.id}-${item.color}`} className="cart-item">
                <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                  <Checkbox />
                  <Box sx={{ width: '80px', height: '80px', mr: 2 }}>
                    <Avatar 
                      variant="square"
                      src={item.image} 
                      alt={item.name} 
                      sx={{ width: '100%', height: '100%' }}
                    />
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {item.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.colorName}
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" sx={{ mt: 1 }}>
                      {item.price}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, ml: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton 
                      size="small" 
                      onClick={() => decreaseQuantity(item.id)}
                      disabled={item.quantity <= 1}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography sx={{ mx: 1, minWidth: '20px', textAlign: 'center' }}>
                      {item.quantity}
                    </Typography>
                    <IconButton size="small" onClick={() => increaseQuantity(item.id)}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))
          )}
        </Box>

        {/* Cart footer */}
        {cartItems.length > 0 && (
          <Box className="cart-footer">
            <Box sx={{ px: 3, py: 2 }}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  <Typography variant="h6">Total</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h6" fontWeight="bold">
                    {formatCurrency(total)}
                  </Typography>
                </Grid>
              </Grid>
              <Button 
                variant="contained" 
                fullWidth 
                sx={{ mt: 2, py: 1.5, borderRadius: 3 }}
              >
                Checkout
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default Cart; 