const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/admin");
const Contact = require("../models/contact");

router.post("/signup", (req, res, next) => {
  Admin.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          Message: "Email exist",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              Error: err,
            });
          } else {
            const admin = new Admin({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              lastName: req.body.lastName,
              firstName: req.body.firstName,
              phoneNo: req.body.phoneNo,
              password: hash,
            });
            admin
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  Message: "User created",
                  hash: hash,
                });
              })
              .catch((err) => {
                res.status(500).json({
                  Error: err,
                });
                console.log(err);
              });
          }
        });
      }
    });
});

router.post("/login", (req, res, next) => {
  Admin.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          Message: "Authentication Failed",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            Message: "Auth Failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            "Secret",
            {
              expiresIn: "1h",
            }
          );
          console.log(token);
          return res.status(201).json({
            Message: "auth Successful",
            token: token,
          });
        }
        res.status(401).json({
          Message: "Auth Failed",
        });
      });
    })
    .catch((err) => {
      return res.status(500).json({
        Error: err,
      });
    });
});

router.post("/contact", (req, res, next) => {
  Contact.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 0) {
        console.log(user.length);
        const contact = new Contact({
          _id: new mongoose.Types.ObjectId(),
          email: req.body.email,
          name: req.body.name,
          message: req.body.message,
        });
        contact
          .save()
          .then((result) => {
            console.log(result);
            res.status(201).json({
              Message: "Sent",
            });
          })
          .catch((err) => {
            res.status(500).json({
              Error: err,
            });
            console.log(err);
          });
      }
    });
});

// router.get("/", (req, res, next) => {
//   res.status(200).json({
//     message: "Successful",
//   });
// });

module.exports = router;
