const _ = require("lodash");

const cleanReqData = (data, whitelist = null) => {
  // Remove undefined, null, and empty string values
  let cleaned = _.omitBy(data, (value) => {
    return value === undefined || value === null || value === "";
  });

  // Trim string values
  cleaned = _.mapValues(cleaned, (value) => {
    return typeof value === "string" ? value.trim() : value;
  });

  // If whitelist provided, keep only those fields
  if (whitelist && Array.isArray(whitelist)) {
    cleaned = _.pick(cleaned, whitelist);
  }

  return cleaned;
};

module.exports = cleanReqData;
