const Product = require("../models/product");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    if (!products) {
      const error = new Error("Could not find products");
      error.status = 404;
      throw error;
    }
    res.status(200).json({ message: "Fetched", products: products });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error("Product could not find.");
      error.status = 404;
      throw error;
    }
    res.status(200).json({ product: product });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      const error = new Error("Product could not find.");
      error.status = 404;
      throw error;
    }
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  const { title, imageUrl, price, category, ship, quantity, description } =
    req.body;
  try {
    const product = new Product({
      title: title,
      imageUrl: imageUrl,
      price: price,
      category: category,
      ship: ship,
      quantity: quantity,
      description: description,
    });
    const result = await product.save();
    res.status(201).json({ message: "Product created", product: result });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }

    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  const productId = req.params.productId;
  const { title, imageUrl, price, category, ship, quantity, description } =
    req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error("Product could not find.");
      error.status = 404;
      throw error;
    }
    product.title = title;
    product.imageUrl = imageUrl;
    product.price = price;
    product.category = category;
    product.ship = ship;
    product.quantity = quantity;
    product.description = description;
    const result = await product.save();
    res.status(200).json({ message: "Successfully", product: result });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

// exports.createProducts = async (req, res, next) => {
//   try {
//     INITIAL_DATA.forEach(async ({ title, imageUrl, price, category, ship }) => {
//       const newProduct = new Product({
//         title: title,
//         imageUrl: imageUrl,
//         price: price,
//         category: category,
//         ship: ship,
//       });
//       await newProduct.save();
//     });
//     res
//       .status(200)
//       .json({ message: "Fetch successfully", product: INITIAL_DATA });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

