const express = require("express");
const server = express();
const mongoose = require("mongoose");
const { createProduct } = require("./controller/Product");
const productsRouter = require("./routes/Products");
const brandsRouter = require("./routes/Brands");
const jwt = require('jsonwebtoken');
const categoriesRouter = require("./routes/Categories");
const authRouter = require("./routes/Auth");
const userRouter = require("./routes/User");
const cartRouter = require("./routes/Cart");
const orderRouter = require("./routes/Order");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./model/User");
const crypto = require("crypto");
const { isAuth, sanitizeUser } = require("./services/common");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;


const secret_key = 'secret_key'


server.use(
  session({
    secret: "keyboard cat",
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);

//JWT options
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secret_key;

server.use(passport.authenticate("session"));

//middlewares
server.use(cors());
server.use(express.json()); // to parse req.body
server.use("/products", isAuth, productsRouter.router); // we can also use jwt token
server.use("/brands", brandsRouter.router);
server.use("/categories", categoriesRouter.router);
server.use("/users", userRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart", cartRouter.router);
server.use("/orders", orderRouter.router);
// Set the headers to be exposed

//passport startagies



passport.use(
  new LocalStrategy('local',async function (username, password, done) {
    try {
      const user = await User.findOne({ email: username });
      if (!user) {
        done(null, false, { massage: "no such user exist" });
      }
      crypto.pbkdf2(
        password,
        user.salt,
        31000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done({ massage: "invailid cradantial" });
          }
          const token = jwt.sign(sanitizeUser(user), secret_key);
          done(null,token );
        }
      );
    } catch (err) {
      done(err);
    }
  })
);

passport.use('JWT',new JwtStrategy(opts, function(jwt_payload, done) {
  User.findOne({id: jwt_payload.sub}, function(err, user) {
      if (err) {
          return done(err, false);
      }
      if (user) {
          return done(null, user);
      } else {
          return done(null, false);
          // or you could create a new account
      }
  });
}));
//this creates session vaiables

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

main().catch((error) => console.log(error));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
  console.log("database connected");
}

server.post("/products", createProduct);

server.listen(8080, () => {
  console.log("app started");
});
