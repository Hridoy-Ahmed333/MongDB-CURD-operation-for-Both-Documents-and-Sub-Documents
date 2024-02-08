const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const productRouter = require("./routes/product"); // Import the cors package
const server = express();

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Pharma");
  console.log("Connected with database");
}
server.use(cors());
server.use(express.json());
server.use(morgan("combined"));
server.use(express.static("public"));
server.use("/products", productRouter.productRouter);

server.listen(8080, () => {
  console.log("Server started");
});