// export const INITIAL_DATA = [
//   {
//     title: "HP Pavionlion X360",
//     imageUrl:
//       "https://www.hanoicomputer.vn/laptop-hp-pavilion-x360-14-dw1019tu-2h3n7pa-vang",
//     price: 30000000,
//     category: "hp",
//     ship: true,
//   },
//   {
//     title: "HP 340S G7",
//     imageUrl:
//       "https://hanoicomputercdn.com/media/product/250_58339_laptop_hp_340s_g7_11.png",
//     price: 24000000,
//     category: "hp",
//     ship: false,
//   },
//   {
//     title: "HP 430 G8",
//     imageUrl:
//       "https://hanoicomputercdn.com/media/product/250_59099_laptop_hp_probook_430_g8_2z6e9pa_bac_4.jpg",
//     price: 11000000,
//     category: "hp",
//     ship: true,
//   },
//   {
//     title: "HP 245 G8",
//     imageUrl:
//       "https://hanoicomputercdn.com/media/product/250_59100_laptop_hp_245_g8_342g2pa_bac_4.jpg",
//     price: 13000000,
//     category: "hp",
//     ship: false,
//   },
//   {
//     title: "HP Envy 13",
//     imageUrl:
//       "https://hanoicomputercdn.com/media/product/250_56044_laptop_hp_envy_13_12.png",
//     price: 15000000,
//     category: "hp",
//     ship: false,
//   },
//   {
//     title: "HP Pavionlion 14",
//     imageUrl:
//       "https://hanoicomputercdn.com/media/product/250_57702_laptop_hp_pavilion_14_10.jpg",
//     price: 12000000,
//     category: "hp",
//     ship: true,
//   },
//   {
//     title: "HP 15S",
//     imageUrl:
//       "https://hanoicomputercdn.com/media/product/250_56918_laptop_hp_15s_10.jpg",
//     price: 26000000,
//     category: "hp",
//     ship: true,
//   },
//   {
//     title: "DELL Inspiron 5490",
//     imageUrl:
//       "https://hanoicomputercdn.com/media/product/250_56918_laptop_hp_15s_10.jpg",
//     price: 25599000,
//     category: "dell",
//     ship: true,
//   },
//   {
//     title: "DELL Inspiron 7501",
//     imageUrl:
//       "https://hanoicomputercdn.com/media/product/250_56918_laptop_hp_15s_10.jpg",
//     price: 22500000,
//     category: "dell",
//     ship: true,
//   },
//   {
//     title: "DELL Vostro 3401",
//     imageUrl:
//       "https://hanoicomputercdn.com/media/product/250_56444_vostro3401__5_.png",
//     price: 12499000,
//     category: "dell",
//     ship: true,
//   },
//   {
//     title: "DELL Vostro 3400",
//     imageUrl:
//       "https://hanoicomputercdn.com/media/product/250_57985_vostro_3400__5_.png",
//     price: 21000000,
//     category: "dell",
//     ship: true,
//   },
//   {
//     title: "DELL XPS 13 9310",
//     imageUrl:
//       "https://hanoicomputercdn.com/media/product/250_58394_xps9310__4_.png",
//     price: 14000000,
//     category: "dell",
//     ship: false,
//   },
//   {
//     title: "DELL Latitude 3510",
//     imageUrl:
//       "https://hanoicomputercdn.com/media/product/250_57088_latitude3510__4_.png",
//     price: 23000000,
//     category: "dell",
//     ship: true,
//   },
//   {
//     title: "Dell Vostro 5402",
//     imageUrl:
//       "https://hanoicomputercdn.com/media/product/250_56447_vostro5402__6_.png",
//     price: 19789000,
//     category: "dell",
//     ship: false,
//   },
//   {
//     title: "Dell Inspiron N5502A",
//     imageUrl:
//       "https://hanoicomputercdn.com/media/product/250_56447_vostro5402__6_.png",
//     price: 24589000,
//     category: "dell",
//     ship: false,
//   },
//   {
//     title: "Dell Inspiron 3501",
//     imageUrl:
//       "https://hanoicomputercdn.com/media/product/250_56447_vostro5402__6_.png",
//     price: 13289000,
//     category: "dell",
//     ship: false,
//   },
//   {
//     title: "Dell Vostro 3405",
//     imageUrl:
//       "https://hanoicomputercdn.com/media/product/250_56514_vosro3405__4_.png",
//     price: 9899000,
//     category: "dell",
//     ship: false,
//   },
//   {
//     title: "Lenovo Legion 5",
//     imageUrl:
//       "https://hanoicomputercdn.com/media/product/250_53888_laptop_lenovo_legion_5_15imh05_82au004xvn_den_4.png",
//     price: 22899000,
//     category: "lenovo",
//     ship: false,
//   },
//   {
//     title: "Lenovo Legion 7",
//     imageUrl:
//       "https://hanoicomputercdn.com/media/product/250_59058_laptop_lenovo_legion_7_16achg6_82n60038vn_xam_6.jpg",
//     price: 33899000,
//     category: "lenovo",
//     ship: true,
//   },
//   {
//     title: "Lenovo Gaming 3",
//     imageUrl:
//       "https://hanoicomputercdn.com/media/product/250_53891_laptop_lenovo_gaming_3_15imh05_81y4006svn_den_4.png",
//     price: 20999000,
//     category: "lenovo",
//     ship: true,
//   },
//   {
//     title: "Lenovo Ideapad 3",
//     imageUrl:
//       "https://hanoicomputercdn.com/media/product/250_58231_laptop_lenovo_ideapad_3_14itl6_82h700dnvn_xam_4.png",
//     price: 13899000,
//     category: "lenovo",
//     ship: true,
//   },
//   {
//     title: "Lenovo Legion 5P",
//     imageUrl:
//       "https://hanoicomputercdn.com/media/product/250_56633_laptop_lenovo_legion_5p_15imh05_82aw005pvn_den_6.png",
//     price: 26899000,
//     category: "lenovo",
//     ship: true,
//   },
//   {
//     title: "Lenovo Thinkpad E15",
//     imageUrl:
//       "https://hanoicomputercdn.com/media/product/250_52797_laptop_lenovo_thinkpad_e15_20rds0du00_6.jpg",
//     price: 20899000,
//     category: "lenovo",
//     ship: false,
//   },
//   {
//     title: "Lenovo Yoga Slim 7",
//     imageUrl:
//       "https://hanoicomputercdn.com/media/product/250_56961_yoga_slim_7__5_.png",
//     price: 14599000,
//     category: "lenovo",
//     ship: true,
//   },
//   {
//     title: "Lenovo ThinkBook 15",
//     imageUrl:
//       "https://hanoicomputercdn.com/media/product/250_52797_laptop_lenovo_thinkpad_e15_20rds0du00_6.jpg",
//     price: 20899000,
//     category: "lenovo",
//     ship: false,
//   },
//   {
//     title: "Lenovo Ideapad S145",
//     imageUrl:
//       "https://hanoicomputercdn.com/media/product/250_58231_laptop_lenovo_ideapad_3_14itl6_82h700dnvn_xam_4.png",
//     price: 10999000,
//     category: "lenovo",
//     ship: false,
//   },
//   {
//     title: "Lenovo Yoga Slim S7",
//     imageUrl:
//       "https://hanoicomputercdn.com/media/product/250_56961_yoga_slim_7__5_.png",
//     price: 24599000,
//     category: "lenovo",
//     ship: true,
//   },
// ];
