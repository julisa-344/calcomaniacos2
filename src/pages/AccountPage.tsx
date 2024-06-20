import React, { useState, useEffect } from 'react';
import { TextField, OutlinedInput, FormControl, InputLabel, InputAdornment, IconButton, Box } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { getAuth, updateEmail, updatePassword } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../AuthContext';
import Button from "../components/Button";
import "../theme.scss";
import './style/AccountPage.scss';
import AsideAccount from "../components/AsideAccountComponent";

function AccountPage() {
    const { user } = useAuth();
    const auth = getAuth();
    const firestore = getFirestore();
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    useEffect(() => {
        if (user) {
            const fetchUserData = async () => {
                const userDoc = await getDoc(doc(firestore, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setName(userData.name || '');
                    setLastName(userData.lastName || '');
                    setEmail(userData.email || '');
                }
            };
            fetchUserData();
        }
    }, [user, firestore]);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleSaveChanges = async () => {
        try {
            if (user) {
                // Update email
                if (email !== user.email) {
                    await updateEmail(user, email);
                }
                // Update password
                if (newPassword && newPassword === repeatPassword) {
                    await updatePassword(user, newPassword);
                }
                // Update other user data in Firestore
                await updateDoc(doc(firestore, 'users', user.uid), {
                    name,
                    lastName,
                    email
                });

                alert('Changes saved successfully!');
            }
        } catch (error) {
            console.error('Error updating user data:', error);
            alert('Error updating user data.');
        }
    };

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
                                size="medium"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Box>
                    </div>
                    <div className="flex direction-column ">
                        <h2>Contrasena</h2>
                        <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Contrasena antigua</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                        </FormControl>

                        <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Contrasena nueva</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                        </FormControl>

                        <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Repetir contrasena </InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                value={repeatPassword}
                                onChange={(e) => setRepeatPassword(e.target.value)}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                        </FormControl>
                    </div>
                    <Button text="Guardar Cambios" onClick={handleSaveChanges} className="m-t" />
                </section>
            </main>
        </>
    );
}

export default AccountPage;