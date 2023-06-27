const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  ship: {
    type: Boolean,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
});

productSchema.methods.updateProduct = function (updateProduct) {
  this.title = updateProduct.title;
  this.imageUrl = updateProduct.imageUrl;
  this.price = updateProduct.price;
  this.category = updateProduct.category;
  this.ship = updateProduct.ship;
  return this.save();
};

productSchema.methods.createProduct = function (createProduct) {
  this.title = createProduct.title;
  this.imageUrl = createProduct.imageUrl;
  this.price = createProduct.price;
  this.category = createProduct.category;
  this.ship = createProduct.ship;
  return this.save();
};

productSchema.methods.removeProducts = function (ids) {
  this.deleteMany({
    _id: {
      $in: ids,
    },
  });
};

module.exports = mongoose.model("Product", productSchema);
