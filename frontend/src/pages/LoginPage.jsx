import { Box, TextField, Button } from "@mui/material";
import { Formik } from 'formik';
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useLoginMutation } from "../api/useLoginMutation";

export default function LoginPage() {
  const formikRef = useRef(null);
  const navigate = useNavigate();

  const loginMutation = useLoginMutation({
    onSuccess: (data) => {
      sessionStorage.setItem("loginInfo", JSON.stringify(data));
      navigate("/transactions");
    },
  })

  const handleSubmit = (values) => {
    loginMutation.mutate(values);
  }

  return (
    <Box>
      <Formik innerRef={formikRef} onSubmit={handleSubmit} validationSchema={Yup.object().shape({
        email: Yup.string().email("Invalid email address").required("Email is required"),
        password: Yup.string().required("Password is required"),
      })}>
        {({ handleSubmit, ...rest }) => (
          <form onSubmit={handleSubmit}>
            <TextField label="Email" name="email" type="email" />
            <TextField label="Password" name="password" type="password" />
            <Button type="submit">Login</Button>
          </form>
        )}
      </Formik></Box>)
}