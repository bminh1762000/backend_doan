const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const cors = require("cors");

const authRoutes = require("./routes/auth");
const shopRoutes = require("./routes/shop");
const productRoutes = require("./routes/product");
const uploadRoutes = require("./routes/upload");
const orderRoutes = require("./routes/order");
const userRoutes = require("./routes/user");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/auth", authRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

mongoose
  .connect(process.env.MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected database");
    app.listen(process.env.PORT || 8080);
  })
  .catch((err) => {
    console.log(err);
  });
