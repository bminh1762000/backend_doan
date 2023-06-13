const Order = require("../models/order");

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    if (!orders) {
      const error = new Error("Could not find orders");
      error.status = 404;
      throw error;
    }
    res.status(200).json({ message: "Fetched", orders: orders });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.postOrder = async (req, res, next) => {
  const { products } = req.body;
  try {
    const order = new Order({
      products: products,
    });
    const result = await order.save();
    res.status(201).json({ message: "Order created", order: result });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  const orderId = req.params.orderId;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      const error = new Error("Order could not find.");
      error.status = 404;
      throw error;
    }
    res.status(200).json({ order: order });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.deleteOrder = async (req, res, next) => {
  const orderId = req.params.orderId;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      const error = new Error("Order could not find.");
      error.status = 404;
      throw error;
    }
    await Order.findByIdAndRemove(orderId);
    res.status(200).json({ message: "Order deleted" });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.updateStatusOrder = async (req, res, next) => {
  const orderId = req.params.orderId;
  const { status } = req.body;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      const error = new Error("Order could not find.");
      error.status = 404;
      throw error;
    }
    order.status = status;
    const result = await order.save();
    res.status(200).json({ message: "Order updated", order: result });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};
