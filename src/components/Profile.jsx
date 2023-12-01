import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { AlertContext } from "../context/AlertContext";
import { getParentById, updateParentData } from "../firebase/ParentFunctions";
import { getNannyById, updateNannyData } from "../firebase/NannyFunctions";

const Profile = () => {
  const aRef = useRef(null);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser, userRole } = useContext(AuthContext);
  const { showAlert } = useContext(AlertContext);

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
    aRef.current.value = null;
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
    <div className="profile-container">
      <form onSubmit={submit} className="form-container">
        <input
          ref={aRef}
          onChange={handleImageChange}
          type="file"
          accept="image/*"
        />
        <button type="submit" onClick={resetInput} disabled={loading}>
          {" "}
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {imageUrl && (
        <div className="image-container">
          <p>Current Image:</p>
          <img src={imageUrl} alt="Profile" />
        </div>
      )}
    </div>
  );
};

export default Profile;
