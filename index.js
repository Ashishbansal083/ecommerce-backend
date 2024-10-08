const express = require("express");
const server = express();
const mongoose = require("mongoose");
const { createProduct } = require("./controller/Product");
const productsRouter = require("./routes/Products");
const brandsRouter = require("./routes/Brands");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
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
const { isAuth, sanitizeUser, cookieExtractor } = require("./services/common");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const path = require("path");


const secret_key = "secret_key";
server.use(express.static('build'))
server.use(cookieParser());
server.use(
  session({
    secret: "keyboard cat",
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);

//JWT options
var opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = secret_key;

server.use(passport.authenticate("session"));

//middlewares
server.use(express.static(path.resolve(__dirname, 'build')));
server.use(cors());
server.use(express.json()); // to parse req.body
server.use("/products", isAuth(), productsRouter.router); // we can also use jwt token
server.use("/brands",isAuth(), brandsRouter.router);
server.use("/categories",isAuth(), categoriesRouter.router);
server.use("/users",isAuth(), userRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart",isAuth(), cartRouter.router);
server.use("/orders",isAuth(), orderRouter.router);
// Set the headers to be exposed



server.get("*", (req, res) => {
  res.sendFile(path.resolve("build", "index.html"));
});

//passport startagies

passport.use(
  'local',
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    try {
      const user = await User.findOne({ email: email });
      console.log(email, password, user);
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
            return done(null, false,{ message: "invailid cradantial" });
          }
          const token = jwt.sign(sanitizeUser(user), secret_key);
          done(null, { id: user.id, role: user.role, token });
        }
      );
    } catch (err) {
      done(err);
    }
  })
);

passport.use(
  'jwt',
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findById(jwt_payload.id );
      if (user) {
        return done(null, sanitizeUser(user));
      } else {
        return done(null, false);
        // or you could create a new account
      }
    } catch (err) {
      return done(err, false);
    }
  })
);
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
  await mongoose.connect("mongodb+srv://bansalgashi083:jmhHcJomhQuW5Cyk@cluster0.ikek9mt.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0");
  // await mongoose.connect("mongodb://localhost:27017/ecommerce")

  // console.log("database connected(jmhHcJomhQuW5Cyk)mongodb+srv://bansalgashi083:jmhHcJomhQuW5Cyk@cluster0.ikek9mt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
}

server.post("/products", createProduct);

server.listen(8080, () => {
  console.log("app started");
});
