export default (e) => {
  const errorsData = {};
  e.errors.forEach((error) => {
    const { path, message } = error;
    if (!errorsData[path]) {
      errorsData[path] = [];
    }
    errorsData[path].push(message);
  });

  Object.keys(errorsData).forEach((key) => {
    errorsData[key] = errorsData[key].join(', ');
  });

  return errorsData;
};
