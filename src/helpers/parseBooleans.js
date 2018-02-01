// in objects received from sql boolean values are in string form
// this function will convert them

const toBool = string => string.toLowerCase() === 'true';

const parseBooleans = (data, boolFields = []) => {
  const parsedData = Object.assign({}, data);
  Object.keys(data).forEach((key) => {
    if (boolFields.includes(key)) {
      parsedData[key] = toBool(data[key]);
    }
  });
  return parsedData;
};

export default parseBooleans;
