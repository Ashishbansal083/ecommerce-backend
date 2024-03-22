const User = require("../model/User");

exports.createUser = async (req, res) => {
  const user = new User(req.body);
  try {
    const doc = await user.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.loginUser = async (req,res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(401).json({ massage: "no such user exist" });
    } else if (user.password === req.body.password) {
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        addresses: user.addresses,
      });
    } 
    else  {
      res.status(401).json({massage: "invailid cradantial"
        });
    } 
  } catch (err) {
    res.status(400).json(err);
  }
};
