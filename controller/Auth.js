const User = require("../model/User");

exports.createUser = async (req, res) => {
  const user = new User(req.body);
  try {
    const doc = await user.save();
    res.status(201).json({id:doc.id,role:doc.role});
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.loginUser = async (req,res) => {
  res.json({status:'success'})
};
