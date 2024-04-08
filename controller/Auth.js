const User = require("../model/User");
const crypto = require('crypto');

exports.createUser = async (req, res) => {
  try {
    const salt = crypto.rendomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      31000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        const user = new User({ ...req.body, password: hashedPassword });
        const doc = await user.save();
        res.status(201).json({ id: doc.id, role: doc.role });
      }
    );
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.loginUser = async (req, res) => {
  res.json(req.user);
};
exports.checkUser = async (req, res) => {
  res.json(req.user);
};
