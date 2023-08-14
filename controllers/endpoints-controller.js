const { selectEndpoints } = require("../models/endpoints-model");

exports.getEndpoints = (req, res, next) => {
  const endpoints = selectEndpoints();
  res.status(200).send({ endpoints });
};
