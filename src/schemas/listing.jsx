import * as Yup from "yup";

export const listingSchema = Yup.object().shape({
  listingName: Yup.string()
    .required("Listing name is required")
    .matches("^[a-zA-Z ]*$", "Invalid Name")
    .min(3, "Listing name must be atleast 3 cahracters")
    .test(
      "is-not-empty-after-trim",
      "Cannot be empty. Enter valid characters",
      (value) => value.trim() !== ""
    ),
  street: Yup.string()
    .required("Street is required")
    .min(6, "Street must be at least 6 characters")
    .test(
      "is-not-empty-after-trim",
      "Cannot be empty. Enter valid characters",
      (value) => value.trim() !== ""
    ),
  city: Yup.string()
    .required("City is required")
    .min(3, "City must be at least 3 characters")
    .matches("^[a-zA-Z ]*$", "Invalid City name")
    .test(
      "is-not-empty-after-trim",
      "Cannot be empty. Enter valid characters",
      (value) => value.trim() !== ""
    ),
  state: Yup.string()
    .required("State is required")
    .min(3, "State must be at least 3 characters")
    .matches("^[a-zA-Z ]*$", "Invalid State name")
    .test(
      "is-not-empty-after-trim",
      "Cannot be empty. Enter valid characters",
      (value) => value.trim() !== ""
    ),

  pincode: Yup.string()
    .required("Zip code is required")
    .min(4, "Zip code must be between 4-16 characters")
    .max(16, "Zip code must be between 4-16 characters")
    .matches(/^\d+$/, "Pincode must be a number"),
  jobStartDate: Yup.string("Invalid Job Date").required("Job Date is required"),
  jobEndDate: Yup.string("Invalid Job Date").required("Job Date is required"),
  hourlyRate: Yup.string()
    .required("Hourly rate is required")
    .matches(
      /^-?\d*\.?\d{0,2}$/,
      "Payable hours must be a number with up to 2 decimal points"
    )
    .test("is-valid-range", "Enter rate between 10-100", (value) => {
      if (!value) return true;
      const numericValue = parseFloat(value);
      return numericValue >= 10 && numericValue <= 100;
    }),
  payableHours: Yup.string()
    .required("Payable hours is required")
    .matches(
      /^-?\d*\.?\d{0,2}$/,
      "Payable hours must be a number with up to 2 decimal points"
    )
    .test("is-valid-range", "Enter hours between 0-100", (value) => {
      if (!value) return true;
      const numericValue = parseFloat(value);
      return numericValue >= 0 && numericValue <= 100;
    }),
  kidInfo: Yup.string()
    .required("Kid Info is required")
    .min(5, "Kid Info must be at least 5 characters")
    .test(
      "is-not-empty-after-trim",
      "Cannot be empty. Enter valid characters",
      (value) => value.trim() !== ""
    ),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .test(
      "is-not-empty-after-trim",
      "Cannot be empty. Enter valid characters",
      (value) => value.trim() !== ""
    ),
});
