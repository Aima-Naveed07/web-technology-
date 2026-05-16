const express  = require("express");
const mongoose = require("mongoose");
const multer   = require("multer");
const path     = require("path");
const fs       = require("fs");
const Product  = require("./models/Product");

const app = express();

mongoose.connect("mongodb://localhost:27017/khaadi")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// ── Multer config for image uploads ──────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads"),
  filename:    (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ok = /jpeg|jpg|png|webp|gif/.test(file.mimetype);
    cb(ok ? null : new Error("Only image files allowed"), ok);
  }
});

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

// ═════════════════════════════════════════════════════════════
//                       ADMIN PANEL
// ═════════════════════════════════════════════════════════════

// Dashboard — list all products
app.get("/admin", async (req, res) => {
  try {
    const products      = await Product.find().sort({ _id: -1 }).lean();
    const totalProducts = products.length;
    const totalStock    = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const totalCategories = new Set(products.map(p => p.category)).size;

    res.render("admin/dashboard", { products, totalProducts, totalStock, totalCategories });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ── CREATE ───────────────────────────────────────────────────
app.get("/admin/products/new", (req, res) => {
  res.render("admin/new", { error: null });
});

app.post("/admin/products", upload.single("image"), async (req, res) => {
  try {
    const { name, price, category, subCategory, stock, rating } = req.body;

    // Validation — no empty required fields
    if (!name || !price || !category || !subCategory || !stock || !req.file) {
      return res.render("admin/new", { error: "All fields including image are required." });
    }

    await Product.create({
      name:        name.trim(),
      price:       Number(price),
      category,
      subCategory,
      stock:       Number(stock),
      rating:      rating ? Number(rating) : 4.0,
      image:       "/uploads/" + req.file.filename
    });

    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    res.render("admin/new", { error: "Failed to create product: " + err.message });
  }
});

// ── UPDATE ───────────────────────────────────────────────────
app.get("/admin/products/:id/edit", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).send("Product not found");
    res.render("admin/edit", { product, error: null });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

app.post("/admin/products/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, category, subCategory, stock, rating } = req.body;

    if (!name || !price || !category || !subCategory || !stock) {
      const product = await Product.findById(req.params.id).lean();
      return res.render("admin/edit", { product, error: "All fields are required." });
    }

    const update = {
      name:        name.trim(),
      price:       Number(price),
      category,
      subCategory,
      stock:       Number(stock),
      rating:      rating ? Number(rating) : 4.0
    };

    // Replace image only if a new file was uploaded
    if (req.file) {
      const oldProduct = await Product.findById(req.params.id);
      // Delete the old uploaded file if it lives in /uploads/
      if (oldProduct && oldProduct.image && oldProduct.image.startsWith("/uploads/")) {
        const oldPath = path.join(__dirname, "public", oldProduct.image);
        fs.unlink(oldPath, () => {}); // ignore errors
      }
      update.image = "/uploads/" + req.file.filename;
    }

    await Product.findByIdAndUpdate(req.params.id, update);
    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    res.status(500).send("Update failed: " + err.message);
  }
});

// ── DELETE ───────────────────────────────────────────────────
app.post("/admin/products/:id/delete", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product && product.image && product.image.startsWith("/uploads/")) {
      const filePath = path.join(__dirname, "public", product.image);
      fs.unlink(filePath, () => {}); // ignore errors
    }
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    res.status(500).send("Delete failed");
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
