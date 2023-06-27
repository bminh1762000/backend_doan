const express = require("express");

const productController = require("../controllers/product");

const router = express.Router();

router.get("/", productController.getProducts);

router.post("/", productController.createProduct);

router.get("/:productId", productController.getProduct);

router.put("/:productId", productController.updateProduct);

router.delete("/:productId", productController.deleteProduct);

module.exports = router;
