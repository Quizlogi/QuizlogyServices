const JSONParse = (str) => {
  try {
    return JSON.parse(str);
  } catch (err) {
    return null;
  }
};

module.exports = {
  JSONParse,
};
