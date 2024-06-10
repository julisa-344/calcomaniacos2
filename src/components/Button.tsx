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
  const { text, onClick, variant = "contained", color = "primary", className } = props;

  // Define los estilos personalizados para la variante "outlined"
  const outlinedStyles = {
    borderColor: "#fff",
    color: "#fff",
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={className}>
      <Button
        variant={variant}
        onClick={onClick}
        color={color}
        style={variant === "outlined" ? outlinedStyles : undefined}
      >
        {text}
      </Button>
      </div>
    </ThemeProvider>
  );
}

export default ButtonComponent;