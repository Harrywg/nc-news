const express = require("express");
exports.errorHandler = (err, req, res, next) => {
  if (err.custom) {
    res.status(err.code).send({ msg: err.msg });
  } else console.log(err);
  res.status(500).send({ msg: "Server Error" });
};
