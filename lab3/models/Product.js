const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  price:       { type: Number, required: true },
  category:    { type: String, required: true },
  subCategory: { type: String, required: true },
  rating:      { type: Number, default: 4.0 },
  stock:       { type: Number, default: 10 },
  image:       { type: String, default: "/pp1.jpg" }
});

module.exports = mongoose.model("Product", productSchema);
