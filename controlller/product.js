const fs = require("fs");
const mongoose = require("mongoose");
const model = require("../model/product");

const Product = model.Product;

//Adding one Document
exports.createProduct = async (req, res) => {
  const product = new Product(req.body);
  try {
    const output = await product.save();
    console.log(output);
    res.status(201).json(output);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};
//Adding Sub Document
exports.addComment = async (req, res) => {
  const productId = req.params.id;
  const newComment = {
    text: req.body.text, // Assuming 'text' is the property you want to save in the comment
    author: req.body.author, // Assuming 'author' is another property you want to save
    // date: new Date(), // Uncomment this line if you want to include a timestamp
  };

  try {
    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    // Add the new comment to the product's comments array
    product.comments.push(newComment);

    // Save the updated product document
    const updatedProduct = await product.save();

    // Respond with the updated product document
    res.status(201).json(updatedProduct);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

//Getting all the documents
exports.getAllProduct = async (req, res) => {
  try {
    const products = await Product.find();

    // const products = await Product.find().select("comments");
    // const commentsArray = products.map((product) => product.comments);
    // const comments = [].concat(...commentsArray);

    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

//Getting one Document
exports.GetOneProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const products = await Product.findById(id);
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

//Getting one Sub-document of a document
exports.getOneComment = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findById(id).select("comments");
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

//Getting all the sub-document of a document
exports.getComment = async (req, res) => {
  console.log("Getting comments");
  try {
    const productId = req.params.id;
    const commentId = req.params.commentId;

    // Find the product by ID
    const product = await Product.findById(productId);
    console.log("Products are:", product);

    // If product is not found, send a  404 response
    if (!product) {
      console.log("Procuct cannot be fond");
      res.status(404).json({ message: "Product not found" });
      return;
    }

    // Find the comment by ID within the product's comments array
    const comment = product.comments.id(commentId);
    console.log(comment);

    // If comment is not found, send a  404 response
    if (!comment) {
      console.log("Comment cannot be found");
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    // Send the comment as a JSON response
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
};

//Put Operation on document
exports.replaceProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findOneAndReplace({ _id: id }, req.body, {
      new: true,
    });
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

//PUT operation on Sub-document
exports.putComment = async (req, res) => {
  const productId = req.params.id;
  const commentId = req.params.commentId;
  const updateData = { ...req.body, _id: commentId };

  try {
    const product = await Product.findOneAndUpdate(
      { _id: productId, "comments._id": commentId }, // Find the product and the specific comment
      { $set: { "comments.$": updateData } }, // Update the matched comment
      { new: true } // Return the updated document
    );

    if (!product) {
      return res.status(404).send({ message: "Product or Comment not found." });
    }

    res.send(product);
  } catch (error) {
    console.log("An erorr occured");
    res
      .status(500)
      .send({ message: error.message || "Error updating comment." });
  }
};

//Update operation on document
exports.updateProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

//Update Operation on sub-document
exports.updateComment = async (req, res) => {
  const productId = req.params.id;
  const commentId = req.params.commentId;
  const update = req.body;

  try {
    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    // Find the comment to update
    const comment = product.comments.id(commentId);
    console.log("The comment is:", comment);
    if (!comment) {
      return res.status(404).send({ message: "Comment not found" });
    }

    // Apply the updates to the comment
    Object.assign(comment, update);

    // Save the product with the updated comment
    await product.save();

    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

//Deleting Document
exports.deleteProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findOneAndDelete({ _id: id });
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

//Deleting Sub document
exports.deleteComment = async (req, res) => {
  const productId = req.params.id;
  const commentId = req.params.commentId;

  try {
    const product = await Product.findOneAndUpdate(
      { _id: productId }, // Find the product by its ID
      { $pull: { comments: { _id: commentId } } }, // Remove the comment with the given ID
      { new: true } // Option to return the updated document
    );

    if (!product) {
      return res.status(404).send({ message: "Product not found." });
    }

    res.send(product);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || "Error deleting comment." });
  }
};

//Sub document or array methode example

/*
const Product = mongoose.model("Product", productSchema);
let product = await Product.findById(someProductId);

// $pop() - Removes the first or last element from an array
product.comments.$pop(); // Removes the last comment
product.comments.$pop(-1); // Removes the last comment
product.comments.$pop(1); // Removes the first comment

// $shift() - Removes the first element from an array
product.comments.$shift(); // Removes the first comment

// addToSet() - Adds a value to an array unless the value is already present
product.comments.addToSet({ text: 'New comment', author: 'New Author' });

// includes() - Checks if an array contains a certain value
const hasComment = product.comments.includes({ text: 'New comment', author: 'New Author' });

// indexOf() - Finds the index of the first occurrence of a specified value in an array
const commentIndex = product.comments.indexOf({ text: 'New comment', author: 'New Author' });

// nonAtomicPush() - Pushes an item onto an array without saving the document
product.comments.nonAtomicPush({ text: 'Another comment', author: 'Another Author' });

// pop() - Removes the last element from an array and returns that element
const lastComment = product.comments.pop();

// pull() - Removes all instances of a value from an array
product.comments.pull({ text: 'Specific comment to remove', author: 'Author of the comment' });

// push() - Appends an item to an array and returns the new length of the array
product.comments.push({ text: 'Yet another comment', author: 'Yet Another Author' });

// remove() - Alias for pull(). Removes all instances of a value from an array
product.comments.remove({ text: 'Remove all comments by this author', author: 'Author to remove' });

// set() - Replaces the contents of an array with a new array or value
product.comments.set([{ text: 'Only this comment should remain', author: 'Author of the remaining comment' }]);

// shift() - Removes the first element from an array and returns that removed element
const firstComment = product.comments.shift();

// sort() - Sorts the elements of an array in place and returns the array
product.comments.sort((a, b) => a.text.localeCompare(b.text));

// splice() - Changes the content of an array by removing or replacing existing elements and/or adding new elements in place
product.comments.splice(1,  1, { text: 'Replaced comment', author: 'Author of the replaced comment' });

// toObject() - Converts the MongooseArray to a plain JavaScript array
const commentsObject = product.comments.toObject();

// unshift() - Adds one or more elements to the beginning of an array and returns the new length of the array
product.comments.unshift({ text: 'First comment now', author: 'Author of the first comment' });

// After performing operations, remember to save the document to persist changes to the database
await product.save();

//Updating a field in the comment

const updatedFieldData = { text: 'Updated comment text' }; // The fields you want to update
// Use the $set operator to update the specific fields of the comment with the given ID
await Product.updateOne(
  { '_id': product._id, 'comments._id': commentIdToUpdate },
  { '$set': { 'comments.$.text': updatedFieldData.text } }
);

*/
