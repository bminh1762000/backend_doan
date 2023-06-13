const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    default: false,
    type: Boolean,
  },
  cart: {
    items: [
      {
        product: {
          type: Object,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (addProduct) {
  const existingProd = this.cart.items.findIndex(
    (cp) => cp.product._id.toString() === addProduct._id.toString()
  );
  let updatedItems = [...this.cart.items];
  let newQuantity = 1;
  if (existingProd < 0) {
    updatedItems.push({
      product: addProduct,
      quantity: 1,
    });
  } else {
    newQuantity = this.cart.items[existingProd].quantity + 1;
    updatedItems[existingProd].quantity = newQuantity;
  }
  let newCart = {
    items: updatedItems,
  };

  this.cart = newCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (addProduct) {
  const existingProd = this.cart.items.findIndex(
    (cp) => cp.product._id.toString() === addProduct._id.toString()
  );
  let updatedItems = [...this.cart.items];
  if (existingProd < 0) {
    const error = new Error("Product could not found");
    error.statusCode = 404;
    throw error;
  }
  if (updatedItems[existingProd].quantity === 1) {
    updatedItems = updatedItems.filter(
      (cp) => cp.product._id.toString() !== addProduct._id.toString()
    );
  } else {
    let newQuantity = this.cart.items[existingProd].quantity - 1;
    updatedItems[existingProd].quantity = newQuantity;
  }
  let updatedCart = {
    items: updatedItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.clearFromCart = function (addProduct) {
  const existingProd = this.cart.items.findIndex(
    (cp) => cp.product._id.toString() === addProduct._id.toString()
  );
  let updatedItems = [...this.cart.items];
  if (existingProd < 0) {
    const error = new Error("Product could not found");
    error.statusCode = 404;
    throw error;
  } else {
    updatedItems = updatedItems.filter(
      (cp) => cp.product._id.toString() !== addProduct._id.toString()
    );
  }
  let updatedCart = {
    items: updatedItems,
  };
  this.cart = updatedCart;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
