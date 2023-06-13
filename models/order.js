const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Product",
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  info: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
  },
  status: {
    type: String,
    default: "Pending",
  },
});

orderSchema.methods.deleteOrder = function () {
  return this.deleteOne();
};

orderSchema.methods.updateStatus = function (newStatus) {
  this.status = newStatus;
  return this.save();
};

orderSchema.methods.createOrder = function (createOrder) {
  this.products = createOrder.products;
  this.user = createOrder.user;
  this.status = createOrder.status;
  this.info = createOrder.info;
  return this.save();
};

module.exports = mongoose.model("Order", orderSchema);
