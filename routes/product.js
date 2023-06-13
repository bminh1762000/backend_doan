const express = require("express");

const productController = require("../controllers/product");

const router = express.Router();

router.get("/", productController.getProducts);

router.get("/:productId", productController.getProduct);

router.post("/", productController.createProducts);

module.exports = router;
