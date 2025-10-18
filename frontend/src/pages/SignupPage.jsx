import { Box, Container, Link, Paper, Stack, Typography } from "@mui/material";
import Button from "../components/common/Button";
import { Formik } from 'formik';
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useSignupMutation } from "../api/useSignupMutation";
import TextField from "../components/form/TextField";
import { pageRoutes } from "../constants/pageRoutes";
import { showToast } from "../redux/toastSlice";

export default function SignupPage() {
  const formikRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signupMutation = useSignupMutation({
    onSuccess: () => {
      dispatch(showToast({ message: "Account created successfully", type: "success" }));
      navigate(pageRoutes.LOGIN_PAGE);
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to create account. Please try again.";
      dispatch(showToast({ message: errorMessage, type: "error" }));

      // Clear password fields on error
      if (formikRef.current) {
        formikRef.current.setFieldValue("password", "");
        formikRef.current.setFieldValue("confirmPassword", "");
        formikRef.current.setFieldTouched("password", false);
        formikRef.current.setFieldTouched("confirmPassword", false);
      }
    },
  })

  const handleSubmit = (values) => {
    signupMutation.mutate(values);
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        gap: 4
      }}
    >
      {/* Application Title - Above the signup card */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h3" component="h2" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
          Personal Expense Tracker
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your finances with ease
        </Typography>
      </Box>

      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            px: 4,
            py: 7,
            borderRadius: 2
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 500, mb: 1 }}>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign up to start tracking your expenses
            </Typography>
          </Box>

          <Formik
            innerRef={formikRef}
            enableReinitialize
            onSubmit={handleSubmit}
            validationSchema={Yup.object().shape({
              firstName: Yup.string().required("First name is required").min(2, "First name must be at least 2 characters"),
              lastName: Yup.string().min(2, "Last name must be at least 2 characters"),
              email: Yup.string().email("Invalid email address").required("Email is required"),
              password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
              confirmPassword: Yup.string()
                .required("Please confirm your password")
                .oneOf([Yup.ref('password')], "Passwords must match"),
            })}
            initialValues={{ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" }}
          >
            {({ handleSubmit, ...rest }) => (
              <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  <TextField
                    required
                    label="First Name"
                    name="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    value={rest.values.firstName}
                    onChange={rest.handleChange}
                    error={Boolean(rest.touched.firstName) && Boolean(rest.errors.firstName)}
                    errorText={Boolean(rest.touched.firstName) && rest.errors.firstName}
                  />

                  <TextField
                    label="Last Name"
                    name="lastName"
                    type="text"
                    placeholder="Enter your last name (optional)"
                    value={rest.values.lastName}
                    onChange={rest.handleChange}
                    error={Boolean(rest.touched.lastName) && Boolean(rest.errors.lastName)}
                    errorText={Boolean(rest.touched.lastName) && rest.errors.lastName}
                  />

                  <TextField
                    required
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={rest.values.email}
                    onChange={rest.handleChange}
                    error={Boolean(rest.touched.email) && Boolean(rest.errors.email)}
                    errorText={Boolean(rest.touched.email) && rest.errors.email}
                  />

                  <TextField
                    required
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={rest.values.password}
                    onChange={rest.handleChange}
                    error={Boolean(rest.touched.password) && Boolean(rest.errors.password)}
                    errorText={Boolean(rest.touched.password) && rest.errors.password}
                    helperText="Password must be at least 6 characters long"
                  />

                  <TextField
                    required
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={rest.values.confirmPassword}
                    onChange={rest.handleChange}
                    error={Boolean(rest.touched.confirmPassword) && Boolean(rest.errors.confirmPassword)}
                    errorText={Boolean(rest.touched.confirmPassword) && rest.errors.confirmPassword}
                    helperText="Re-enter your password to confirm"
                  />

                  {/* Password match indicator */}
                  {rest.values.password && rest.values.confirmPassword && (
                    <Box sx={{ mt: -1, mb: 1 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "12px",
                          color: rest.values.password === rest.values.confirmPassword ? "success.main" : "error.main",
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        {rest.values.password === rest.values.confirmPassword ? (
                          <>
                            ✓ Passwords match
                          </>
                        ) : (
                          <>
                            ✗ Passwords don't match
                          </>
                        )}
                      </Typography>
                    </Box>)}

                  <Button
                    type="submit"
                    size="large"
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={signupMutation.isPending}
                  >
                    {signupMutation.isPending ? "Creating Account..." : "Sign Up"}
                  </Button>
                </Stack>
              </form>
            )}
          </Formik>

          {/* Link to login page */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate(pageRoutes.LOGIN_PAGE)}
                sx={{
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
