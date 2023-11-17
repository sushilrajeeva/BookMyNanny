import React, {useContext, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {doCreateUserWithEmailAndPassword,createUserDocument,getNannyDocs} from '../firebase/AuthFunctions';
import {AuthContext} from '../context/AuthContext';
import  db  from '../main.jsx';
function ParentSignUp() {
  const {currentUser} = useContext(AuthContext);
  const [pwMatch, setPwMatch] = useState('');
  const handleSignUpParent = async (e) => {
    e.preventDefault();
    const {
      displayName,
      email,
      passwordOne,
      passwordTwo,
      firstName,
      lastName,
      countryCode,
      phoneNumber,
      street,
      city,
      state,
      country,
      pincode,
      dob,
    } = e.target.elements;
  
    if (passwordOne.value !== passwordTwo.value) {
      setPwMatch('Passwords do not match');
      return false;
    }
  
    try {
      // Create user in Firebase Authentication
      let createdUid = await doCreateUserWithEmailAndPassword(
        email.value,
        passwordOne.value,
        displayName.value
      );
      console.log("created uid",createdUid)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      //todo need to hash password
        // if(!currentUser) throw "no usercreds to do crud"
        //await getNannyDocs()
      let dataToStore = {
        firstName: firstName.value,
        lastName: lastName.value,
        emailAddress: email.value,
        countryCode: countryCode.value,
        phoneNumber: phoneNumber.value,
        street: street.value,
        city: city.value,
        state: state.value,
        country: country.value,
        pincode: pincode.value,
        dob: dob.value,
        role: 'parent',
        password: passwordOne.value,
        listings: [],
        wallet: 0,
      }
      console.log("From signup component data:",dataToStore);
      // Create document in Firestore
      await createUserDocument(createdUid, dataToStore);
    } catch (error) {
      console.log(error)
      alert(error);
    }
  };
  
  if (currentUser) {
    return <Navigate to='/home' />;
  }

  return (
    <div className='card'>
      <h1>Sign up as a parent</h1>
      {pwMatch && <h4 className='error'>{pwMatch}</h4>}
      <form onSubmit={handleSignUpParent}>
        <div className='form-group'>
          <label>
            Name:
            <br />
            <input
              className='form-control'
              required
              name='displayName'
              type='text'
              placeholder='Name'
              autoFocus={true}
            />
          </label>
        </div>
        <div className='form-group'>
          <label>
            Email:
            <br />
            <input
              className='form-control'
              required
              name='email'
              type='email'
              placeholder='Email'
            />
          </label>
        </div>
        <div className='form-group'>
          <label>
            Password:
            <br />
            <input
              className='form-control'
              id='passwordOne'
              name='passwordOne'
              type='password'
              placeholder='Password'
              autoComplete='off'
              required
            />
          </label>
        </div>
        <div className='form-group'>
          <label>
            Confirm Password:
            <br />
            <input
              className='form-control'
              name='passwordTwo'
              type='password'
              placeholder='Confirm Password'
              autoComplete='off'
              required
            />
          </label>
        </div>
        <div className='form-group'>
          <label>
            First Name:
            <br />
            <input
              className='form-control'
              required
              name='firstName'
              type='text'
              placeholder='First Name'
            />
          </label>
        </div>

        <div className='form-group'>
          <label>
            Last Name:
            <br />
            <input
              className='form-control'
              required
              name='lastName'
              type='text'
              placeholder='Last Name'
            />
          </label>
        </div>

        <div className='form-group'>
          <label>
            Country Code:
            <br />
            <input
              className='form-control'
              required
              name='countryCode'
              type='text'
              placeholder='Country Code'
            />
          </label>
        </div>

        <div className='form-group'>
          <label>
            Phone Number:
            <br />
            <input
              className='form-control'
              required
              name='phoneNumber'
              type='text'
              placeholder='Phone Number'
            />
        </label>
        </div>

        <div className='form-group'>
          <label>
            Street:
            <br />
            <input
              className='form-control'
              required
              name='street'
              type='text'
              placeholder='Street'
            />
          </label>
        </div>

        <div className='form-group'>
          <label>
            City:
            <br />
            <input
              className='form-control'
              required
              name='city'
              type='text'
              placeholder='City'
            />
          </label>
        </div>

        <div className='form-group'>
          <label>
            State:
            <br />
            <input
              className='form-control'
              required
              name='state'
              type='text'
              placeholder='State'
            />
          </label>
        </div>

        <div className='form-group'>
          <label>
            Country:
            <br />
            <input
              className='form-control'
              required
              name='country'
              type='text'
              placeholder='Country'
            />
        </label>
        </div>

        <div className='form-group'>
          <label>
            Pincode:
            <br />
            <input
              className='form-control'
              required
              name='pincode'
              type='text'
              placeholder='Pincode'
            />
          </label>
        </div>

        <div className='form-group'>
          <label>
            Date of Birth:
            <br />
            <input
              className='form-control'
              required
              name='dob'
              type='date'
              placeholder='Date of Birth'
            />
        </label>
        </div>

        <button
          className='button'
          id='submitButton'
          name='submitButton'
          type='submit'
        >
          Sign Up
        </button>
      </form>
      <br />
    </div>
  );}
  export default ParentSignUp;