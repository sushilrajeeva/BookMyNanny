import React, { createContext, useContext, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "info",
    message: "",
  });

  const showAlert = (type, message) => {
    setSnackbar({ open: true, type, message });
  };

  const hideAlert = () => {
    setSnackbar({ open: false, type: "info", message: "" });
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={hideAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        style={{ marginTop: "100px" }}
      >
        <MuiAlert severity={snackbar.type || "info"} onClose={hideAlert}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </AlertContext.Provider>
  );
};
