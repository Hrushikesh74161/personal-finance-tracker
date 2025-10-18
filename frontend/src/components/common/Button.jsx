import { Button as MuiButton } from "@mui/material";
import { forwardRef } from "react";

/**
 * Custom Button component that wraps Material-UI Button with consistent styling
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {React.ReactNode} props.startIcon - Icon to display at the start of the button
 * @param {React.ReactNode} props.endIcon - Icon to display at the end of the button
 * @param {Function} props.onClick - Click handler function
 * @param {string} props.variant - Button variant ('contained', 'outlined', 'text')
 * @param {string} props.color - Button color ('primary', 'secondary', 'error', etc.)
 * @param {string} props.size - Button size ('small', 'medium', 'large')
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {boolean} props.fullWidth - Whether the button should take full width
 * @param {string} props.type - Button type ('button', 'submit', 'reset')
 * @param {Object} props.sx - Additional sx styles
 * @param {Object} props.rest - Additional props to pass to MUI Button
 * @returns {JSX.Element} The custom Button component
 */
const Button = forwardRef(function Button({
  children,
  startIcon,
  endIcon,
  onClick,
  variant = "contained",
  color = "primary",
  size = "medium",
  disabled = false,
  fullWidth = false,
  type = "button",
  sx = {},
  ...rest
}, ref) {
  // Default styles based on variant
  const getDefaultStyles = () => {
    const baseStyles = {
      borderRadius: 2,
      textTransform: 'none',
      fontWeight: 600,
      transition: 'all 0.2s ease-in-out',
    };

    switch (variant) {
      case 'contained':
        return {
          ...baseStyles,
          ...(color === 'primary' && {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.39)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
              boxShadow: '0 6px 20px 0 rgba(102, 126, 234, 0.5)',
              transform: 'translateY(-1px)',
            },
          }),
        };
      case 'outlined':
        return {
          ...baseStyles,
          borderWidth: 1.5,
          '&:hover': {
            borderWidth: 1.5,
            transform: 'translateY(-1px)',
          },
        };
      case 'text':
        return {
          ...baseStyles,
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        };
      default:
        return baseStyles;
    }
  };

  // Merge default styles with custom sx
  const mergedSx = {
    ...getDefaultStyles(),
    ...sx,
  };

  return (
    <MuiButton
      ref={ref}
      variant={variant}
      color={color}
      size={size}
      disabled={disabled}
      fullWidth={fullWidth}
      type={type}
      startIcon={startIcon}
      endIcon={endIcon}
      onClick={onClick}
      sx={mergedSx}
      {...rest}
    >
      {children}
    </MuiButton>
  );
});

export default Button;
