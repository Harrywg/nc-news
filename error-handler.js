const express = require("express");
exports.errorHandler = (err, req, res, next) => {
  console.log(err);
  //custom errs
  if (err.custom) {
    res.status(err.code).send({ msg: err.msg });
  }

  //node pg errs
  switch (err.code) {
    case "22P02":
    case "23502":
    case "42703":
      res.status(400).send({ msg: "Bad Request" });
      break;
    default:
      res.status(500).send({ msg: "Server Error" });
  }
};
