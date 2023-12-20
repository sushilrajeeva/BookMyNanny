import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, CardMedia, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import { getUserRole } from "@/firebase/AuthFunctions";
import { getNannyById } from "@/firebase/NannyFunctions";
import { getParentById } from "@/firebase/ParentFunctions";
import CustomLoading from "../EssentialComponents/CustomLoading";

function ProfileFullView() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        let role = await getUserRole(id);

        // Determine whether the user is a nanny or parent based on the provided ID
        if (role === "nanny") {
          const nannyData = await getNannyById(id);
          setUserData(nannyData);
        } else if (role === "parent") {
          const parentData = await getParentById(id);
          setUserData(parentData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) return <CustomLoading />;

  if (!userData) return <div>User not found.</div>;

  return (
    <div className="mt-16">
      <Grid container justifyContent="center">
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              alt="User Image"
              height="300"
              image={userData.image}
            />
            <CardContent>
              <Typography variant="subtitle1">
                Role: {userData.role === "nanny" ? "Nanny" : "Parent"}
              </Typography>
              <Typography variant="body1">
                Email: {userData.emailAddress}
              </Typography>
              <Typography variant="body1">
                Phone Number: {userData.phoneNumber}
              </Typography>
              {userData.role === "nanny" && (
                <>
                  <Typography variant="body1">
                    Experience: {userData.experience} years
                  </Typography>
                  <Typography variant="body1">Bio: {userData.bio}</Typography>
                </>
              )}
              {userData.role === "parent" && (
                <>
                  <Typography variant="body1">
                    Child's Name: {userData.firstName}
                  </Typography>
                </>
              )}
              <Typography variant="body1">
                Date of Birth: {userData.dob}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default ProfileFullView;
