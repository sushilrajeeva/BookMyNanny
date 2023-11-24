return (
  <div className="card">
    <h1>Sign up as a nanny</h1>
    {/* Add any validation messages here */}
    <form onSubmit={handleSignUpNanny}>
      <div className="form-group">
        <label>
          Name:
          <br />
          <input
            className="form-control"
            required
            name="displayName"
            type="text"
            placeholder="Name"
            autoFocus={true}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Email:
          <br />
          <input
            className="form-control"
            required
            name="email"
            type="email"
            placeholder="Email"
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Password:
          <br />
          <input
            className="form-control"
            id="passwordOne"
            name="passwordOne"
            type="password"
            placeholder="Password"
            autoComplete="off"
            required
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Confirm Password:
          <br />
          <input
            className="form-control"
            name="passwordTwo"
            type="password"
            placeholder="Confirm Password"
            autoComplete="off"
            required
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          First Name:
          <br />
          <input
            className="form-control"
            required
            name="firstName"
            type="text"
            placeholder="First Name"
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          Last Name:
          <br />
          <input
            className="form-control"
            required
            name="lastName"
            type="text"
            placeholder="Last Name"
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          Country Code:
          <br />
          <input
            className="form-control"
            required
            name="countryCode"
            type="text"
            placeholder="Country Code"
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          Phone Number:
          <br />
          <input
            className="form-control"
            required
            name="phoneNumber"
            type="text"
            placeholder="Phone Number"
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
          Date of Birth:
          <br />
          <input
            className="form-control"
            required
            name="dob"
            type="date"
            placeholder="Date of Birth"
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          Experience:
          <br />
          <input
            className="form-control"
            required
            name="experience"
            type="text"
            placeholder="experience"
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          SSN:
          <br />
          <input
            className="form-control"
            required
            name="ssn"
            type="text"
            placeholder="SSN"
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          Bio:
          <br />
          <textarea
            className="form-control"
            required
            name="bio"
            placeholder="Tell us about yourself"
          />
        </label>
      </div>

      <button
        className="button"
        id="submitButton"
        name="submitButton"
        type="submit"
      >
        Sign Up
      </button>
    </form>
    <br />
  </div>
);
