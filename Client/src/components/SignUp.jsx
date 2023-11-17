// import React, {useContext, useState} from 'react';
// import {Navigate} from 'react-router-dom';
// import {doCreateUserWithEmailAndPassword,createUserDocument,getNannyDocs} from '../firebase/AuthFunctions';
// import {AuthContext} from '../context/AuthContext';
// import SocialSignIn from './SocialSignIn';
// import  db  from '../main.jsx';
// function SignUp() {
//   const {currentUser} = useContext(AuthContext);
//   const [pwMatch, setPwMatch] = useState('');
//   const handleSignUpParent = async (e) => {
//     e.preventDefault();
//     const {
//       displayName,
//       email,
//       passwordOne,
//       passwordTwo,
//       firstName,
//       lastName,
//       countryCode,
//       phoneNumber,
//       street,
//       city,
//       state,
//       country,
//       pincode,
//       dob,
//     } = e.target.elements;
  
//     if (passwordOne.value !== passwordTwo.value) {
//       setPwMatch('Passwords do not match');
//       return false;
//     }
  
//     try {
//       // Create user in Firebase Authentication
//       let createdUid = await doCreateUserWithEmailAndPassword(
//         email.value,
//         passwordOne.value,
//         displayName.value
//       );
//       console.log("created uid",createdUid)
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       //todo need to hash password
//         // if(!currentUser) throw "no usercreds to do crud"
//         await getNannyDocs()
//       let dataToStore = {
//         firstName: firstName.value,
//         lastName: lastName.value,
//         emailAddress: email.value,
//         countryCode: countryCode.value,
//         phoneNumber: phoneNumber.value,
//         street: street.value,
//         city: city.value,
//         state: state.value,
//         country: country.value,
//         pincode: pincode.value,
//         dob: dob.value,
//         role: 'parent',
//         password: passwordOne.value,
//         listings: [],
//         wallet: 0,
//       }
//       console.log("From signup component data:",dataToStore);
//       // Create document in Firestore
//       await createUserDocument(createdUid, dataToStore);
//     } catch (error) {
//       console.log(error)
//       alert(error);
//     }
//   };
//   const handleSignUpNanny = async (e)=>{
//     e.preventDefault();
//   const {
//     displayName,
//     email,
//     passwordOne,
//     passwordTwo,
//     firstName,
//     lastName,
//     countryCode,
//     phoneNumber,
//     street,
//     city,
//     state,
//     country,
//     pincode,
//     dob,
//     ssn,
//     experience,
//     bio,
//   } = e.target.elements;

//   if (passwordOne.value !== passwordTwo.value) {
//     setPwMatch('Passwords do not match');
//     return false;
//   }

//   try {
//     // Create user in Firebase Authentication
//     let createdUid = await doCreateUserWithEmailAndPassword(
//       email.value,
//       passwordOne.value,
//       displayName.value
//     );
//     console.log("created uid", createdUid);
    
//     // Add a delay to simulate asynchronous operations
//     await new Promise((resolve) => setTimeout(resolve, 1000));

//     // Create data object for storing in Firestore
//     let dataToStore = {
//       firstName: firstName.value,
//       lastName: lastName.value,
//       emailAddress: email.value,
//       countryCode: countryCode.value,
//       phoneNumber: phoneNumber.value,
//       street: street.value,
//       city: city.value,
//       state: state.value,
//       country: country.value,
//       pincode: pincode.value,
//       dob: dob.value,
//       role: 'nanny',
//       experience: experience.value,
//       bio: bio.value,
//       ssn: ssn.value,
//       verified: false,
//       password: passwordOne.value,
//       documents: [],
//       approvedListings:[],
//       wallet:0,
//     };

//     console.log("From signup component data:", dataToStore);

//     // Create document in Firestore
//     await createNannyDocument(createdUid, dataToStore);
//   } catch (error) {
//     console.log(error);
//     alert(error);
//   }
//   }
  

//   if (currentUser) {
//     return <Navigate to='/home' />;
//   }

