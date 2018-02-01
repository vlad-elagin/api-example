// function used to build sql query from JS object
const buildQuery = (data, availableFields = []) => {
  let query = '';
  Object.keys(data).forEach((field) => {
    if (!availableFields.includes(field)) return;
    if (query !== '') query += ', ';
    const value = data[field];
    query += `${field}="${value}"`;
  });
  return query;
};

export default buildQuery;
