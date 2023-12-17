import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { AlertContext } from "../../context/AlertContext";
import { getParentById } from "../../firebase/ParentFunctions";
import { getNannyById } from "../../firebase/NannyFunctions";
import { Box, Stack, Typography } from "@mui/material";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import moment from "moment";
import CustomLoading from "../EssentialComponents/CustomLoading";

const ShowProfile = () => {
  const { currentUser, userRole } = useContext(AuthContext);
  const { showAlert } = useContext(AlertContext);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mainLoading, setMainLoading] = useState(true);
  const [values, setValues] = useState({});

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (currentUser) {
          if (userRole === "parent") {
            const parentData = await getParentById(currentUser.uid);
            console.log("Parent", parentData);
            setImageUrl(parentData.image);
            console.log(parentData);
            setValues({
              displayName: parentData.displayName,
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
          } else if (userRole === "nanny") {
            const nannyData = await getNannyById(currentUser.uid);
            console.log(nannyData.image);
            setImageUrl(nannyData.image);
            setValues({
              displayName: nannyData.displayName,
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
        showAlert("error", "Profile could not be fetched.");
      } finally {
        setMainLoading(false);
      }
    };

    fetchProfileData();
  }, [currentUser, userRole]);

  if (mainLoading) {
    // Show loading indicator while waiting for user data
    return <CustomLoading/>;
  }

  const DisplayProfileField = ({ label, value }) => {
    return (
      <Stack
        direction="column"
        sx={{
          width: "100%",
          alignItems: "flex-start",
        }}
      >
        <Typography
          sx={{
            fontSize: "0.75rem",
            color: "rgba(0, 0, 0, 0.6)",
            fontFamily: "sans-serif",
            fontWeight: "400",
            lineHeight: "1.4375em",
            letterSpacing: "0.00938em",
          }}
          variant="subtitle1"
        >
          {label}
        </Typography>
        {label === "Bio" ? (
          <Typography variant="body1" sx={{ textAlign: "left" }}>
            {value}
          </Typography>
        ) : (
          <Typography variant="body1">{value}</Typography>
        )}
      </Stack>
    );
  };

  const PhoneNumberDisplay = ({ label, value }) => {
    console.log("phone", value);
    return (
      <Stack
        direction="column"
        sx={{
          width: "100%",
          alignItems: "flex-start",
        }}
      >
        <Typography
          sx={{
            fontSize: "0.75rem",
            color: "rgba(0, 0, 0, 0.6)",
            fontFamily: "sans-serif",
            fontWeight: "400",
            lineHeight: "1.4375em",
            letterSpacing: "0.00938em",
          }}
          variant="subtitle1"
        >
          {label}
        </Typography>
        <Typography variant="body1">+1 {value}</Typography>
      </Stack>
    );
  };

  return (
    <div className="profile-card">
      <div className=" flex flex-row">
        <Card className="w-full h-[250px] md:w-[340px] p-4 ml-9">
          <CardContent>
            <div className="flex flex-col items-center space-y-1.5">
              {console.log(imageUrl)}
              {imageUrl && (
                <Avatar className="w-[220px] h-[220px]">
                  <AvatarImage src={imageUrl} alt="Profile" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="w-full p-4 ml-9">
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
            {console.log(values)}
            <Stack
              direction="row"
              spacing={2}
              sx={{
                width: "100%",
              }}
            >
              <DisplayProfileField
                label="First Name"
                value={values.firstName}
              />
              <DisplayProfileField label="Last Name" value={values.lastName} />
            </Stack>

            <DisplayProfileField label="Email" value={values.email} />

            <DisplayProfileField
              label="Date of Birth"
              value={moment(values.dob).format("LL")}
            />
            <PhoneNumberDisplay
              label="Phone Number"
              value={values.phoneNumber}
            />
            {userRole === "nanny" && (
              <>
                <DisplayProfileField
                  label="Experience"
                  value={values.experience}
                />
              </>
            )}

            <Stack
              direction="row"
              spacing={2}
              sx={{
                width: "100%",
              }}
            >
              <DisplayProfileField label="Street" value={values.street} />

              <DisplayProfileField label="City" value={values.city} />
            </Stack>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                width: "100%",
              }}
            >
              <DisplayProfileField label="State" value={values.state} />
              <DisplayProfileField label="Country" value={values.country} />
              <DisplayProfileField label="Pincode" value={values.pincode} />
            </Stack>
            {userRole === "nanny" && (
              <>
                <DisplayProfileField label="Bio" value={values.bio} />
              </>
            )}
          </Box>
        </Card>
      </div>
    </div>
  );
};

export default ShowProfile;
