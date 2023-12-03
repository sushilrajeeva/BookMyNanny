import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { AlertContext } from "../context/AlertContext";
import { getParentById, updateParentData } from "../firebase/ParentFunctions";
import { getNannyById, updateNannyData } from "../firebase/NannyFunctions";

// Importing Shadcn ui components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


// References for this page
// Spinner using tailwind css - https://tailwindcss.com/docs/animation
// profile ui design reference -  https://ui.shadcn.com/example , https://ui.shadcn.com/docs/components/input

const Profile = () => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser, userRole } = useContext(AuthContext);
  //const { showAlert } = useContext(AlertContext);
  const [alert, setAlert] = useState({ show: false, title: '', description: '' });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (currentUser) {
          if (userRole === "parent") {
            const parentData = await getParentById(currentUser.uid);
            console.log(parentData.image);
            setImageUrl(parentData.image);
          } else {
            const nannyData = await getNannyById(currentUser.uid);
            console.log(nannyData.image);
            setImageUrl(nannyData.image);
          }
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  const handleImageChange = (e) => {
    setFile(e.target.files[0]);
  };

  const resetInput = () => {
    fileInputRef.current.value = null;
  };

  const showAlert = (title, description) => {
    setAlert({ show: true, title, description });
  };

  const closeAlert = () => {
    setAlert({ show: false, title: '', description: '' });
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
        console.log(url);

        // post the image direclty to the s3 bucket
        await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: file,
        });

        const newImageUrl = url.split("?")[0];
        console.log(newImageUrl);

        if (userRole === "parent")
          await updateParentData(currentUser.uid, newImageUrl);
        else await updateNannyData(currentUser.uid, newImageUrl);

        setImageUrl(newImageUrl);

        showAlert("success", "Image uploaded successfully!");
      } catch (error) {
        console.error("Error uploading image:", error);
        showAlert("error", "Error uploading image. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 gap-y-2">
              <div className="text-left">
                <Label htmlFor="picture">Picture</Label>
              </div>
              <Input 
                ref={fileInputRef}
                id="picture" 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <Button type="submit" onClick={resetInput} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    {/* Took referene from https://tailwindcss.com/docs/animation */}
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c5.523 0 10-4.523 10-10z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </form>

          {imageUrl && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-semibold">Current Image:</p>
              <img src={imageUrl} alt="Profile" className="rounded-lg shadow-md" />
            </div>
          )}
        </CardContent>
      </Card>

      {alert.show && (
        <AlertDialog open={alert.show} onOpenChange={closeAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{alert.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {alert.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogAction onClick={closeAlert}>OK</AlertDialogAction>
          </AlertDialogContent>
        </AlertDialog>
      )}

    </div>
  );
};

export default Profile;


