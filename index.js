const express = require("express");
const server = express();
const mongoose = require("mongoose");
const { createProduct } = require("./controller/Product");
const productsRouter = require("./routes/Products");
const brandsRouter = require('./routes/Brands')
const categoriesRouter = require('./routes/Categories')

//middlewares
server.use(express.json()); // to parse req.body
server.use('/products',productsRouter.router);
server.use('/brands',brandsRouter.router);
server.use('/categories',categoriesRouter.router);

main().catch((error) => console.log(error));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
  console.log("database connected");
}

server.get("/", (req, res) => {
  res.json({ status: "runnig" });
});
server.post("/products", createProduct); 

server.listen(8080, () => {
  console.log("app started");
});
