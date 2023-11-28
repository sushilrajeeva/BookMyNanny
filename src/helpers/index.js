import moment from "moment";

const validateDate = (date) => {
  const momentDate = moment(date);
  if (!momentDate.isValid()) return false;
  const minDate = moment().subtract(100, "y");
  const maxDate = moment().subtract(13, "y");
  const isBtwn = momentDate.isBetween(minDate, maxDate);
  if (!isBtwn) return false;
  return true;
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

export { validateDate, passwordMatch, validateJobDate };
