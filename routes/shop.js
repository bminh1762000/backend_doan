const express = require("express");

const router = express.Router();

const { isAuth } = require("../middleware/is-auth");
const shopController = require("../controllers/shop");

router.get("/cart", isAuth, shopController.getCarts);

router.post("/collection/add", isAuth, shopController.addItemToCart);

router.post("/collection/delete", isAuth, shopController.clearItemFromCart);

router.post("/collection/remove", isAuth, shopController.removeFromCart);

module.exports = router;
