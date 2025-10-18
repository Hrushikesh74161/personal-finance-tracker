import { Box, Container, Link, Paper, Stack, Typography } from "@mui/material";
import Button from "../components/common/Button";
import { Formik } from 'formik';
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useLoginMutation } from "../api/useLoginMutation";
import TextField from "../components/form/TextField";
import { pageRoutes } from "../constants/pageRoutes";

export default function LoginPage() {
  const formikRef = useRef(null);
  const navigate = useNavigate();

  const loginMutation = useLoginMutation({
    onSuccess: (data) => {
      sessionStorage.setItem("loginInfo", JSON.stringify(data));
      navigate(pageRoutes.HOME_PAGE);
    },
  })

  const handleSubmit = (values) => {
    loginMutation.mutate(values);
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
      {/* Application Title - Above the login card */}
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
              Sign in
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your credentials to access your account
            </Typography>
          </Box>

          <Formik innerRef={formikRef} enableReinitialize onSubmit={handleSubmit} validationSchema={Yup.object().shape({
            email: Yup.string().email("Invalid email address").required("Email is required"),
            password: Yup.string().required("Password is required"),
          })} initialValues={{ email: "", password: "" }}>
            {({ handleSubmit, ...rest }) => (
              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
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
                    error={Boolean(rest.touched.password) && Boolean(rest.errors.password)} errorText={Boolean(rest.touched.password) && rest.errors.password}
                  />

                  <Button
                    type="submit"
                    size="large"
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Signing in..." : "Login"}
                  </Button>
                </Stack>
              </form>
            )}
          </Formik>

          {/* Link to signup page */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate(pageRoutes.SIGNUP_PAGE)}
                sx={{
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}