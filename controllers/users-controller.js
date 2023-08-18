const { selectUsers, selectUsersByUsername } = require("../models/users-model");

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => next(err));
};

exports.getUsersByUsername = (req, res, next) => {
  selectUsersByUsername(req.params)
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => next(err));
};
