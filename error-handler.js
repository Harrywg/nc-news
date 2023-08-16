const express = require("express");
exports.errorHandler = (err, req, res, next) => {
  //custom errs
  if (err.custom) {
    res.status(err.code).send({ msg: err.msg });
  }

  //node pg errs
  switch (err.code) {
    case "22P02":
      res.status(400).send({ msg: "Bad Request" });
      break;
  }
  res.status(500).send({ msg: "Server Error" });
};
