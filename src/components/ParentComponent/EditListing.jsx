import React, { useState } from 'react';
import { Button, CircularProgress, TextField } from "@mui/material";
import { Formik, Form, Field } from "formik";
import DatePickerFormInput from "../DatePicker";
import AdressFields from "../AdressFields";
import moment from "moment";
import { listingSchema } from "../../schemas/listing";
import { validateDate } from "../../helpers";

const EditListing = ({ listing, onSaveClick, onCancelClick }) => {
  const [editedListing, setEditedListing] = useState({
    listingName: listing.listingName,
    street: listing.street,
    city: listing.city,
    state: listing.state,
    country: listing.country,
    pincode: listing.pincode,
    hourlyRate: listing.hourlyRate,
    jobStartDate: listing.jobStartDate,
    jobEndDate: listing.jobEndDate,
    payableHours: listing.payableHours,
    kidInfo: listing.kidInfo,
    description: listing.description
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedListing((prevListing) => ({
      ...prevListing,
      [name]: value,
    }));
  };

  return (
    <Formik
      initialValues={{
        listingName: editedListing.listingName,
        street: editedListing.street,
        city: editedListing.city,
        state: editedListing.state,
        country: editedListing.country,
        pincode: editedListing.pincode,
        hourlyRate: editedListing.hourlyRate,
        jobStartDate: editedListing.jobStartDate,
        jobEndDate: editedListing.jobEndDate,
        payableHours: editedListing.payableHours,
        kidInfo: editedListing.kidInfo,
        description: editedListing.description
      }}
      validationSchema={listingSchema}
      onSubmit={(values, { setSubmitting }) => {
        setEditedListing({
          ...editedListing,
          ...values,
        });

        onSaveClick({
            listingId: listing._id,
            updatedData: values,
          }); // Pass editedListing instead of values

        setSubmitting(false);
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
        <Form>
          <div>
            <TextField
              variant="standard"
              label="Listing Name"
              name="listingName"
              value={values.listingName}
              onChange={handleChange}
              onBlur={handleBlur}
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
            <TextField
              variant="standard"
              label="Hourly Rate"
              name="hourlyRate"
              value={values.hourlyRate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.hourlyRate && Boolean(errors.hourlyRate)}
              helperText={touched.hourlyRate && errors.hourlyRate}
              fullWidth
              required
            />
            <TextField
              variant="standard"
              label="Job Start Date"
              name="jobStartDate"
              value={values.jobStartDate}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              required
            />
            <TextField
              variant="standard"
              label="Job End Date"
              name="jobEndDate"
              value={values.jobEndDate}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
            />
            <TextField
              variant="standard"
              label="Payable Hours"
              name="payableHours"
              value={values.payableHours}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.payableHours && Boolean(errors.payableHours)}
              helperText={touched.payableHours && errors.payableHours}
              fullWidth
              required
            />
          </div>
          <Button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded"
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Save Changes"}
          </Button>
          <Button
            onClick={onCancelClick}
            className="bg-red-500 text-white p-2 rounded"
          >
            Cancel Edit
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default EditListing;
