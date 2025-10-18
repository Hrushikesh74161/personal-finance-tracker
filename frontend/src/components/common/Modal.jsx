import CloseIcon from "@mui/icons-material/Close";
import { Box, Fade, Backdrop } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import React from "react";

/**
 * Modern Modal component with glassmorphism design
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether modal is open
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} [props.title] - Modal title
 * @param {string} [props.subTitle] - Modal subtitle
 * @param {boolean} [props.showCloseIcon=true] - Show close icon
 * @param {string} [props.size="medium"] - Modal size (small, medium, large, fullWidth)
 * @param {Object} [props.sx] - Additional styles
 * @param {Array} [props.actions] - Action buttons
 * @param {Function} props.handleClose - Close handler
 */
export default function ModalComponent({
  open,
  children,
  title,
  subTitle,
  showCloseIcon = true,
  size = "medium",
  sx = {},
  actions,
  handleClose,
}) {
  // Size configurations
  const getSizeStyles = () => {
    const baseStyles = {
      borderRadius: 4,
      background: "white",
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.2)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      outline: 'none',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    switch (size) {
      case "small":
        return {
          ...baseStyles,
          width: { xs: '90%', sm: 400 },
          maxHeight: '80vh',
        };
      case "medium":
        return {
          ...baseStyles,
          width: { xs: '90%', sm: 500, md: 600 },
          maxHeight: '80vh',
        };
      case "large":
        return {
          ...baseStyles,
          width: { xs: '90%', sm: 700, md: 800 },
          maxHeight: '85vh',
        };
      case "fullWidth":
        return {
          ...baseStyles,
          width: '100%',
          height: '100%',
          borderRadius: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
        };
      default:
        return {
          ...baseStyles,
          width: { xs: '90%', sm: 500, md: 600 },
          maxHeight: '80vh',
        };
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        sx: {
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(4px)',
        }
      }}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Fade in={open} timeout={300}>
        <Box
          sx={[
            getSizeStyles(),
            sx,
          ]}
        >
          {title && (
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                p: size === "fullWidth" ? 3 : 2,
                borderRadius: size === "fullWidth" ? 0 : '16px 16px 0 0',
              }}
            >
              <Stack>
                <Typography
                  variant={size === "fullWidth" ? "h4" : "h6"}
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {title}
                </Typography>
                {subTitle && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      mt: 0.5,
                    }}
                  >
                    {subTitle}
                  </Typography>
                )}
              </Stack>
              {showCloseIcon && (
                <IconButton
                  onClick={handleClose}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'text.primary',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </Stack>
          )}

          <Box
            sx={{
              overflowY: 'auto',
              maxHeight: size === "fullWidth" ? 'calc(100vh - 200px)' : '60vh',
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255,255,255,0.3)',
                borderRadius: '3px',
                '&:hover': {
                  background: 'rgba(255,255,255,0.5)',
                },
              },
              p: size === "fullWidth" ? 4 : 3,
            }}
          >
            {children}
          </Box>

          {actions && actions.length > 0 && (
            <Stack
              direction="row"
              spacing={2}
              justifyContent="flex-end"
              alignItems="center"
              sx={{
                borderTop: '1px solid rgba(255,255,255,0.1)',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                p: 2,
                borderRadius: size === "fullWidth" ? 0 : '0 0 16px 16px',
                ...(size === "fullWidth" && {
                  position: 'sticky',
                  bottom: 0,
                }),
              }}
            >
              {actions.map((action, index) => (
                <Box key={index}>{action}</Box>
              ))}
            </Stack>
          )}
        </Box>
      </Fade>
    </Modal>
  );
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  showCloseIcon: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'fullWidth']),
  sx: PropTypes.object,
  actions: PropTypes.arrayOf(PropTypes.node),
  handleClose: PropTypes.func.isRequired,
};

Modal.defaultProps = {
  title: null,
  subTitle: null,
  showCloseIcon: true,
  size: 'medium',
  sx: {},
  actions: null,
};
