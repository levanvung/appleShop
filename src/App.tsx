import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Layout from './components/Layout/Layout';
import Home from './views/Home/Home';
import SignIn from './views/Auth/SignIn';
import SignUp from './views/Auth/SignUp';
import Categories from './views/Products/Categories';
import ProductList from './views/Products/ProductList';
import ProductDetail from './views/ProductDetail/ProductDetail';
import About from './views/About/About';
import ProductManagement from './views/Admin/Products/ProductManagement';
import AdminRoute from './components/ProtectedRoute/AdminRoute';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import './App.css';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
    success: {
      main: '#4caf50',
    },
  },
  typography: {
    fontFamily: "'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          borderRadius: '20px',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="app">
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/products" element={<Categories />} />
                  <Route path="/products/:category" element={<ProductList />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/admin/products" element={
                    <AdminRoute>
                      <ProductManagement />
                    </AdminRoute>
                  } />
                  {/* Other routes will be added later */}
                </Routes>
              </Layout>
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
