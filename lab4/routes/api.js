const express = require("express");
const jwt     = require("jsonwebtoken");

const Product = require("../models/Product");
const User    = require("../models/User");
const Order   = require("../models/Order");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();
router.use(express.json());

// ─────────────────────────────────────────────────────────────
// AUTH — POST /api/v1/auth/login
// ─────────────────────────────────────────────────────────────
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { user_id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed: " + err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// PUBLIC — GET /api/v1/products  (pagination + filtering)
// ─────────────────────────────────────────────────────────────
router.get("/products", async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 8);

    const filter = {};
    if (req.query.search)   filter.name = { $regex: req.query.search, $options: "i" };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    const total      = await Product.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const products   = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({ page, limit, total, totalPages, count: products.length, products });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// PUBLIC — GET /api/v1/products/:id
// ─────────────────────────────────────────────────────────────
router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ product });
  } catch (err) {
    res.status(400).json({ error: "Invalid product id" });
  }
});

// ─────────────────────────────────────────────────────────────
// PROTECTED — POST /api/v1/orders   (requires JWT)
// Body: { items: [{ product: "<id>", quantity: 2 }, ...] }
// ─────────────────────────────────────────────────────────────
router.post("/orders", verifyToken, async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Order must contain at least one item" });
    }

    const orderItems = [];
    let total = 0;

    for (const it of items) {
      const product = await Product.findById(it.product);
      if (!product) return res.status(404).json({ error: `Product ${it.product} not found` });

      const qty = Math.max(1, parseInt(it.quantity) || 1);
      orderItems.push({
        product:  product._id,
        name:     product.name,
        price:    product.price,
        quantity: qty
      });
      total += product.price * qty;
    }

    const order = await Order.create({
      user:  req.user.user_id,
      items: orderItems,
      total
    });

    res.status(201).json({ message: "Order placed", order });
  } catch (err) {
    res.status(500).json({ error: "Order creation failed: " + err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// PROTECTED — GET /api/v1/user/profile  (requires JWT)
// ─────────────────────────────────────────────────────────────
router.get("/user/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.user_id).select("-password").lean();
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

module.exports = router;
