const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { application } = require("express");
const app = express();

mongoose
  .connect("mongodb://localhost:27017/Sample", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database Successfully");
  })
  .catch(() => {
    console.log(err);
  });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
});

const Product = new mongoose.model("Product", productSchema);

// create product
app.post("/api/v1/product/new", async (req, res) => {
  const pdt = await Product.create(req.body);

  res.status(200).json({
    success: true,
    pdt,
  });
});

// read product
app.get("/api/v1/products", async (req, res) => {
  const pdt = await Product.find();

  res.status(200).json({ success: true, pdt });
});

// update product
app.put("/api/v1/products/:id", async (req, res) => {
  let pdt = await Product.findById(req.params.id);

  if (!pdt) {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }

  pdt = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    useFindAndModify: false,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    pdt,
  });
});

// delete product
app.delete("/api/v1/product/:id", async (req, res) => {
  const pdt = await Product.findById(req.params.id);

  if (!pdt) {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }

  await pdt.remove();

  res.status(200).json({
    success: true,
    message: "Product is deleted successfully!",
  });
});

app.listen(4500, () => {
  console.log("Server is running at https://localhost:4500");
});
