const express = require("express");
const productController = require("../controlller/product");
const productRouter = express.Router();
productRouter
  .post("/", productController.createProduct)
  .post("/:id/comments", productController.addComment)
  .get("/", productController.getAllProduct)
  .get("/:id", productController.GetOneProduct)
  .get("/:id/comments/:commentId", productController.getComment)
  .get("/:id/comments", productController.getOneComment)
  .put("/:id", productController.replaceProduct)
  .put("/:id/comments/:commentId", productController.putComment)
  .patch("/:id", productController.updateProduct)
  .patch("/:id/comments/:commentId", productController.updateComment)
  .delete("/:id", productController.deleteProduct)
  .delete("/:id/comments/:commentId", productController.deleteComment);

exports.productRouter = productRouter;
