import React, { useState, useEffect } from 'react';
import { TextField, Box } from '@mui/material';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../AuthContext';
import "../theme.scss";
import './style/AccountPage.scss';
import AsideAccount from "../components/AsideAccountComponent";

function AccountPage() {
  const { user } = useAuth();
  const firestore = getFirestore();
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setName(userData.displayName || '');
          setEmail(userData.email || '');
        }
      };
      fetchUserData();
    }
  }, [user, firestore]);

  return (
    <>
      <main className="main flex">
        <AsideAccount />
        <section className="account-details">
          <div className="">
            <h2>Detalles</h2>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 1, width: '100%' },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-basic"
                label="Nombre"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                id="outlined-basic"
                label="Apellido"
                variant="outlined"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <TextField
                id="outlined-basic"
                label="Correo"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Box>
          </div>
        </section>
      </main>
    </>
  );
}

export default AccountPage;