import moment from "moment";

const validateDate = (date, minDate, maxDate) => {
  let parsedDate = moment(date, "MM-DD-YYYY", true);
  parsedDate.set({
    hour: moment().hour(),
    minute: moment().minute(),
    second: moment().second(),
  });
  const isBtwn = parsedDate.isBetween(minDate, maxDate, null, "[]");
  if (isBtwn) return true;
  return false;
};

const validateJobDate = (date) => {
  const momentDate = moment(date);
  if (!momentDate.isValid()) return false;
  const minDate = moment();
  const maxDate = moment().add(1, "year");

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
  if (num <= 0) throw `Error: ${varName} must be a positive non zero number!`;
  return num;
};

function capitalize(inputString) {
  const words = inputString.split(" ");
  const capitalizedWords = words.map((word) => {
    if (!isNaN(word)) {
      return word;
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  const resultString = capitalizedWords.join(" ");
  return resultString;
}

export {
  validateDate,
  passwordMatch,
  validateJobDate,
  checkNumber,
  capitalize,
};
