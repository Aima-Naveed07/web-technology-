require("dotenv").config();

const express      = require("express");
const mongoose     = require("mongoose");
const multer       = require("multer");
const path         = require("path");
const fs           = require("fs");
const session      = require("express-session");
const { MongoStore } = require("connect-mongo");
const flash        = require("connect-flash");

const Product = require("./models/Product");
const User    = require("./models/User");
const { isLoggedIn, isAdmin } = require("./middleware/auth");

const app = express();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/khaadi";

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// ── Sessions (stored in MongoDB) ──────────────────────────────
app.use(session({
  secret: "khaadi-secret-change-me",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } // 7 days
}));

// ── Flash messages ────────────────────────────────────────────
app.use(flash());

// ── Make current user & flash available to every EJS template ─
app.use(async (req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error   = req.flash("error");
  res.locals.currentUser = null;
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId).lean();
      res.locals.currentUser = user;
    } catch (e) {
      res.locals.currentUser = null;
    }
  }
  next();
});

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
//                       AUTHENTICATION
// ═════════════════════════════════════════════════════════════

// ── Register ─────────────────────────────────────────────────
app.get("/register", (req, res) => {
  res.render("auth/register", { formData: {} });
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      req.flash("error", "All fields are required.");
      return res.redirect("/register");
    }
    if (password.length < 6) {
      req.flash("error", "Password must be at least 6 characters.");
      return res.redirect("/register");
    }
    if (password !== confirmPassword) {
      req.flash("error", "Passwords do not match.");
      return res.redirect("/register");
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      req.flash("error", "Email is already registered.");
      return res.redirect("/register");
    }

    const user = await User.create({ name, email, password });
    req.session.userId = user._id;
    req.flash("success", `Welcome, ${user.name}! Your account has been created.`);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    req.flash("error", "Registration failed: " + err.message);
    res.redirect("/register");
  }
});

// ── Login ────────────────────────────────────────────────────
app.get("/login", (req, res) => {
  res.render("auth/login", { formData: {} });
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      req.flash("error", "Email and password are required.");
      return res.redirect("/login");
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/login");
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/login");
    }

    req.session.userId = user._id;
    req.flash("success", `Welcome back, ${user.name}!`);
    res.redirect(user.role === "admin" ? "/admin" : "/");
  } catch (err) {
    console.error(err);
    req.flash("error", "Login failed: " + err.message);
    res.redirect("/login");
  }
});

// ── Logout ───────────────────────────────────────────────────
app.post("/logout", (req, res) => {
  // Clear the user identity from the session but keep the session alive
  // so the success flash survives the redirect.
  delete req.session.userId;
  req.flash("success", "You have successfully logged out.");
  req.session.save(() => res.redirect("/"));
});

// ── Profile (logged-in users) ────────────────────────────────
app.get("/profile", isLoggedIn, (req, res) => {
  res.render("auth/profile");
});

// ── Checkout (protected example) ─────────────────────────────
app.get("/checkout", isLoggedIn, (req, res) => {
  res.render("checkout");
});

// ═════════════════════════════════════════════════════════════
//                       ADMIN PANEL
// ═════════════════════════════════════════════════════════════

// Dashboard — list all products
app.get("/admin", isAdmin, async (req, res) => {
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
app.get("/admin/products/new", isAdmin, (req, res) => {
  res.render("admin/new", { error: null });
});

app.post("/admin/products", isAdmin, upload.single("image"), async (req, res) => {
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
app.get("/admin/products/:id/edit", isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).send("Product not found");
    res.render("admin/edit", { product, error: null });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

app.post("/admin/products/:id", isAdmin, upload.single("image"), async (req, res) => {
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
app.post("/admin/products/:id/delete", isAdmin, async (req, res) => {
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

// ═════════════════════════════════════════════════════════════
//                  REST API (JSON) — JWT secured
// ═════════════════════════════════════════════════════════════
app.use("/api/v1", require("./routes/api"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
