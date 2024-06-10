import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';

interface ButtonProps {
  text: string;
  onClick: () => void;
  variant?: "text" | "outlined" | "contained";
  color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
  className?: string;
}

function ButtonComponent(props: ButtonProps) {
  const { text, onClick, variant = "contained", color="primary", className } = props;

  return (
    <ThemeProvider theme={theme}>

      <Button variant={variant} onClick={onClick} color={color} className={className}>
        {text}
      </Button>
    </ThemeProvider>

  );
}

export default ButtonComponent;