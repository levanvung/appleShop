import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Box, Typography, Container, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import './Products.css';

const Categories: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const categories = [
    {
      id: 'iphone',
      displayName: 'iPhone',
      description: 'Trải nghiệm công nghệ đỉnh cao',
      fallbackUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-card-40-iphone15prohero-202309?wid=680&hei=528&fmt=p-jpg&qlt=95&.v=1693086290312'
    },
    {
      id: 'ipad',
      displayName: 'iPad',
      description: 'Sức mạnh ấn tượng với chip M2',
      fallbackUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-card-40-pro-202210?wid=680&hei=528&fmt=p-jpg&qlt=95&.v=1664578794100'
    },
    {
      id: 'macbook',
      displayName: 'Macbook',
      description: 'Hiệu năng vượt trội',
      fallbackUrl: 'https://zshop.vn/images/detailed/56/ipad-pro-12-select-202104_2qjy-dt.png'
    },
    {
      id: 'airpods',
      displayName: 'AirPods',
      description: 'Âm thanh đỉnh cao',
      fallbackUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-card-40-airpods-202209?wid=680&hei=528&fmt=p-jpg&qlt=95&.v=1661016986712'
    }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCategoryClick = (category: string) => {
    navigate(`/products/${category}`);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    }
  };

  // Card component to maintain consistency
  const CategoryCard = ({ category, cardClassName, titleVariant }: { 
    category: (typeof categories)[number], 
    cardClassName: string,
    titleVariant: "h3" | "h4" | "h5"
  }) => (
    <Paper
      className={`category-card ${cardClassName}`}
      onClick={() => handleCategoryClick(category.id)}
      elevation={5}
    >
      <Box className="category-content">
        <Box className="category-text">
          <Typography className="category-title" variant={titleVariant}>
            {category.displayName}
          </Typography>
          <Typography 
            className="category-subtitle" 
            variant="body1"
            sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}
          >
            {category.description}
          </Typography>
        </Box>
        <Box className="category-image-container">
          <img
            src={category.fallbackUrl}
            alt={`${category.displayName} category`}
            className="category-image"
          />
        </Box>
      </Box>
    </Paper>
  );

  return (
    <div className="categories-page">
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: 6, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: '100%'
        }}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          align="center" 
          gutterBottom
          sx={{ 
            color: 'white', 
            fontWeight: 700, 
            mb: 5,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            fontSize: { xs: '2.5rem', md: '3.5rem' }
          }}
        >
          Khám phá sản phẩm
        </Typography>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {isMobile ? (
            // Mobile layout
            <Box className="grid-container">
              {categories.map((category) => (
                <Box key={category.id} className="grid-item mobile-item">
                  <motion.div variants={itemVariants} style={{ width: '100%', height: '100%' }}>
                    <CategoryCard 
                      category={category} 
                      cardClassName="category-card-mobile" 
                      titleVariant="h4" 
                    />
                  </motion.div>
                </Box>
              ))}
            </Box>
          ) : isTablet ? (
            // Tablet layout
            <Box className="grid-container">
              {categories.map((category) => (
                <Box key={category.id} className="grid-item tablet-item">
                  <motion.div variants={itemVariants} style={{ width: '100%', height: '100%' }}>
                    <CategoryCard 
                      category={category} 
                      cardClassName="category-card-tablet" 
                      titleVariant="h4" 
                    />
                  </motion.div>
                </Box>
              ))}
            </Box>
          ) : (
            // Desktop layout
            <Box className="layout-container">
              <Box className="featured-layout">
                {/* Left side - Featured iPhone */}
                <Box className="grid-item featured-item">
                  <motion.div variants={itemVariants} style={{ width: '100%', height: '100%' }}>
                    <CategoryCard 
                      category={categories[0]} 
                      cardClassName="category-card-featured" 
                      titleVariant="h3" 
                    />
                  </motion.div>
                </Box>

                {/* Right column */}
                <Box className="secondary-items">
                  {/* iPad - top */}
                  <Box className="medium-item">
                    <motion.div variants={itemVariants} style={{ width: '100%', height: '100%' }}>
                      <CategoryCard 
                        category={categories[1]} 
                        cardClassName="category-card-medium" 
                        titleVariant="h4" 
                      />
                    </motion.div>
                  </Box>
                  
                  {/* Small items container - bottom */}
                  <Box className="small-items-container">
                    {/* Macbook */}
                    <Box className="small-item">
                      <motion.div variants={itemVariants} style={{ width: '100%', height: '100%' }}>
                        <CategoryCard 
                          category={categories[2]} 
                          cardClassName="category-card-small" 
                          titleVariant="h5" 
                        />
                      </motion.div>
                    </Box>
                    
                    {/* AirPods */}
                    <Box className="small-item">
                      <motion.div variants={itemVariants} style={{ width: '100%', height: '100%' }}>
                        <CategoryCard 
                          category={categories[3]} 
                          cardClassName="category-card-small" 
                          titleVariant="h5" 
                        />
                      </motion.div>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </motion.div>
      </Container>
    </div>
  );
};

export default Categories;
