import { Box, IconButton, InputAdornment, TextField as MuiTextField, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";

export default function TextField(
  { required, label, sx, error, errorText, characterLimit, min, value, onChange, helperText, ...rest }
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = rest.type === "password";

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Box width={"100%"}>
      <MuiTextField
        label={label}
        required={required}
        fullWidth
        variant="outlined"
        inputProps={{ min: min }}
        value={value}
        {...(rest?.type === "number"
          ? { onWheel: (e) => e.target?.blur() }
          : {})} // to disable the issue where values are changed when scrolling on a text field of type number
        onKeyDown={(e) => {
          if (rest.type === "number" && e.key === "e") {
            e.preventDefault();
          }

          if (rest.onKeyDown) {
            rest.onKeyDown();
          }
        }}
        {...rest}
        type={isPasswordField ? (showPassword ? "text" : "password") : rest.type}
        onChange={(e) => {
          if (characterLimit && e.target.value.length > characterLimit) {
            return;
          } else {
            onChange(e);
          }
        }}
        error={error}
        helperText={error ? errorText : helperText || ""}
        InputProps={{
          ...rest.InputProps,
          endAdornment: isPasswordField ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : rest.InputProps?.endAdornment,
        }}
        sx={[
          {
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: 'background.paper',
              '& fieldset': {
                borderColor: error ? 'error.main' : 'rgba(0, 0, 0, 0.23)',
                borderWidth: '1px',
              },
              '&:hover fieldset': {
                borderColor: error ? 'error.main' : 'rgba(0, 0, 0, 0.87)',
              },
              '&.Mui-focused fieldset': {
                borderColor: error ? 'error.main' : 'primary.main',
                borderWidth: '2px',
              },
              '&.Mui-disabled': {
                backgroundColor: 'action.disabledBackground',
                '& fieldset': {
                  borderColor: 'action.disabled',
                },
              },
            },
            '& .MuiInputLabel-root': {
              fontSize: '14px',
              fontWeight: 500,
              '&.Mui-focused': {
                color: error ? 'error.main' : 'primary.main',
              },
              '&.Mui-error': {
                color: 'error.main',
              },
            },
            '& .MuiOutlinedInput-input': {
              padding: '14px 16px',
              fontSize: '16px',
              '&::placeholder': {
                opacity: 0.6,
                fontSize: '16px',
              },
            },
            '& .MuiFormHelperText-root': {
              fontSize: '12px',
              marginTop: '4px',
              marginLeft: '0px',
            },
            ...sx,
          },
          rest.disabled ? {
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'action.disabledBackground',
            }
          } : null,
        ]}
      />

      {characterLimit && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: "12px",
              color: "text.secondary",
              fontWeight: 400,
            }}
          >
            {rest?.value?.length ?? 0}/{characterLimit} characters
          </Typography>
        </Box>
      )}
    </Box>
  );
}
