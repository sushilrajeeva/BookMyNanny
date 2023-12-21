import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { AlertContext } from "../../context/AlertContext";
import { profile } from "../../schemas/profile";
import ProfileFields from "./ProfileFields";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import { Formik, Form } from "formik";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { nannyProfile } from "@/schemas/nannyProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import CustomLoading from "../EssentialComponents/CustomLoading";
import axios from "axios";

const Profile = () => {
  const { currentUser, userRole } = useContext(AuthContext);
  const { showAlert } = useContext(AlertContext);
  const aRef = useRef(null);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mainLoading, setMainLoading] = useState(true);
  const [initialValues, setInitialValues] = useState(null);

  let schema;
  if (userRole === "parent") schema = profile;
  else if (userRole === "nanny") schema = nannyProfile;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (currentUser) {
          if (userRole === "parent") {
            try {
              const response = await axios.get(
                `http://localhost:3000/getParent/${currentUser.uid}`
              );

              console.log("RESPONSE", response.data);
              const parentData = await response.data;
              setImageUrl(parentData.image);
              console.log(parentData);
              setInitialValues({
                email: parentData.emailAddress,
                firstName: parentData.firstName,
                lastName: parentData.lastName,
                phoneNumber: parentData.phoneNumber,
                street: parentData.street,
                city: parentData.city,
                state: parentData.state,
                country: parentData.country,
                pincode: parentData.pincode,
                dob: parentData.dob,
              });
            } catch (error) {
              console.log("FETTTCH", error);
            }
          } else if (userRole === "nanny") {
            const response = await axios.get(
              `http://localhost:3000/getNanny/${currentUser.uid}`
            );

            console.log("RESPONSE", response.data);
            const nannyData = await response.data;
            setImageUrl(nannyData.image);
            setInitialValues({
              email: nannyData.emailAddress,
              firstName: nannyData.firstName,
              lastName: nannyData.lastName,
              phoneNumber: nannyData.phoneNumber,
              street: nannyData.street,
              city: nannyData.city,
              state: nannyData.state,
              country: nannyData.country,
              pincode: nannyData.pincode,
              dob: nannyData.dob,
              bio: nannyData.bio,
              experience: nannyData.experience,
              ssn: nannyData.ssn,
            });
          } else {
            setMainLoading(true);
          }
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setMainLoading(false);
      }
    };

    fetchProfileData();
  }, [currentUser, userRole]);

  const handleImageChange = (e) => {
    setFile(e.target.files[0]);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!file) {
      showAlert("error", "File is empty. Please choose a file.");
      return;
    }
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      showAlert(
        "error",
        "Invalid file type. Please choose a PNG, JPEG, or JPG file."
      );
      return;
    }
    setLoading(true);
    if (file) {
      try {
        const { url } = await fetch("http://localhost:3000/s3Url").then((res) =>
          res.json()
        );
        await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: file,
        });
        const newImageUrl = url.split("?")[0];
        const imgObj = { image: newImageUrl };
        if (userRole === "parent") {
          const response = await axios.patch(
            `http://localhost:3000/updateParent/${currentUser.uid}`,
            imgObj,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log("UPDATE RESPONSE", response);

          if (response.status === 200) {
            showAlert("success", "Image uploaded successfully!");
          } else {
            showAlert("error", "Error uploading image. Please try again.");
          }
        } else {
          const response = await axios.patch(
            `http://localhost:3000/updateNanny/${currentUser.uid}`,
            imgObj,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log("UPDATE RESPONSE", response);

          if (response.status === 200) {
            showAlert("success", "Image uploaded successfully!");
          } else {
            showAlert("error", "Error uploading image. Please try again.");
          }
        }
        setImageUrl(newImageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        showAlert("error", "Error uploading image. Please try again.");
      } finally {
        setLoading(false);
        aRef.current.value = null;
      }
    }
  };

  const handleProfile = async (values, setSubmitting) => {
    if (userRole === "parent") {
      try {
        setSubmitting(true);
        const {
          firstName,
          lastName,
          phoneNumber,
          street,
          city,
          state,
          country,
          pincode,
        } = values;
        const response = await axios.get(
          `http://localhost:3000/getParent/${currentUser.uid}`
        );
        const currentUserData = await response.data;
        const changedValues = Object.entries({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phoneNumber: phoneNumber,
          street: street.trim(),
          city: city.trim(),
          state: state.trim(),
          country: country.trim(),
          pincode: pincode,
        }).reduce((acc, [key, value]) => {
          if (currentUserData[key] !== value) {
            acc[key] = value;
          }
          return acc;
        }, {});

        console.log("Changed values:", changedValues);

        // Update only the changed values
        if (Object.keys(changedValues).length > 0) {
          const response = await axios.patch(
            `http://localhost:3000/updateParent/${currentUser.uid}`,
            changedValues,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.status === 200) {
            showAlert("success", "Profile updated successfully!");
          } else {
            showAlert("error", "Update not successful");
          }
        } else showAlert("error", "Cannot update with same values");
      } catch (error) {
        console.error("Error updating profile:", error);
        showAlert("error", "Error updating profile. Please try again.");
      } finally {
        setSubmitting(false);
      }
    } else if (userRole === "nanny") {
      try {
        setSubmitting(true);
        const {
          firstName,
          lastName,
          phoneNumber,
          street,
          city,
          state,
          country,
          pincode,
          bio,
          experience,
        } = values;
        const response = await axios.get(
          `http://localhost:3000/getNanny/${currentUser.uid}`
        );
        const currentUserData = await response.data;
        const changedValues = Object.entries({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phoneNumber: phoneNumber,
          street: street.trim(),
          city: city.trim(),
          state: state.trim(),
          country: country.trim(),
          pincode: pincode,
          bio: bio.trim(),
          experience: experience,
        }).reduce((acc, [key, value]) => {
          if (currentUserData[key] !== value) {
            acc[key] = value;
          }
          return acc;
        }, {});

        console.log("Changed values:", changedValues);
        if (Object.keys(changedValues).length > 0) {
          const response = await axios.patch(
            `http://localhost:3000/updateNanny/${currentUser.uid}`,
            changedValues,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.status === 200) {
            showAlert("success", "Profile updated successfully!");
          } else {
            showAlert("error", "Update not successful");
          }
        } else showAlert("error", "Cannot update with same values");
      } catch (error) {
        console.error("Error updating profile:", error);
        showAlert("error", "Error updating profile. Please try again.");
      } finally {
        setSubmitting(false);
      }
    } else {
      setMainLoading(true);
    }
  };

  if (mainLoading) {
    // Show loading indicator while waiting for user data
    return <CustomLoading />;
  }

  return (
    <div className="profile-card mt-16">
      <div className=" flex flex-row">
        <Card className="w-full h-[340px] md:w-[340px] p-4 ml-9 bg-white">
          <CardContent>
            <form onSubmit={submit}>
              <div className="flex flex-col items-center space-y-1.5">
                {imageUrl && (
                  <Avatar className="w-[220px] h-[220px]">
                    <AvatarImage src={imageUrl} alt="Profile" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                )}

                <Input
                  className="bg-white text-black"
                  ref={aRef}
                  onChange={handleImageChange}
                  type="file"
                  accept="image/*"
                  required
                />
                <Button
                  
                  variant="contained"
                  type="submit"
                  sx={{
                    height: "2rem",
                    width: "6rem",
                  }}
                  disabled={loading}
                >
                  {loading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <Card className="w-full p-4 ml-9">
          {!initialValues ? (
            <CustomLoading />
          ) : (
            <Formik
              initialValues={initialValues}
              validationSchema={schema}
              validate={(values) => {
                const errors = {};
                return errors;
              }}
              onSubmit={async (values, { setSubmitting }) => {
                handleProfile(values, setSubmitting);
              }}
            >
              {({
                values,
                errors,
                touched,
                setFieldValue,
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

                      borderRadius: "8px",

                      backgroundColor: "#fff",
                    }}
                  >
                    {/* <Typography
                      variant="h2"
                      component="h3"
                      sx={{ textTransform: "uppercase" }}
                    >
                      Sign Up as a parent
                    </Typography> */}
                    <ProfileFields
                      values={values}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      touched={touched}
                      errors={errors}
                      setFieldValue={setFieldValue}
                      userRole={userRole}
                    />
                    {userRole === "nanny" && (
                      <>
                        <TextField
                          variant="standard"
                          label="Experience"
                          name="experience"
                          value={values.experience}
                          onInput={(e) => {
                            handleChange(e);
                            setTimeout(() => handleBlur(e), 0);
                          }}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.experience && Boolean(errors.experience)
                          }
                          helperText={touched.experience && errors.experience}
                          fullWidth
                          required
                        />
                        <TextareaAutosize
                          minRows={6}
                          name="bio"
                          placeholder="Enter your bio here..."
                          value={values.bio}
                          onInput={(e) => {
                            handleChange(e);
                            setTimeout(() => handleBlur(e), 0);
                          }}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="text-black"
                          required
                          style={{
                            width: "100%",
                            marginTop: "16px",
                            border: "1px solid black",
                          }}
                        />

                        {touched.bio && errors.bio && (
                          <Typography
                            variant="caption"
                            color="error"
                            textAlign="left"
                          >
                            {errors.bio}
                          </Typography>
                        )}
                      </>
                    )}
                    <Button
                      variant="contained"
                      type="submit"
                      sx={{
                        height: "3rem",
                        width: "10rem",
                      }}
                      disabled={
                        !!(
                          isSubmitting ||
                          Object.keys(errors).length > 0 ||
                          JSON.stringify(values) ===
                            JSON.stringify(initialValues)
                        )
                      }
                    >
                      {isSubmitting ? <CircularProgress size={24} /> : "Update"}
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Profile;
