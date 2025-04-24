import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import './Footer.css';

const Footer = () => {
  return (
    <Box component="footer" className="footer">
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Apple Store
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cung cấp các sản phẩm chính hãng từ Apple với chất lượng tốt nhất và dịch vụ chăm sóc khách hàng tận tâm.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Sản phẩm
            </Typography>
            <ul className="footer-links">
              <li><Link href="#">iPhone</Link></li>
              <li><Link href="#">iPad</Link></li>
              <li><Link href="#">MacBook</Link></li>
              <li><Link href="#">Apple Watch</Link></li>
              <li><Link href="#">AirPods</Link></li>
            </ul>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Hỗ trợ
            </Typography>
            <ul className="footer-links">
              <li><Link href="#">Hướng dẫn mua hàng</Link></li>
              <li><Link href="#">Chính sách đổi trả</Link></li>
              <li><Link href="#">Bảo hành</Link></li>
              <li><Link href="#">Thanh toán</Link></li>
              <li><Link href="#">Vận chuyển</Link></li>
            </ul>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Liên hệ
            </Typography>
            <Typography variant="body2" paragraph>
              Hotline: 1900 1234
            </Typography>
            <Typography variant="body2" paragraph>
              Email: support@applestore.com.vn
            </Typography>
            <Box className="social-icons">
              <IconButton color="primary"><FacebookIcon /></IconButton>
              <IconButton color="primary"><TwitterIcon /></IconButton>
              <IconButton color="primary"><InstagramIcon /></IconButton>
              <IconButton color="primary"><YouTubeIcon /></IconButton>
            </Box>
          </Grid>
        </Grid>
        
        <Box className="footer-bottom">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Apple Store. Tất cả các quyền được bảo lưu.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 