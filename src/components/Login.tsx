import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Box, Grid, IconButton } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './style/Login.scss';
import { auth } from '../firebase-config';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged in');
      navigate('/shop');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('User registered');
      navigate('/shop');
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      console.log('Logged in with Google');
      navigate('/shop');
    } catch (error) {
      console.error('Error logging in with Google:', error);
    }
  };

  return (
    <Container  className="login-container">
      <Box className="login-box" boxShadow={3} p={3} mt={5}>
        <Typography variant="h5" gutterBottom>
          {isRegistering ? 'Register' : 'Login'}
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={isRegistering ? handleRegister : handleLogin}
            >
              {isRegistering ? 'Register' : 'Login'}
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
            >
              Login with Google
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="text"
              fullWidth
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? 'Already have an account? Login' : 'Don\'t have an account? Register'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Login;
