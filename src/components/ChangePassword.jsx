import React, {useContext, useState} from 'react';
import {AuthContext} from '../context/AuthContext';
import {doChangePassword, doSignOut} from '../firebase/AuthFunctions';
import '../App.css';

// Importing necessary ui components from shadcn
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

// reference for alert dialogue - https://ui.shadcn.com/docs/components/alert-dialog
// reference for change password page - https://ui.shadcn.com/docs/components/card

function ChangePassword() {
  const {currentUser} = useContext(AuthContext);
  const [pwMatch, setPwMatch] = useState('');
  console.log(currentUser);

  const [alert, setAlert] = useState({ show: false, title: '', description: '' });

  // to counter the bug where the dialogue box doesn't appear after changing password
  const [postAlertAction, setPostAlertAction] = useState(null);

  const showAlert = (title, description, onSuccess) => {
    setAlert({ show: true, title, description });
    setPostAlertAction(() => onSuccess); // Setting the post-alert action
  };

  const closeAlert = async () => {
    setAlert({ show: false, title: '', description: '' });
    if (postAlertAction) {
      await postAlertAction(); // Performing this action after closing the alert
      setPostAlertAction(null); // Resetting the post-alert action
    }
  };

  const submitForm = async (event) => {
    event.preventDefault();
    const {currentPassword, newPasswordOne, newPasswordTwo} =
      event.target.elements;

    if (currentPassword.value === newPasswordOne.value) {
      showAlert("Error", "Your entered current password can't be same as your new password, please try again!")
      //setPwMatch("You Entered current password can't be same as your new password!");
      return false;
    }
    if (newPasswordOne.value !== newPasswordTwo.value) {
      showAlert("Error", "New Passwords do not match, please try again")
      //setPwMatch('New Passwords do not match, please try again');
      return false;
    }

    try {
      await doChangePassword(
        currentUser.email,
        currentPassword.value,
        newPasswordOne.value
      );
      showAlert(
        "Success",
        "Password has been changed, you will now be logged out",
        doSignOut // I am Passing the sign-out function as a post-alert action so that the user is signed out after the alert is closed
      );
    } catch (error) {
      showAlert("Error", "Invalid Credential, please try again");
    }
  };

  return (
  <div>
    <Card className="w-full max-w-md mx-auto my-4">
    <CardHeader>
      <CardTitle>Change Your Password</CardTitle>
    </CardHeader>
    <CardContent>
      {pwMatch && <h4 className='text-red-500'>{pwMatch}</h4>}
      <form onSubmit={submitForm} className="space-y-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input id="currentPassword" name='currentPassword' type='password' placeholder='Current Password' required />
        </div>

        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="newPasswordOne">New Password</Label>
          <Input id="newPasswordOne" name='newPasswordOne' type='password' placeholder='New Password' required />
        </div>

        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="newPasswordTwo">Confirm New Password</Label>
          <Input id="newPasswordTwo" name='newPasswordTwo' type='password' placeholder='Confirm New Password' required />
        </div>

        <Button type='submit' className="w-full">Change Password</Button>
      </form>
    </CardContent>
  </Card>
  {alert.show && (
    <AlertDialog open={alert.show} onOpenChange={closeAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{alert.title}</AlertDialogTitle>
          <AlertDialogDescription>{alert.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogAction onClick={closeAlert}>OK</AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  )}
  </div>
);

  

}

export default ChangePassword;