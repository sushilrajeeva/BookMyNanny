import moment from "moment";

const validateDate = (date, minDate, maxDate) => {
  const parsedDate = moment(date, "MM-DD-YYYY", true);

  console.log("Min", minDate);
  console.log("Max", maxDate);
  if (!parsedDate.isValid()) {
    console.error("Invalid date format");
    // Handle the error or return false, depending on your use case
  } else {
    // Set the time part to the current time
    parsedDate.set({
      hour: moment().hour(),
      minute: moment().minute(),
      second: moment().second(),
    });

    console.log(parsedDate.format("YYYY-MM-DD HH:mm:ss"));
  }
  const isBtwn = parsedDate.isBetween(minDate, maxDate);
  if (isBtwn) return true;
  return false;
};

const validateJobDate = (date) => {
  const momentDate = moment(date);
  if (!momentDate.isValid()) return false;
  const minDate = moment();
  const maxDate = moment().add(1, "year");
  console.log("Min", minDate);
  console.log("Current", momentDate);
  console.log("Max", maxDate);
  const isBtwn = momentDate.isBetween(minDate, maxDate);
  if (!isBtwn) return false;
  return true;
};

const passwordMatch = (password1, password2) => {
  if (password1 !== password2) return false;
  return true;
};

const checkNumber = (num, varName) => {
  if (num === undefined || num === null) {
    throw `Error: You must supply a ${varName}!`;
  }
  if (typeof num !== "number") {
    throw `Error: ${varName} must be a number!`;
  }
  if (num < 0) throw `Error: ${varName} must be a positive number!`;
  return num;
};

export { validateDate, passwordMatch, validateJobDate, checkNumber };
