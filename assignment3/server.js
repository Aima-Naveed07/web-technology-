const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/Product");

const app = express();

mongoose.connect("mongodb://localhost:27017/khaadi")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

app.set("view engine", "ejs");
app.use(express.static("public"));

const LIMIT = 8;

async function renderCatalog(res, view, pageTitle, activeNav, baseCategory, subCategories, query) {
  try {
    const page = Math.max(1, parseInt(query.page) || 1);

    const filter = { category: baseCategory };
    if (query.search)      filter.name = { $regex: query.search, $options: "i" };
    if (query.subCategory) filter.subCategory = query.subCategory;
    if (query.minPrice || query.maxPrice) {
      filter.price = {};
      if (query.minPrice) filter.price.$gte = Number(query.minPrice);
      if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
    }

    const total      = await Product.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / LIMIT));
    const products   = await Product.find(filter)
      .skip((page - 1) * LIMIT)
      .limit(LIMIT)
      .lean();

    res.render(view, { products, pageTitle, activeNav, currentPage: page, totalPages, total, subCategories, query });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error — is MongoDB running?");
  }
}

// ── Homepage ──────────────────────────────────────────────────
app.get("/", (req, res) => res.render("homepage"));

// ── Catalog pages ─────────────────────────────────────────────
const SUBCATS = ["lawn", "khaddar"];

app.get("/newIN", (req, res) =>
  renderCatalog(res, "newIN", "NEW IN", "newIN", "new-in", SUBCATS, req.query)
);

app.get("/readyToWear", (req, res) =>
  renderCatalog(res, "readyToWear", "READY TO WEAR", "readyToWear", "ready-to-wear", SUBCATS, req.query)
);

app.get("/fabrics", (req, res) =>
  renderCatalog(res, "Fabrics", "FABRICS", "fabrics", "fabrics", SUBCATS, req.query)
);

app.get("/sale", (req, res) =>
  renderCatalog(res, "sale", "SALE", "sale", "sale", SUBCATS, req.query)
);

app.listen(3000, () => console.log("Server running on port 3000"));
