const express = require("express");

const orderController = require("../controllers/order");
const { isAuth } = require("../middleware/is-auth");

const router = express.Router();

router.get("/", isAuth, orderController.getOrders);

router.post("/", isAuth, orderController.postOrder);

router.get("/all-orders", isAuth, orderController.getAllOrders);

router.get("/:orderId", isAuth, orderController.getOrder);

router.delete("/:orderId", isAuth, orderController.deleteOrder);

module.exports = router;