//   return (
//     <div className='card'>
//       <h1>Sign up as a parent</h1>
//       {pwMatch && <h4 className='error'>{pwMatch}</h4>}
//       <form onSubmit={handleSignUpParent}>
//         <div className='form-group'>
//           <label>
//             Name:
//             <br />
//             <input
//               className='form-control'
//               required
//               name='displayName'
//               type='text'
//               placeholder='Name'
//               autoFocus={true}
//             />
//           </label>
//         </div>
//         <div className='form-group'>
//           <label>
//             Email:
//             <br />
//             <input
//               className='form-control'
//               required
//               name='email'
//               type='email'
//               placeholder='Email'
//             />
//           </label>
//         </div>
//         <div className='form-group'>
//           <label>
//             Password:
//             <br />
//             <input
//               className='form-control'
//               id='passwordOne'
//               name='passwordOne'
//               type='password'
//               placeholder='Password'
//               autoComplete='off'
//               required
//             />
//           </label>
//         </div>
//         <div className='form-group'>
//           <label>
//             Confirm Password:
//             <br />
//             <input
//               className='form-control'
//               name='passwordTwo'
//               type='password'
//               placeholder='Confirm Password'
//               autoComplete='off'
//               required
//             />
//           </label>
//         </div>
//         <div className='form-group'>
//           <label>
//             First Name:
//             <br />
//             <input
//               className='form-control'
//               required
//               name='firstName'
//               type='text'
//               placeholder='First Name'
//             />
//           </label>
//         </div>

//         <div className='form-group'>
//           <label>
//             Last Name:
//             <br />
//             <input
//               className='form-control'
//               required
//               name='lastName'
//               type='text'
//               placeholder='Last Name'
//             />
//           </label>
//         </div>

//         <div className='form-group'>
//           <label>
//             Country Code:
//             <br />
//             <input
//               className='form-control'
//               required
//               name='countryCode'
//               type='text'
//               placeholder='Country Code'
//             />
//           </label>
//         </div>

//         <div className='form-group'>
//           <label>
//             Phone Number:
//             <br />
//             <input
//               className='form-control'
//               required
//               name='phoneNumber'
//               type='text'
//               placeholder='Phone Number'
//             />
//         </label>
//         </div>

//         <div className='form-group'>
//           <label>
//             Street:
//             <br />
//             <input
//               className='form-control'
//               required
//               name='street'
//               type='text'
//               placeholder='Street'
//             />
//           </label>
//         </div>

//         <div className='form-group'>
//           <label>
//             City:
//             <br />
//             <input
//               className='form-control'
//               required
//               name='city'
//               type='text'
//               placeholder='City'
//             />
//           </label>
//         </div>

//         <div className='form-group'>
//           <label>
//             State:
//             <br />
//             <input
//               className='form-control'
//               required
//               name='state'
//               type='text'
//               placeholder='State'
//             />
//           </label>
//         </div>

//         <div className='form-group'>
//           <label>
//             Country:
//             <br />
//             <input
//               className='form-control'
//               required
//               name='country'
//               type='text'
//               placeholder='Country'
//             />
//         </label>
//         </div>

//         <div className='form-group'>
//           <label>
//             Pincode:
//             <br />
//             <input
//               className='form-control'
//               required
//               name='pincode'
//               type='text'
//               placeholder='Pincode'
//             />
//           </label>
//         </div>

//         <div className='form-group'>
//           <label>
//             Date of Birth:
//             <br />
//             <input
//               className='form-control'
//               required
//               name='dob'
//               type='date'
//               placeholder='Date of Birth'
//             />
//         </label>
//         </div>

//         <button
//           className='button'
//           id='submitButton'
//           name='submitButton'
//           type='submit'
//         >
//           Sign Up
//         </button>
//       </form>
//       <br />
//     </div>
//   );
//   //nanny signup return
//   return (
//     <div className='card'>
//       <h1>Sign up as a nanny</h1>
//       {/* Add any validation messages here */}
//       <form onSubmit={handleSignUpNanny}>
//         <div className='form-group'>
//           <label>
//             Name:
//             <br />
//             <input
//               className='form-control'
//               required
//               name='displayName'
//               type='text'
//               placeholder='Name'
//               autoFocus={true}
//             />
//           </label>
//         </div>
//         <div className='form-group'>
//           <label>
//             Email:
//             <br />
//             <input
//               className='form-control'
//               required
//               name='email'
//               type='email'
//               placeholder='Email'
//             />
//           </label>
//         </div>
//         <div className='form-group'>
//           <label>
//             Password:
//             <br />
//             <input
//               className='form-control'
//               id='passwordOne'
//               name='passwordOne'
//               type='password'
//               placeholder='Password'
//               autoComplete='off'
//               required
//             />
//           </label>
//         </div>
//         <div className='form-group'>
//           <label>
//             Confirm Password:
//             <br />
//             <input
//               className='form-control'
//               name='passwordTwo'
//               type='password'
//               placeholder='Confirm Password'
//               autoComplete='off'
//               required
//             />
//           </label>
//         </div>
//         <div className='form-group'>
//           <label>
//             First Name:
//             <br />
//             <input
//               className='form-control'
//               required
//               name='firstName'
//               type='text'
//               placeholder='First Name'
//             />
//           </label>
//         </div>

