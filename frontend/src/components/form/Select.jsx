import { Box, FormControl, InputLabel, MenuItem, Select as MuiSelect, Typography } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

/**
 * Custom Select component with glassmorphism design
 * @param {Object} props - Component props
 * @param {boolean} props.required - Whether the field is required
 * @param {string} props.label - Label for the select
 * @param {string} props.name - Name attribute for the select
 * @param {*} props.value - Current value of the select
 * @param {Function} props.onChange - Change handler
 * @param {boolean} props.error - Whether there's an error
 * @param {string} props.errorText - Error message to display
 * @param {string} props.helperText - Helper text to display
 * @param {Array} props.options - Array of options {value, label}
 * @param {boolean} props.disabled - Whether the select is disabled
 * @param {Object} props.sx - Additional styles
 * @param {*} props.rest - Other props to pass to the select
 */
export default function Select({
  required = false,
  label,
  name,
  value,
  onChange,
  error = false,
  errorText,
  helperText,
  options = [],
  disabled = false,
  sx = {},
  ...rest
}) {
  return (
    <Box width="100%">
      <FormControl 
        fullWidth 
        error={error}
        disabled={disabled}
        sx={{
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
          '& .MuiSelect-select': {
            padding: '12px 14px',
            fontSize: '16px',
            '&:focus': {
              backgroundColor: 'transparent',
            },
          },
          ...sx,
        }}
      >
        <InputLabel required={required}>
          {label}
        </InputLabel>
        <MuiSelect
          name={name}
          value={value}
          onChange={onChange}
          label={label}
          {...rest}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </MuiSelect>
        {(error && errorText) && (
          <Typography 
            variant="caption" 
            color="error" 
            sx={{ 
              mt: 0.5, 
              ml: 1.5,
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          >
            {errorText}
          </Typography>
        )}
        {!error && helperText && (
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ 
              mt: 0.5, 
              ml: 1.5,
              fontSize: '0.75rem',
            }}
          >
            {helperText}
          </Typography>
        )}
      </FormControl>
    </Box>
  );
}

Select.propTypes = {
  required: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool,
  errorText: PropTypes.string,
  helperText: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.any.isRequired,
    label: PropTypes.string.isRequired,
  })),
  disabled: PropTypes.bool,
  sx: PropTypes.object,
};

Select.defaultProps = {
  required: false,
  error: false,
  errorText: '',
  helperText: '',
  options: [],
  disabled: false,
  sx: {},
};
