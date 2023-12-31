import React, { useContext, useState } from "react";
import { createParentListing } from "../../firebase/ParentFunctions";
import { AuthContext } from "../../context/AuthContext";
import { AlertContext } from "../../context/AlertContext";
import { v4 as uuid } from "uuid";
import AdressFields from "../AdressFields";
import {
  Box,
  CircularProgress,
  Typography,
  Stack,
  TextField,
  TextareaAutosize,
  Grid,
  InputLabel,
} from "@mui/material";
import { Button } from "@/components/ui/button";

import { Formik, Form, Field } from "formik";
import DatePickerFormInput from "../DatePicker";
import moment from "moment";
import { listingSchema } from "../../schemas/listing";
import { capitalize, validateDate } from "../../helpers";

const schema = listingSchema;

function CreateListingParent() {
  const { currentUser } = useContext(AuthContext);
  const { showAlert } = useContext(AlertContext);

  const handleCreateListing = async (values, setSubmitting) => {
    setSubmitting(true);
    let {
      listingName,
      street,
      city,
      state,
      pincode,
      hourlyRate,
      jobStartDate,
      jobEndDate,
      payableHours,
      kidInfo,
      description,
    } = values;

    try {
      // Create data object for storing in Firestore
      let dataToStore = {
        parentID: currentUser.uid,
        listingName: capitalize(listingName.trim()),
        street: capitalize(street.trim()),
        city: capitalize(city.trim()),
        state: capitalize(state.trim()),
        country: "United States",
        pincode,
        hourlyRate,
        jobStartDate: jobStartDate,
        jobEndDate: jobEndDate,
        kidInfo: kidInfo.trim(),
        description: description.trim(),
        interestedNannies: [],
        payableHours,
        selectedNannyID: "",
        status: "pending",
        progressBar: 0,
        postedDate: moment().format("YYYY/MM/DD HH:mm:ss"),
        chatID: uuid(),
      };

      if (moment(jobEndDate).isBefore(moment(jobStartDate))) {
        showAlert("error", "End date cannot be greater than start date");
        return true;
      }

      await createParentListing(dataToStore);
      showAlert("success", "Listing created successfully");
      return false; // No error
    } catch (error) {
      console.log(error);
      showAlert("error", error.message || "Unexpected error occurred");
      return true; // Error occurred
    } finally {
      setSubmitting(false);
    }
  };

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
            listingName: "",
            street: "",
            city: "",
            state: "",
            pincode: "",
            hourlyRate: "",
            jobStartDate: "",
            jobEndDate: "",
            payableHours: "",
            kidInfo: "",
            description: "",
          }}
          validationSchema={schema}
          validate={(values) => {
            const errors = {};
            if (values.jobStartDate) {
              const dateFormat = "MM-DD-YYYY HH:mm:ss";
              const minDate = moment().startOf("day").format(dateFormat);
              const maxDate = moment().add(1, "year").format(dateFormat);
              if (!validateDate(values.jobStartDate, minDate, maxDate))
                errors.jobStartDate =
                  "Job Date must be between current day to 1 year from today";
            }
            if (values.jobEndDate) {
              const dateFormat = "MM-DD-YYYY HH:mm:ss";
              const minDate = moment().startOf("day").format(dateFormat);
              const maxDate = moment().add(1, "year").format(dateFormat);
              if (!validateDate(values.jobEndDate, minDate, maxDate))
                errors.jobEndDate =
                  "Job Date must be between current day to 1 year from today";
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            const error = await handleCreateListing(values, setSubmitting);
            if (!error) {
              resetForm({ values: "" });
            }
          }}
        >
          {({
            values,
            errors,
            touched,
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
                  minWidth: "500px",
                  padding: "2rem",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#fff",
                }}
              >
                <TextField
                  variant="standard"
                  label="Listing Name"
                  name="listingName"
                  value={values.listingName}
                  onInput={(e) => {
                    handleChange(e);
                    setTimeout(() => handleBlur(e), 0);
                  }}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.listingName && Boolean(errors.listingName)}
                  helperText={touched.listingName && errors.listingName}
                  fullWidth
                  required
                />

                <AdressFields
                  values={values}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  errors={errors}
                />

                <Stack marginTop={1}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Field
                        name="jobStartDate"
                        component={DatePickerFormInput}
                        label="Job Start Date"
                        minDate={moment()}
                        maxDate={moment().add(1, "year")}
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        name="jobEndDate"
                        component={DatePickerFormInput}
                        label="Job End Date"
                        minDate={moment()}
                        maxDate={moment().add(1, "year")}
                        required
                      />
                    </Grid>
                  </Grid>
                </Stack>

                <TextField
                  variant="standard"
                  label="Payable Hours"
                  name="payableHours"
                  value={values.payableHours}
                  onInput={(e) => {
                    handleChange(e);
                    setTimeout(() => handleBlur(e), 0);
                  }}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.payableHours && Boolean(errors.payableHours)}
                  helperText={touched.payableHours && errors.payableHours}
                  fullWidth
                  required
                />

                <TextField
                  variant="standard"
                  label="Hourly Rate"
                  name="hourlyRate"
                  value={values.hourlyRate}
                  onInput={(e) => {
                    handleChange(e);
                    setTimeout(() => handleBlur(e), 0);
                  }}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.hourlyRate && Boolean(errors.hourlyRate)}
                  helperText={touched.hourlyRate && errors.hourlyRate}
                  fullWidth
                  required
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: "16px",
                  }}
                >
                  <InputLabel
                    htmlFor="kidInfo"
                    style={{ marginBottom: "8px", fontSize: "14px" }}
                  >
                    Kid Information*
                  </InputLabel>
                  <TextareaAutosize
                    id="kidInfo"
                    minRows={3}
                    name="kidInfo"
                    placeholder="Enter info about your kid here..."
                    value={values.kidInfo}
                    onInput={(e) => {
                      handleChange(e);
                      setTimeout(() => handleBlur(e), 0);
                    }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className="text-black"
                    style={{
                      width: "35rem",
                      border: "1px solid black",
                    }}
                  />
                </div>

                {touched.kidInfo && errors.kidInfo && (
                  <Typography variant="caption" color="error" textAlign="left">
                    {errors.kidInfo}
                  </Typography>
                )}

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: "16px",
                  }}
                >
                  <InputLabel
                    htmlFor="description"
                    style={{ marginBottom: "8px", fontSize: "14px" }}
                  >
                    Responsibilities*
                  </InputLabel>

                  <TextareaAutosize
                    id="description"
                    minRows={3}
                    name="description"
                    placeholder="Provide brief description about the work (min 10 characters)"
                    value={values.description}
                    onInput={(e) => {
                      handleChange(e);
                      setTimeout(() => handleBlur(e), 0);
                    }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="text-black"
                    required
                    style={{
                      width: "35rem",

                      border: "1px solid black",
                    }}
                  />
                </div>

                {touched.description && errors.description && (
                  <Typography variant="caption" color="error" textAlign="left">
                    {errors.description}
                  </Typography>
                )}
                <Button
                  type="submit"
                  disabled={!!(isSubmitting || Object.keys(errors).length > 0)}
                >
                  {isSubmitting ? <CircularProgress size={24} /> : "Create"}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
}

export default CreateListingParent;
