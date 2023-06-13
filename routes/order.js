const express = require("express");

const orderController = require("../controllers/order");

const router = express.Router();

router.get("/", orderController.getOrders);

router.post("/", orderController.postOrder);

router.get("/:orderId", orderController.getOrder);

router.delete("/:orderId", orderController.deleteOrder);

module.exports = router;
