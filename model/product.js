const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema({
  text: String,
  author: String,
  // date: Date,
});

const productSchema = new Schema({
  title: { type: String, required: true, unique: true },
  description: String,
  price: {
    type: Number,
    required: true,
    min: [0, "wrong Price"],
  },
  discountPercentage: {
    type: Number,
    min: [0, "wrong min discount"],
    max: [100, "wrong max discount"],
  },
  rating: {
    type: Number,
    min: [0, "wrong min ratting"],
    max: [5, "wrong max ratting"],
  },
  stock: Number,
  brand: { type: String, required: true },
  thumbnail: { type: String, required: true },
  comments: [commentSchema],
});

exports.Product = mongoose.model("Product", productSchema);
