const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Members = require("../models/members");
const checkauth = require("../middleware/checkauth");

router.post("/", (req, res) => {
  Members.find({ email: req.body.email })
    .exec()
    .then((member) => {
      if (member.length >= 1) {
        return res.status(409).json({
          Message: "Email Exists",
        });
      } else {
        const member = new Members({
          _id: new mongoose.Types.ObjectId(),
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          gender: req.body.gender,
          bio: req.body.bio,
          phoneNo: req.body.phoneNo,
        });
        member.save().then((result) => {
          res.status(200).json({
            Message: "Member Created",
            details: member,
          });
        });
      }
    });
});

router.get("/", checkauth, (req, res, next) => {
  Members.find()
    .select("_id firstName lastName email phoneNo bio ")
    .exec()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
