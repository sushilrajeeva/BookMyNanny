import React, { useContext, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import {
  doCreateUserWithEmailAndPassword,
  createNannyDocument,
  createUserDocument,
  doSignOut,
} from "../firebase/AuthFunctions.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { AlertContext } from "../context/AlertContext";
import { nannySchema } from "../schemas/nannysignup.jsx";
import { validateDate, passwordMatch, capitalize } from "../helpers";
import CommonSignUpFields from "./SignUp/CommonFields";
import NannyFields from "./SignUp/NannyFields.jsx";
import moment from "moment";
import { Button } from "@/components/ui/button";

import CustomLoading from "./EssentialComponents/CustomLoading.jsx";

const schema = nannySchema;

function NannySignUp() {
  const { currentUser } = useContext(AuthContext);
  const { showAlert } = useContext(AlertContext);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignUpNanny = async (values, setSubmitting) => {
    setSubmitting(true);

    let {
      email,
      passwordOne,
      passwordTwo,
      firstName,
      lastName,
      phoneNumber,
      street,
      city,
      state,
      pincode,
      dob,
      experience,
      bio,
      ssn,
    } = values;
    ssn = ssn.replace(/\D/g, "");

    try {
      // Create user in Firebase Authentication
      setLoading(true);
      const name = firstName + " " + lastName;

      // await new Promise((resolve) => setTimeout(resolve, 3000));
      let createdUid = await doCreateUserWithEmailAndPassword(
        email,
        passwordOne,
        name
      );
      await doSignOut();

      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Add a delay to simulate asynchronous operations
      // await new Promise((resolve) => setTimeout(resolve, 3000));

      // Create data object for storing in Firestore
      let dataToStore = {
        firstName: capitalize(firstName.trim()),
        lastName: capitalize(lastName.trim()),
        emailAddress: email.toLowerCase().trim(),
        countryCode: "+1",
        phoneNumber: phoneNumber,
        street: capitalize(street.trim()),
        city: capitalize(city.trim()),
        state: capitalize(state.trim()),
        country: "United States",
        pincode: pincode,
        // password: passwordOne.trim(),
        dob: dob,
        experience,
        bio: bio.trim(),
        ssn,
        countryCode: "+1",
        role: "nanny",
        verified: false,
        wallet: 0,
        image: "",
      };

      // Create document in Firestore nanny collection
      await createNannyDocument(createdUid, dataToStore);
      // Create document in Firestore user collection
      await createUserDocument(createdUid, { role: "nanny" });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setLoading(false); // Set loading state back to false
      navigate("/signin");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        showAlert("error", "Email address is already in use.");
      } else if (error.code === "auth/invalid-email") {
        showAlert("error", "Invalid email address.");
      } else if (error.code === "auth/weak-password") {
        showAlert("error", "Password is too weak.");
      } else {
        // Handle other types of errors or provide a generic message
        showAlert("error", error.message || "Unexpected error occurred");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <CustomLoading />;
  }

  //nanny signup return
  return (
    <Box>
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}
      >
        <Formik
          initialValues={{
            email: "",
            passwordOne: "",
            passwordTwo: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            street: "",
            city: "",
            state: "",
            pincode: "",
            dob: "",
            ssn: "",
            experience: "",
            bio: "",
          }}
          validationSchema={schema}
          validate={(values) => {
            const errors = {};
            if (values.dob) {
              const minDate = moment().subtract(100, "y");
              const maxDate = moment().subtract(13, "y");
              if (!validateDate(values.dob, minDate, maxDate))
                errors.dob = "You must be between 13-100 years in age";
            }
            if (values.passwordOne && values.passwordTwo) {
              if (!passwordMatch(values.passwordOne, values.passwordTwo))
                errors.passwordTwo = "Passwords do not match";
            }
            if (values.ssn) {
              const ssn = values.ssn.replace(/\D/g, "");
              const firstThree = ssn.substring(0, 3);
              const secondTwo = ssn.substring(3, 5);
              const lastFour = ssn.substring(5);

              if (!/^(?!000|666|9\d{2})\d{3}$/.test(firstThree)) {
                errors.ssn =
                  "First three digits should not be 000, 666, or between 900 and 999.";
              } else if (!/^(?!00)\d{2}$/.test(secondTwo)) {
                errors.ssn = "Fourth and Fifth digit should be from 01 to 99.";
              } else if (!/^(?!0{4})\d{4}$/.test(lastFour)) {
                errors.ssn = "Last four digits should be from 0001 to 9999";
              }
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            handleSignUpNanny(values, setSubmitting);
          }}
        >
          {({
            values,
            errors,
            touched,
            setFieldValue,
            setFieldError,
            handleChange,
            handleBlur,
            isSubmitting,
          }) => (
            <Form>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  minWidth: "800px",
                  padding: "2rem",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#fff",
                }}
              >
                <Typography
                  variant="h4"
                  component="h4"
                  className="text-black"
                  sx={{ textTransform: "uppercase" }}
                >
                  Sign Up as a nanny
                </Typography>
                <CommonSignUpFields
                  values={values}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  errors={errors}
                  setFieldValue={setFieldValue}
                  setFieldError={setFieldError}
                />
                <NannyFields
                  values={values}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  errors={errors}
                  setFieldValue={setFieldValue}
                  setFieldError={setFieldError}
                />
                <Button
                  type="submit"
                  disabled={!!(isSubmitting || Object.keys(errors).length > 0)}
                >
                  {isSubmitting ? <CircularProgress size={24} /> : "Sign Up"}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
}
export default NannySignUp;
