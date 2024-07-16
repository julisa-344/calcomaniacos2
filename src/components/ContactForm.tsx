import React from 'react';
import { TextField, Box } from '@mui/material';

interface ContactFormProps {
  formData: {
    nombre: string;
    apellidos: string;
    dni: string;
    correo: string;
    numero: string;
    direccion: string;
    cardName: string;
    cardNumber: string;
    expiryDate: string;
    cvc: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    nombre: string;
    apellidos: string;
    dni: string;
    correo: string;
    numero: string;
    direccion: string;
    cardName: string;
    cardNumber: string;
    expiryDate: string;
    cvc: string;
  }>>;
}

const ContactForm: React.FC<ContactFormProps> = ({ formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '30%', marginTop:'50px' }}>
      <TextField
        label="Nombre"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        required
      />
      <TextField
        label="Apellidos"
        name="apellidos"
        value={formData.apellidos}
        onChange={handleChange}
        required
      />
      <TextField
        label="DNI"
        name="dni"
        value={formData.dni}
        onChange={handleChange}
        required
      />
      <TextField
        label="Correo"
        name="correo"
        value={formData.correo}
        onChange={handleChange}
        required
        type="email"
      />
      <TextField
        label="Número"
        name="numero"
        value={formData.numero}
        onChange={handleChange}
        required
        type="tel"
      />
      <TextField
        label="Dirección de Entrega"
        name="direccion"
        value={formData.direccion}
        onChange={handleChange}
        required
      />
    </Box>
  );
};

export default ContactForm;
