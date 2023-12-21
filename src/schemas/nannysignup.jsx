import * as Yup from "yup";

export const nannySchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .matches(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/, "Invalid email")
    .test(
      "is-not-empty-after-trim",
      "Cannot be empty. Enter valid characters",
      (value) => value.trim().length > 0
    ),
  passwordOne: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 6 characters long"
    )
    .test(
      "is-not-empty-after-trim",
      "Cannot be empty. Enter valid characters",
      (value) => value.trim().length > 0
    ),
  passwordTwo: Yup.string().required("Confirm password is required"),
  firstName: Yup.string()
    .required("First name is required")
    .matches("^[a-zA-Z ]*$", "Invalid First name")
    .min(3, "First name must be at least 3 characters")
    .max(40, "First name cannot be greater than 40 characters")
    .test(
      "is-not-empty-after-trim",
      "Cannot be empty. Enter valid characters",
      (value) => value.trim().length > 0
    )
    .test(
      "is-not-empty-after-trim-length",
      "Name should have at least 3 valid characters.",
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
      "Name should have at least 3 valid characters.",
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
      "Street should have at least 6 valid characters.",
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
    .matches(/^\d{10}$/, "Invalid Phone Number"),
  dob: Yup.string("Invalid DOB").required("DOB is required"),
  experience: Yup.string()
    .required("Experience is required")
    .matches(
      /^-?\d*\.?\d{0,2}$/,
      "Experience must be a number with up to 2 decimal points"
    )
    .test(
      "is-valid-range",
      "Invalid Experience : Enter between 10-100",
      (value) => {
        if (!value) return true;
        const numericValue = parseFloat(value);
        return numericValue >= 0 && numericValue <= 100;
      }
    ),
  ssn: Yup.string().required("SSN is required"),
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
