import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useLocation } from 'react-router-dom';
import ContactForm from '../components/ContactForm';
import PaymentInfo from '../components/PaymentInfo';
import './style/PaymentPage.scss';

const steps = ['Información de contacto', 'Método de Pago', 'Confirmación'];

function PaymentPage() {
  const location = useLocation();
  const { total } = location.state || { total: 0 };
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const [formData, setFormData] = React.useState({
    nombre: '',
    apellidos: '',
    dni: '',
    correo: '',
    numero: '',
    direccion: '',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvc: ''
  });

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormData({
      nombre: '',
      apellidos: '',
      dni: '',
      correo: '',
      numero: '',
      direccion: '',
      cardName: '',
      cardNumber: '',
      expiryDate: '',
      cvc: ''
    });
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <ContactForm formData={formData} setFormData={setFormData} />;
      case 1:
        return <PaymentInfo paymentData={formData} setPaymentData={setFormData} />;
      case 2:
        return (
          <div className='confirm-container'>
            <div className='confirm-form'>
                <Typography>Confirmación de Pago</Typography>
                <Typography>Nombre: {formData.nombre}</Typography>
                <Typography>Apellidos: {formData.apellidos}</Typography>
                <Typography>DNI: {formData.dni}</Typography>
                <Typography>Correo: {formData.correo}</Typography>
                <Typography>Número: {formData.numero}</Typography>
                <Typography>Dirección de Entrega: {formData.direccion}</Typography>
                <Typography>Total a pagar: S/. {total}</Typography>
            </div>
          </div>
        );
      default:
        return 'Paso desconocido';
    }
  };

  return (
    <div className='payment-container'>
      <Box sx={{ width: '100%' }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              Todos los pasos completados - ¡has terminado!
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Resetear</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {getStepContent(activeStep)}
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Atrás
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Box>
    </div>
  );
}

export default PaymentPage;
