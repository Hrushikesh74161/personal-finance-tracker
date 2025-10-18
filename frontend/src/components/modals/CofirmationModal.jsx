import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import Modal from "../common/Modal";
import Button from "../common/Button";
import PropTypes from "prop-types";

/**
 * ConfirmationModal component for asking user confirmation
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether modal is open
 * @param {Function} props.onClose - Close handler function
 * @param {Function} props.onConfirm - Confirm handler function
 * @param {string} [props.title="Confirm Action"] - Modal title
 * @param {string} [props.message] - Main confirmation message
 * @param {string} [props.description] - Additional description text
 * @param {string} [props.confirmText="Confirm"] - Confirm button text
 * @param {string} [props.cancelText="Cancel"] - Cancel button text
 * @param {string} [props.confirmColor="primary"] - Confirm button color
 * @param {string} [props.cancelColor="secondary"] - Cancel button color
 * @param {boolean} [props.confirmDisabled=false] - Whether confirm button is disabled
 * @param {boolean} [props.cancelDisabled=false] - Whether cancel button is disabled
 * @param {boolean} [props.showCancel=true] - Whether to show cancel button
 * @param {string} [props.size="small"] - Modal size
 * @param {Object} [props.sx] - Additional styles
 * @returns {JSX.Element} The ConfirmationModal component
 */
function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "primary",
  cancelColor = "secondary",
  confirmDisabled = false,
  cancelDisabled = false,
  showCancel = true,
  size = "small",
  sx = {},
}) {
  /**
   * Handle confirm action
   */
  function handleConfirm() {
    if (onConfirm) {
      onConfirm();
    }
    if (onClose) {
      onClose();
    }
  }

  /**
   * Handle cancel action
   */
  function handleCancel() {
    if (onClose) {
      onClose();
    }
  }

  // Prepare action buttons
  const actions = [];

  if (showCancel) {
    actions.push(
      <Button
        key="cancel"
        variant="outlined"
        color={cancelColor}
        onClick={handleCancel}
        disabled={cancelDisabled}
        sx={{ minWidth: 100 }}
      >
        {cancelText}
      </Button>
    );
  }

  actions.push(
    <Button
      key="confirm"
      variant="contained"
      color={confirmColor}
      onClick={handleConfirm}
      disabled={confirmDisabled}
      sx={{ minWidth: 100 }}
    >
      {confirmText}
    </Button>
  );

  return (
    <Modal
      open={open}
      handleClose={onClose}
      title={title}
      size={size}
      actions={actions}
      showCloseIcon={false}
      sx={sx}
    >
      <Box sx={{ textAlign: "center", py: 1 }}>
        {message && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              mb: description ? 2 : 3,
              lineHeight: 1.4,
            }}
          >
            {message}
          </Typography>
        )}
        
        {description && (
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              lineHeight: 1.6,
              mb: 2,
            }}
          >
            {description}
          </Typography>
        )}
      </Box>
    </Modal>
  );
}

ConfirmationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  title: PropTypes.string,
  message: PropTypes.string,
  description: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  confirmColor: PropTypes.string,
  cancelColor: PropTypes.string,
  confirmDisabled: PropTypes.bool,
  cancelDisabled: PropTypes.bool,
  showCancel: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'fullWidth']),
  sx: PropTypes.object,
};

ConfirmationModal.defaultProps = {
  onConfirm: null,
  title: "Confirm Action",
  message: null,
  description: null,
  confirmText: "Confirm",
  cancelText: "Cancel",
  confirmColor: "primary",
  cancelColor: "secondary",
  confirmDisabled: false,
  cancelDisabled: false,
  showCancel: true,
  size: "small",
  sx: {},
};

export default ConfirmationModal;
