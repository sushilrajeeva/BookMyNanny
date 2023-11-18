import React, { useContext, useState } from "react";
// import { createParentListing } from '../firebase/ParentFunctions';

function CreateListingParent() {
  const [formData, setFormData] = useState({
    listingName: "",
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    hourlyRate: "",
    startTime: "",
    endTime: "",
    jobDate: "",
    postedDate: "",
    kidInfo: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();

    try {
      // Create data object for storing in Firestore
      let dataToStore = {
        listingName: formData.listingName,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
        hourlyRate: formData.hourlyRate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        jobDate: formData.jobDate,
        postedDate: formData.postedDate,
        kidInfo: formData.kidInfo,
        description: formData.description,
      };

      console.log("From createParentListing component data:", dataToStore);
      await createParentListing(dataToStore);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  return (
    <form onSubmit={handleCreateListing}>
      <div className="form-group">
        <label>
          Listing Name:
          <br />
          <input
            className="form-control"
            required
            name="listingName"
            type="text"
            placeholder="Listing Name"
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          Street:
          <br />
          <input
            className="form-control"
            required
            name="street"
            type="text"
            placeholder="Street"
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          City:
          <br />
          <input
            className="form-control"
            required
            name="city"
            type="text"
            placeholder="City"
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          State:
          <br />
          <input
            className="form-control"
            required
            name="state"
            type="text"
            placeholder="State"
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          Country:
          <br />
          <input
            className="form-control"
            required
            name="country"
            type="text"
            placeholder="Country"
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          Pincode:
          <br />
          <input
            className="form-control"
            required
            name="pincode"
            type="text"
            placeholder="Pincode"
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          Hourly Rate:
          <br />
          <input
            className="form-control"
            required
            name="hourlyRate"
            type="text"
            placeholder="Hourly Rate"
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          Start Time:
          <br />
          <input
            className="form-control"
            required
            name="startTime"
            type="text"
            placeholder="Start Time"
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          End Time:
          <br />
          <input
            className="form-control"
            required
            name="endTime"
            type="text"
            placeholder="End Time"
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          Job Date:
          <br />
          <input
            className="form-control"
            required
            name="jobDate"
            type="text"
            placeholder="Job Date"
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          Posted Date:
          <br />
          <input
            className="form-control"
            required
            name="postedDate"
            type="text"
            placeholder="Posted Date"
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          Kid Info:
          <br />
          <input
            className="form-control"
            required
            name="kidInfo"
            type="text"
            placeholder="Kid Info"
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          Description:
          <br />
          <textarea
            className="form-control"
            required
            name="description"
            placeholder="Description (min 150 chars)"
          />
        </label>
      </div>
      <button className="button" type="submit">
        Create Listing
      </button>
    </form>
  );
}

export default CreateListingParent;