//         <div className='form-group'>
//           <label>
//             Last Name:
//             <br />
//             <input
//               className='form-control'
//               required
//               name='lastName'
//               type='text'
//               placeholder='Last Name'
//             />
//           </label>
//         </div>

//         <div className='form-group'>
//           <label>
//             Country Code:
//             <br />
//             <input
//               className='form-control'
//               required
//               name='countryCode'
//               type='text'
//               placeholder='Country Code'
//             />
//           </label>
//         </div>

//         <div className='form-group'>
//           <label>
//             Phone Number:
//             <br />
//             <input
//               className='form-control'
//               required
//               name='phoneNumber'
//               type='text'
//               placeholder='Phone Number'
//             />
//         </label>
//         </div>

//         <div className='form-group'>
//           <label>
//             Street:
//             <br />
//             <input
//               className='form-control'
//               required
//               name='street'
//               type='text'
//               placeholder='Street'
//             />
//           </label>
//         </div>

//         <div className='form-group'>
//           <label>
//             City:
//             <br />
//             <input
//               className='form-control'
//               required
//               name='city'
//               type='text'
//               placeholder='City'
//             />
//           </label>
//         </div>

//         <div className='form-group'>
//           <label>
//             State:
//             <br />
//             <input
//               className='form-control'
//               required
//               name='state'
//               type='text'
//               placeholder='State'
//             />
//           </label>
//         </div>

//         <div className='form-group'>
//           <label>
//             Country:
//             <br />
//             <input
//               className='form-control'
//               required
//               name='country'
//               type='text'
//               placeholder='Country'
//             />
//         </label>
//         </div>

//         <div className='form-group'>
//           <label>
//             Pincode:
//             <br />
//             <input
//               className='form-control'
//               required
//               name='pincode'
//               type='text'
//               placeholder='Pincode'
//             />
//           </label>
//         </div>

//         <div className='form-group'>
//           <label>
//             Date of Birth:
//             <br />
//             <input
//               className='form-control'
//               required
//               name='dob'
//               type='date'
//               placeholder='Date of Birth'
//             />
//         </label>
//         </div>
//         <div className='form-group'>
//           <label>
//             Experience:
//             <br />
//             <input
//               className='form-control'
//               required
//               name='experience'
//               type='number'
//               placeholder='Experience (in years)'
//               value={formData.experience}
//               onChange={handleChange}
//             />
//           </label>
//         </div>

//         <div className='form-group'>
//           <label>
//             SSN:
//             <br />
//             <input
//               className='form-control'
//               required
//               name='ssn'
//               type='text'
//               placeholder='SSN'
//             />
//           </label>
//         </div>
  
//         <div className='form-group'>
//           <label>
//             Bio:
//             <br />
//             <textarea
//               className='form-control'
//               required
//               name='bio'
//               placeholder='Tell us about yourself'
//               value={formData.bio}
//               onChange={handleChange}
//             />
//           </label>
//         </div>
  
//         <button className='button' type='submit'>
//           Sign Up
//         </button>
//         <button
//           className='button'
//           id='submitButton'
//           name='submitButton'
//           type='submit'
//         >
//           Sign Up
//         </button>
//       </form>
//       <br />
//     </div>
//   );
// }

// export default SignUp;

import React, { useState } from 'react';
import ParentSignUp from './ParentSignUp'; // Import your ParentSignUp component
import NannySignUp from './NannySignUp'; // Import your NannySignUp component
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
const SignUp = () => {
  const [alignment, setAlignment] = useState('parent');

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <div>
    <ToggleButtonGroup
      color="primary"
      value={alignment}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
    >
      <ToggleButton value="parent">Parent Sign Up </ToggleButton>
      <ToggleButton value="nanny">Nanny Sign Up</ToggleButton>
    </ToggleButtonGroup>
    {alignment === 'parent' ? (
      <ParentSignUp />
    ) : (
      <NannySignUp />
    )}
    </div>
  );
  //----------------------
  // const [selectedRole, setSelectedRole] = useState('parent');

  // const handleRoleChange = (role) => {
  //   setSelectedRole(role);
  // };

  // return (
  //   <div>
  //     <div>
  //       <button
  //         onClick={() => handleRoleChange('parent')}
  //         style={{ marginRight: '10px' }}
  //       >
  //         Sign Up as Parent
  //       </button>
  //       <button onClick={() => handleRoleChange('nanny')}>
  //         Sign Up as Nanny
  //       </button>
  //     </div>

  //     {selectedRole === 'parent' ? (
  //       <ParentSignUp />
  //     ) : (
  //       <NannySignUp />
  //     )}
  //   </div>
  // );
};

export default SignUp;

