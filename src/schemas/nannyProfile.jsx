import * as Yup from "yup";

export const nannyProfile = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is required")
    .matches("^[a-zA-Z ]*$", "Invalid First name")
    .min(3, "First name must be atleast 3 cahracters")
    .max(40, "First name cannot be greater than 40 cahracters")
    .test(
      "is-not-empty-after-trim",
      "Cannot be empty. Enter valid characters",
      (value) => value.trim().length > 0
    )
    .test(
      "is-not-empty-after-trim-length",
      "Enter at least 3 valid characters.",
      (value) => value.trim().length >= 3
    ),
  lastName: Yup.string()
    .required("Last name is required")
    .matches("^[a-zA-Z ]*$", "Invalid Last name")
    .min(3, "Last name must be atleast 3 characters")
    .max(40, "Last name cannot be greater than 40 cahracters")
    .test(
      "is-not-empty-after-trim",
      "Cannot be empty. Enter valid characters",
      (value) => value.trim().length > 0
    )
    .test(
      "is-not-empty-after-trim-length",
      "Enter at least 3 valid characters.",
      (value) => value.trim().length >= 3
    ),
  street: Yup.string()
    .required("Street is required")
    .min(6, "Street must be at least 6 characters")
    .matches("^[a-zA-Z0-9-, ]*$", "Invalid Street name")
    .test(
      "is-not-empty-after-trim",
      "Cannot be empty. Enter valid characters",
      (value) => value.trim().length > 0
    )
    .test(
      "is-not-empty-after-trim-length",
      "Enter at least 3 valid characters.",
      (value) => value.trim().length >= 6
    ),
  city: Yup.string()
    .required("City is required")
    .min(3, "City must be at least 3 characters")
    .matches("^[a-zA-Z ]*$", "Invalid City name")
    .test(
      "is-not-empty-after-trim",
      "Cannot be empty. Enter valid characters",
      (value) => value.trim().length > 0
    )
    .test(
      "is-not-empty-after-trim-length",
      "Enter at least 3 valid characters.",
      (value) => value.trim().length >= 3
    ),
  state: Yup.string()
    .required("State is required")
    .min(3, "State must be at least 3 characters")
    .matches("^[a-zA-Z ]*$", "Invalid State name")
    .test(
      "is-not-empty-after-trim",
      "Cannot be empty. Enter valid characters",
      (value) => value.trim().length > 0
    )
    .test(
      "is-not-empty-after-trim-length",
      "Enter at least 3 valid characters.",
      (value) => value.trim().length >= 3
    ),

  pincode: Yup.string()
    .required("Zip code is required")
    .matches(/^\d{5}(?:-\d{4})?$/, "Invalid Pincode"),
  phoneNumber: Yup.string()
    .required("Phone Number is required")
    .matches(/^\d{10}$/, "Invalid Phone Number: Must be 10 digits"),

  experience: Yup.string()
    .required("Experience is required")
    .matches(/^\d+$/, "Experience must be a number")
    .test("is-valid-range", "Invalid Experience", (value) => {
      if (!value) return true;
      const numericValue = parseInt(value, 10);
      return numericValue >= 0 && numericValue <= 100;
    }),

  bio: Yup.string()
    .required("Bio is required")
    .min(20, "Bio must be at least 20 characters")
    .test(
      "is-not-empty-after-trim",
      "Cannot be empty. Enter valid characters",
      (value) => value.trim().length > 0
    )
    .test(
      "is-not-empty-after-trim-length",
      "Enter at least 20 valid characters.",
      (value) => value.trim().length >= 20
    ),
});
