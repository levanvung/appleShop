import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Paper, Box, Typography } from '@mui/material';
import './Products.css'; // hoặc './Categories.css' tuỳ bạn đặt tên

const Categories: React.FC = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: 'iphone',
      displayName: 'iPhone',
      fallbackUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-card-40-iphone15prohero-202309?wid=680&hei=528&fmt=p-jpg&qlt=95&.v=1693086290312'
    },
    {
      id: 'ipad',
      displayName: 'iPad',
      fallbackUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-card-40-pro-202210?wid=680&hei=528&fmt=p-jpg&qlt=95&.v=1664578794100'
    },
    {
      id: 'macbook',
      displayName: 'Macbook',
      fallbackUrl: 'https://zshop.vn/images/detailed/56/ipad-pro-12-select-202104_2qjy-dt.png'
    },
    {
      id: 'airpods',
      displayName: 'AirPods',
      fallbackUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-card-40-airpods-202209?wid=680&hei=528&fmt=p-jpg&qlt=95&.v=1661016986712'
    }
  ];

  const handleCategoryClick = (category: string) => {
    navigate(`/products/${category}`);
  };

  return (
    <div className="categories-page">
      <Box sx={{ width: '100%', maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
        <Grid container spacing={3}>

          {/* Cột iPhone */}
          <Grid item xs={12} sm={4} md={4} sx={{ flexGrow: 1 }}>
            <Paper 
              className="category-card category-card-large"
              onClick={() => handleCategoryClick(categories[0].id)}
            >
              <Box className="category-content">
                <Typography className="category-title" variant="h4">
                  {categories[0].displayName}
                </Typography>
                <Box className="category-image-container">
                  <img 
                    src={categories[0].fallbackUrl} 
                    alt={`${categories[0].displayName} category`}
                    className="category-image" 
                  />
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Cột iPad */}
          <Grid item xs={12} sm={4} md={4} sx={{ flexGrow: 1 }}>
            <Paper 
              className="category-card category-card-large"
              onClick={() => handleCategoryClick(categories[1].id)}
            >
              <Box className="category-content">
                <Typography className="category-title" variant="h4">
                  {categories[1].displayName}
                </Typography>
                <Box className="category-image-container">
                  <img 
                    src={categories[1].fallbackUrl} 
                    alt={`${categories[1].displayName} category`}
                    className="category-image" 
                  />
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Cột Macbook + AirPods */}
          <Grid 
            item 
            xs={12} sm={4} md={4} 
            sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
          >
            <Grid container direction="column" spacing={3} sx={{ flex: 1 }}>
              {/* Macbook */}
              <Grid item xs={12} sx={{ flex: 1 }}>
                <Paper 
                  className="category-card category-card-half"
                  onClick={() => handleCategoryClick(categories[2].id)}
                >
                  <Box className="category-content">
                    <Typography className="category-title" variant="h5">
                      {categories[2].displayName}
                    </Typography>
                    <Box className="category-image-container small">
                      <img 
                        src={categories[2].fallbackUrl} 
                        alt={`${categories[2].displayName} category`}
                        className="category-image" 
                      />
                    </Box>
                  </Box>
                </Paper>
              </Grid>
              {/* AirPods */}
              <Grid item xs={12} sx={{ flex: 1 }}>
                <Paper 
                  className="category-card category-card-half"
                  onClick={() => handleCategoryClick(categories[3].id)}
                >
                  <Box className="category-content">
                    <Typography className="category-title" variant="h5">
                      {categories[3].displayName}
                    </Typography>
                    <Box className="category-image-container small">
                      <img 
                        src={categories[3].fallbackUrl} 
                        alt={`${categories[3].displayName} category`}
                        className="category-image" 
                      />
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

        </Grid>
      </Box>
    </div>
  );
};

export default Categories;
