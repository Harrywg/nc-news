const express = require("express");
exports.errorHandler = (err, req, res, next) => {
  res.status(500).send("Server Error");
};
