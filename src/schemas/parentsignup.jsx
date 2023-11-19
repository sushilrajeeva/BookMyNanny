import * as Yup from "yup";

export const parentSchema = Yup.object().shape({
  displayName: Yup.string()
    .required("Display name is required")
    .matches("^[a-zA-Z ]*$", "Invalid Name")
    .min(3, "Name must be atleast 3 cahracters")
    .max(40, "Name cannot be greater than 40 cahracters"),
  email: Yup.string()
    .required("Email is required")
    .email("Please enter a valid email"),
  passwordOne: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  passwordTwo: Yup.string().required("Confirm password is required"),
  firstName: Yup.string()
    .required("First name is required")
    .matches("^[a-zA-Z ]*$", "Invalid First name")
    .min(3, "First name must be atleast 3 cahracters")
    .max(40, "First name cannot be greater than 40 cahracters"),
  lastName: Yup.string()
    .required("Last name is required")
    .matches("^[a-zA-Z ]*$", "Invalid Last name")
    .min(3, "Last name must be atleast 3 characters")
    .max(40, "Last name cannot be greater than 40 cahracters"),
  street: Yup.string()
    .required("Street is required")
    .min(6, "Street must be at least 6 characters"),
  city: Yup.string()
    .required("City is required")
    .min(3, "City must be at least 3 characters"),
  state: Yup.string()
    .required("State is required")
    .min(3, "State must be at least 3 characters"),
  pincode: Yup.string()
    .required("Zip code is required")
    .min(5, "Zip code must be at least 5 characters"),
  phoneNumber: Yup.string()
    .required("Phone Number is required")
    .matches(/^\(\d{3}\)\s\d{3}-\d{4}$/, "Invalid Phone Number"),
  dob: Yup.string("Invalid DOB").required("DOB is required"),
});
