function joiErrorsToObject(joiErrors) {
  const errors = joiErrors.details
    .map((item) => ({
      [item.context.key]: item.message.replaceAll("\"", ""),
    }))
    .reduce((acc, curr) => {
      return (acc = { ...acc, ...curr });
    }, {});

  return errors;
}

module.exports = { joiErrorsToObject };
