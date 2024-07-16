import React, { useState } from 'react';
import { TextField, Box, Grid } from '@mui/material';
import './style/PaymentInfo.scss';

const getCardType = (cardNumber: string) => {
  const bin = cardNumber.substring(0, 6);

  const cardPatterns = {
    visa: /^4[0-9]{5}/,
    mastercard: /^(5[1-5][0-9]{4}|2[2-7][0-9]{4})/,
    amex: /^3[47][0-9]{4}/
  };

  if (cardPatterns.visa.test(bin)) {
    return 'visa';
  }
  if (cardPatterns.mastercard.test(bin)) {
    return 'mastercard';
  }
  if (cardPatterns.amex.test(bin)) {
    return 'amex';
  }
  
  return 'unknown';
};

interface PaymentInfoProps {
  paymentData: {
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
  setPaymentData: React.Dispatch<React.SetStateAction<{
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

const PaymentInfo: React.FC<PaymentInfoProps> = ({ paymentData, setPaymentData }) => {
  const [cardType, setCardType] = useState('unknown');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'cardNumber') {
      const detectedCardType = getCardType(value);
      setCardType(detectedCardType);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '30%', margin: '0 auto' }}>
        <TextField
          label="Nombre del titular"
          name="cardName"
          value={paymentData.cardName}
          onChange={handleChange}
          required
        />
        <TextField
          label="Número de tarjeta"
          name="cardNumber"
          value={paymentData.cardNumber}
          onChange={handleChange}
          required
          type="text"
        />
        <TextField
          label="Fecha de vencimiento"
          name="expiryDate"
          value={paymentData.expiryDate}
          onChange={handleChange}
          required
          type="text"
        />
        <TextField
          label="CCV"
          name="cvc"
          value={paymentData.cvc}
          onChange={handleChange}
          required
          type="text"
        />
        <Grid container spacing={2} className="card-icons">
          <Grid item>
            <img
              src="/payments/visa-svgrepo-com.svg"
              alt="Visa"
              className={cardType === 'visa' ? 'active' : ''}
            />
          </Grid>
          <Grid item>
            <img
              src="/payments/master-card-svgrepo-com.svg"
              alt="Mastercard"
              className={cardType === 'mastercard' ? 'active' : ''}
            />
          </Grid>
          <Grid item>
            <img
              src="/payments/american-express-logo-svgrepo-com.svg"
              alt="American Express"
              className={cardType === 'amex' ? 'active' : ''}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PaymentInfo;
