import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Box, Grid } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase-config';
// import './style/RegisterModal.scss';

interface RegisterModalProps {
  onClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onClose();
    } catch (error) {
      console.error('Error logging in with Google:', error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <Typography variant="h5" gutterBottom>
          Register
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
            <Button variant="contained" color="primary" fullWidth onClick={handleRegister}>
              Register
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="secondary" fullWidth startIcon={<GoogleIcon />} onClick={handleGoogleLogin}>
              Register with Google
            </Button>
          </Grid>
        </Grid>
        <Button onClick={onClose} className="close-button">Close</Button>
      </div>
    </div>
  );
};

export default RegisterModal;