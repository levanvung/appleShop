import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/auth';
import axios from 'axios';
import { 
    Button, 
    TextField, 
    Paper, 
    Typography, 
    Box, 
    Container, 
    InputAdornment, 
    IconButton, 
    CircularProgress,
    Divider,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import { 
    Visibility, 
    VisibilityOff, 
    Email, 
    Lock, 
    Apple, 
    Facebook, 
    Google 
} from '@mui/icons-material';
import './LoginForm.css';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            console.log('Attempting to login with:', { email, password });
            const response = await authService.login({ email, password });
            console.log('Login successful:', response);
            
            // Redirect to home page after successful login
            navigate('/');
        } catch (err) {
            console.error('Login error:', err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
            } else {
                setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSocialLogin = (provider: string) => {
        // Placeholder for social login
        console.log(`Login with ${provider}`);
    };

    return (
        <Container maxWidth="sm" className="login-container">
            <Paper elevation={6} className="login-paper">
                <div className="login-background"></div>
                <Box className="login-content">
                    <Typography variant="h4" className="login-title">
                        Đăng Nhập
                    </Typography>
                    <Typography variant="body1" className="login-subtitle">
                        Chào mừng quay trở lại Apple Store
                    </Typography>
                    
                    {error && (
                        <Box className="error-alert">
                            <Typography color="error">{error}</Typography>
                        </Box>
                    )}
                    
                    <Box component="form" onSubmit={handleSubmit} className="login-form">
                        <TextField
                            fullWidth
                            id="email"
                            label="Email"
                            variant="outlined"
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        
                        <TextField
                            fullWidth
                            id="password"
                            label="Mật khẩu"
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleTogglePassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        
                        <Box className="form-options">
                            <FormControlLabel
                                control={
                                    <Checkbox 
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        color="primary"
                                        size="small"
                                        className="remember-checkbox"
                                    />
                                }
                                label="Nhớ mật khẩu"
                                className="remember-me"
                            />
                            <Typography 
                                variant="body2" 
                                className="forgot-password"
                                onClick={() => navigate('/forgot-password')}
                            >
                                Quên mật khẩu?
                            </Typography>
                        </Box>
                        
                        <Box className="form-actions">
                            <Button 
                                variant="contained" 
                                color="primary" 
                                type="submit"
                                disabled={isLoading}
                                fullWidth
                                size="large"
                                className="login-button"
                            >
                                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Đăng Nhập'}
                            </Button>
                        </Box>
                        
                        <Box className="login-divider">
                            <Divider>
                                <Typography variant="body2" color="textSecondary">Hoặc đăng nhập với</Typography>
                            </Divider>
                        </Box>
                        
                        <Box className="social-login">
                            <Button 
                                variant="outlined" 
                                className="social-button google"
                                onClick={() => handleSocialLogin('Google')}
                                startIcon={<Google />}
                            >
                                Google
                            </Button>
                            <Button 
                                variant="outlined" 
                                className="social-button facebook"
                                onClick={() => handleSocialLogin('Facebook')}
                                startIcon={<Facebook />}
                            >
                                Facebook
                            </Button>
                            <Button 
                                variant="outlined" 
                                className="social-button apple"
                                onClick={() => handleSocialLogin('Apple')}
                                startIcon={<Apple />}
                            >
                                Apple
                            </Button>
                        </Box>
                        
                        <Box className="login-footer">
                            <Typography variant="body2">
                                Chưa có tài khoản? <span className="signup-link" onClick={() => navigate('/signup')}>Đăng ký ngay</span>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default LoginForm; 