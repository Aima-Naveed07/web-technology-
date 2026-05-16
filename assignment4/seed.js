const mongoose = require("mongoose");
const Product  = require("./models/Product");

const images = [
  "/pp1.jpg", "/pp2.jpg", "/pp3.jpg", "/pp4.jpg", "/pp5.jpg", "/pp6.jpg", "/pp7.webp",
  "/bs1.webp", "/bs2.webp", "/bs3.jpg", "/bs4.webp", "/bs5.webp",
  "/bs6.jpg",  "/bs7.webp", "/bs8.jpg", "/bs9.jpg",  "/bs10.jpg"
];
const img = i => images[i % images.length];

// ── helpers ──────────────────────────────────────────────────
const r  = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const rt = (min, max) => Math.round((Math.random() * (max - min) + min) * 10) / 10;

// ── NEW IN — 30 products ─────────────────────────────────────
const newIn = [
  { name: "Embroidered Lawn Kurta",          subCategory: "unstitched", price: 4500 },
  { name: "Printed Cotton Shirt",            subCategory: "casual",     price: 3800 },
  { name: "Formal Khaddar Suit",             subCategory: "formal",     price: 6500 },
  { name: "Casual Linen Top",               subCategory: "casual",     price: 2800 },
  { name: "Summer Lawn 3-Piece",            subCategory: "unstitched", price: 5500 },
  { name: "Chikankari Embroidered Suit",    subCategory: "formal",     price: 7200 },
  { name: "Block Print Casual Kameez",      subCategory: "casual",     price: 3200 },
  { name: "Net Embroidered Formal",         subCategory: "formal",     price: 8000 },
  { name: "Digital Print Lawn",             subCategory: "unstitched", price: 4200 },
  { name: "Floral Casual Shirt",            subCategory: "casual",     price: 2900 },
  { name: "Embroidered Organza Suit",       subCategory: "formal",     price: 9500 },
  { name: "Casual Cotton Kurti",            subCategory: "casual",     price: 2500 },
  { name: "Formal Silk Blend Suit",         subCategory: "formal",     price: 7800 },
  { name: "Textured Lawn Dupatta Set",      subCategory: "unstitched", price: 5200 },
  { name: "Embellished Neckline Kurta",     subCategory: "formal",     price: 6000 },
  { name: "Printed Karandi 3-Piece",        subCategory: "unstitched", price: 5800 },
  { name: "Casual Jersey Kameez",           subCategory: "casual",     price: 3000 },
  { name: "Hand-Embroidered Formal Suit",   subCategory: "formal",     price: 8500 },
  { name: "Summer Pret Collection",         subCategory: "casual",     price: 4000 },
  { name: "Zari Work Kurta",               subCategory: "formal",     price: 7000 },
  { name: "Mirror Work Casual Top",         subCategory: "casual",     price: 3400 },
  { name: "Sequin Embroidered Formal",      subCategory: "formal",     price: 9000 },
  { name: "Batik Print Casual Kameez",      subCategory: "casual",     price: 3100 },
  { name: "Stripe Formal Shirt",            subCategory: "formal",     price: 5500 },
  { name: "Lace Trim Casual Top",           subCategory: "casual",     price: 2700 },
  { name: "Dobby Weave Suit",              subCategory: "unstitched", price: 4800 },
  { name: "Jacquard Formal Kurta",          subCategory: "formal",     price: 6800 },
  { name: "Crinkle Chiffon Suit",          subCategory: "unstitched", price: 5100 },
  { name: "Kota Doria 3-Piece",            subCategory: "unstitched", price: 6200 },
  { name: "Embroidered Georgette Suit",     subCategory: "formal",     price: 7500 },
].map((p, i) => ({ ...p, category: "new-in",       subCategory: i % 2 === 0 ? "lawn" : "khaddar", rating: rt(3.8, 5.0), stock: r(3, 30), image: img(i) }));

// ── READY TO WEAR — 30 products ──────────────────────────────
const readyToWear = [
  { name: "Classic Formal Kurta",           subCategory: "formal",  price: 7000 },
  { name: "Casual Printed Kameez",          subCategory: "casual",  price: 4200 },
  { name: "Party Wear Embroidered Suit",    subCategory: "party",   price: 9500 },
  { name: "Everyday Basics Set",            subCategory: "basics",  price: 3500 },
  { name: "Office Formal Suit",             subCategory: "formal",  price: 8000 },
  { name: "Chiffon Party Suit",             subCategory: "party",   price: 11000 },
  { name: "Cotton Casual Kurti",            subCategory: "casual",  price: 3200 },
  { name: "Embroidered Formal 3-Piece",     subCategory: "formal",  price: 9200 },
  { name: "Lawn Casual Kameez",             subCategory: "casual",  price: 3800 },
  { name: "Silk Blend Formal Suit",         subCategory: "formal",  price: 10500 },
  { name: "Crepe Party Wear",              subCategory: "party",   price: 8800 },
  { name: "Linen Basic Kurta",             subCategory: "basics",  price: 3000 },
  { name: "Formal Velvet Suit",            subCategory: "formal",  price: 12000 },
  { name: "Casual Denim Shirt",            subCategory: "casual",  price: 4500 },
  { name: "Embroidered Party Gown",         subCategory: "party",   price: 14000 },
  { name: "Stripe Formal Kameez",          subCategory: "formal",  price: 6500 },
  { name: "Casual Kurti with Palazzo",     subCategory: "casual",  price: 5000 },
  { name: "Bridal Party Suit",             subCategory: "party",   price: 16000 },
  { name: "Cotton Basic Shirt Kurta",      subCategory: "basics",  price: 2800 },
  { name: "Formal Brocade Suit",           subCategory: "formal",  price: 11500 },
  { name: "Casual Khadi Kameez",           subCategory: "casual",  price: 4000 },
  { name: "Embroidered Party Lehenga",     subCategory: "party",   price: 18000 },
  { name: "Office Pencil Suit",            subCategory: "formal",  price: 7800 },
  { name: "Basic Crop Kurta",             subCategory: "basics",  price: 2500 },
  { name: "Formal Raw Silk Suit",          subCategory: "formal",  price: 9800 },
  { name: "Casual Linen Coord Set",        subCategory: "casual",  price: 5500 },
  { name: "Party Maxi Dress",             subCategory: "party",   price: 13000 },
  { name: "Formal Pant Suit",             subCategory: "formal",  price: 8500 },
  { name: "Basic Embroidered Kurti",      subCategory: "basics",  price: 3200 },
  { name: "Casual Printed Coord Set",     subCategory: "casual",  price: 4800 },
].map((p, i) => ({ ...p, category: "ready-to-wear", subCategory: i % 2 === 0 ? "lawn" : "khaddar", rating: rt(3.8, 5.0), stock: r(3, 30), image: img(i) }));

/* fromRamadanToEid, fragrances, nowHappening routes removed */

// ── FROM RAMADAN TO EID — removed ───────────────────────────
const eid = [
  { name: "Eid Embroidered Suit",          subCategory: "formal",      price: 12000 },
  { name: "Ramadan Lawn Collection",       subCategory: "unstitched",  price: 6500 },
  { name: "Festive Embroidered Kurta",     subCategory: "embroidered", price: 8500 },
  { name: "Eid Special 3-Piece",           subCategory: "formal",      price: 15000 },
  { name: "Eid Bridal Embroidered Suit",   subCategory: "formal",      price: 22000 },
  { name: "Ramadan Unstitched Lawn",       subCategory: "unstitched",  price: 7200 },
  { name: "Festive Chiffon Suit",          subCategory: "formal",      price: 9800 },
  { name: "Eid Formal Organza Set",        subCategory: "formal",      price: 14500 },
  { name: "Ramadan Cotton Suit",           subCategory: "unstitched",  price: 5500 },
  { name: "Eid Embroidered Net",           subCategory: "embroidered", price: 11000 },
  { name: "Festive Jacquard Suit",         subCategory: "formal",      price: 10200 },
  { name: "Eid Velvet Shawl Set",          subCategory: "formal",      price: 16000 },
  { name: "Ramadan Printed Lawn",          subCategory: "unstitched",  price: 6000 },
  { name: "Eid Mirror Work Suit",          subCategory: "embroidered", price: 13000 },
  { name: "Festive Zari Embroidered",      subCategory: "embroidered", price: 9500 },
  { name: "Eid Karandi Formal",            subCategory: "formal",      price: 11500 },
  { name: "Ramadan Unstitched Khaddar",    subCategory: "unstitched",  price: 5800 },
  { name: "Eid Chikankari Suit",           subCategory: "embroidered", price: 12500 },
  { name: "Festive Embroidered Georgette", subCategory: "embroidered", price: 8800 },
  { name: "Eid Party Wear Net",            subCategory: "formal",      price: 17000 },
  { name: "Ramadan Premium Lawn",          subCategory: "unstitched",  price: 7800 },
  { name: "Eid Sequin Formal Suit",        subCategory: "formal",      price: 19000 },
  { name: "Festive Hand Embroidered",      subCategory: "embroidered", price: 10800 },
  { name: "Eid Limited Edition Suit",      subCategory: "formal",      price: 24000 },
  { name: "Ramadan Silk Blend Set",        subCategory: "unstitched",  price: 8200 },
  { name: "Eid Luxury Embroidered",        subCategory: "embroidered", price: 20000 },
  { name: "Festive Banarsi Suit",          subCategory: "formal",      price: 15500 },
  { name: "Eid Tilla Work Formal",         subCategory: "embroidered", price: 13800 },
  { name: "Ramadan Unstitched Premium",    subCategory: "unstitched",  price: 9000 },
  { name: "Eid Bridal Collection",         subCategory: "formal",      price: 28000 },
].map((p, i) => ({ ...p, category: "eid",           rating: rt(3.9, 5.0), stock: r(3, 20), image: img(i) }));

// ── FABRICS — 30 products ────────────────────────────────────
const fabrics = [
  { name: "Premium Karandi Fabric",        subCategory: "karandi", price: 7500 },
  { name: "Winter Khaddar Fabric",         subCategory: "khaddar", price: 5500 },
  { name: "Summer Lawn Fabric",            subCategory: "lawn",    price: 4000 },
  { name: "Cotton Dobby Fabric",           subCategory: "cotton",  price: 3500 },
  { name: "Embroidered Karandi 3m",        subCategory: "karandi", price: 8200 },
  { name: "Plain Khaddar Winter",          subCategory: "khaddar", price: 4800 },
  { name: "Printed Lawn 3-Piece Fabric",   subCategory: "lawn",    price: 5200 },
  { name: "Organic Cotton Fabric",         subCategory: "cotton",  price: 4200 },
  { name: "Jacquard Karandi Weave",        subCategory: "karandi", price: 9000 },
  { name: "Heavy Khaddar Embroidered",     subCategory: "khaddar", price: 7000 },
  { name: "Digital Print Lawn Fabric",     subCategory: "lawn",    price: 4500 },
  { name: "Dobby Cotton Weave",            subCategory: "cotton",  price: 3800 },
  { name: "Self-Stripe Karandi",           subCategory: "karandi", price: 6800 },
  { name: "Yarn-Dyed Khaddar",            subCategory: "khaddar", price: 6200 },
  { name: "Floral Lawn Print",            subCategory: "lawn",    price: 3800 },
  { name: "Linen Cotton Blend",           subCategory: "cotton",  price: 5000 },
  { name: "Embroidered Lawn Fabric",      subCategory: "lawn",    price: 6500 },
  { name: "Woven Karandi Fabric",         subCategory: "karandi", price: 7800 },
  { name: "Brushed Khaddar Fabric",       subCategory: "khaddar", price: 5800 },
  { name: "Swiss Lawn Premium",           subCategory: "lawn",    price: 6000 },
  { name: "Cotton Voile Fabric",          subCategory: "cotton",  price: 3200 },
  { name: "Karandi Self-Embossed",        subCategory: "karandi", price: 8500 },
  { name: "Khaddar Check Pattern",        subCategory: "khaddar", price: 5200 },
  { name: "Premium Lawn 5m Roll",         subCategory: "lawn",    price: 7200 },
  { name: "Organic Karandi Fabric",       subCategory: "karandi", price: 7000 },
  { name: "Winter Khaddar Tweed",         subCategory: "khaddar", price: 6500 },
  { name: "Summer Lawn Plain",            subCategory: "lawn",    price: 3500 },
  { name: "Cotton Muslin Fabric",         subCategory: "cotton",  price: 2800 },
  { name: "Embroidered Khaddar Fabric",   subCategory: "khaddar", price: 7500 },
  { name: "Lawn Fabric Bundle 5m",        subCategory: "lawn",    price: 8000 },
].map((p, i) => ({ ...p, category: "fabrics",       subCategory: i % 2 === 0 ? "lawn" : "khaddar", rating: rt(3.8, 5.0), stock: r(5, 40), image: img(i) }));

// ── FRAGRANCES — 30 products ─────────────────────────────────
const fragrances = [
  { name: "Rose Garden Eau de Parfum",    subCategory: "floral",    price: 3500 },
  { name: "Oud Woody Fragrance",          subCategory: "woody",     price: 5500 },
  { name: "Fresh Ocean Scent",            subCategory: "fresh",     price: 2800 },
  { name: "Oriental Musk Perfume",        subCategory: "oriental",  price: 4800 },
  { name: "Jasmine Blossom EDP",          subCategory: "floral",    price: 4200 },
  { name: "Sandalwood Elixir",            subCategory: "woody",     price: 6000 },
  { name: "Citrus Fresh Cologne",         subCategory: "fresh",     price: 3200 },
  { name: "Amber Oriental Perfume",       subCategory: "oriental",  price: 5200 },
  { name: "Peony Floral EDP",             subCategory: "floral",    price: 3800 },
  { name: "Cedar Wood Intense",           subCategory: "woody",     price: 6500 },
  { name: "Aqua Marine Cologne",          subCategory: "fresh",     price: 3000 },
  { name: "Saffron Oud Perfume",          subCategory: "oriental",  price: 7000 },
  { name: "Lavender Fields EDP",          subCategory: "floral",    price: 3600 },
  { name: "Dark Oud Premium",             subCategory: "woody",     price: 8000 },
  { name: "Green Tea Fresh Mist",         subCategory: "fresh",     price: 2500 },
  { name: "Spiced Rose Oriental",         subCategory: "oriental",  price: 5800 },
  { name: "Lily of the Valley EDP",       subCategory: "floral",    price: 4000 },
  { name: "Vetiver Wood Cologne",         subCategory: "woody",     price: 5000 },
  { name: "Sea Breeze Fresh Spray",       subCategory: "fresh",     price: 2200 },
  { name: "Persian Rose Attar",           subCategory: "oriental",  price: 6200 },
  { name: "Vanilla Musk Perfume",         subCategory: "oriental",  price: 4500 },
  { name: "Bergamot Fresh EDP",           subCategory: "fresh",     price: 3400 },
  { name: "Black Oud Premium",            subCategory: "woody",     price: 9000 },
  { name: "White Floral Bouquet",         subCategory: "floral",    price: 4600 },
  { name: "Forest Wood Cologne",          subCategory: "woody",     price: 5500 },
  { name: "Tuberose Oriental",            subCategory: "oriental",  price: 5000 },
  { name: "Cool Aqua Mist",              subCategory: "fresh",     price: 2800 },
  { name: "Royal Oud Collection",         subCategory: "woody",     price: 10000 },
  { name: "Spring Bloom EDP",             subCategory: "floral",    price: 3900 },
  { name: "Evening Musk Parfum",          subCategory: "oriental",  price: 5600 },
].map((p, i) => ({ ...p, category: "fragrances",    rating: rt(3.8, 5.0), stock: r(5, 25), image: img(i) }));

// ── SALE — 30 products ───────────────────────────────────────
const sale = [
  { name: "Discounted Lawn Suit",          subCategory: "unstitched", price: 3500 },
  { name: "Formal Kurta on Sale",          subCategory: "formal",     price: 4500 },
  { name: "Casual Summer Top",             subCategory: "casual",     price: 2200 },
  { name: "Embroidered Khaddar Sale",      subCategory: "formal",     price: 5000 },
  { name: "Printed Lawn 3-Piece",          subCategory: "unstitched", price: 4200 },
  { name: "Clearance Formal Suit",         subCategory: "formal",     price: 5500 },
  { name: "Sale Casual Kameez",            subCategory: "casual",     price: 2800 },
  { name: "Discounted Party Wear",         subCategory: "formal",     price: 6000 },
  { name: "Markdown Unstitched Lawn",      subCategory: "unstitched", price: 3800 },
  { name: "Sale Formal Dupatta Set",       subCategory: "formal",     price: 4800 },
  { name: "Reduced Price Cotton Suit",     subCategory: "casual",     price: 3200 },
  { name: "Clearance Embroidered Set",     subCategory: "formal",     price: 5200 },
  { name: "Last Piece Casual Shirt",       subCategory: "casual",     price: 1800 },
  { name: "Sale Formal Kurta Set",         subCategory: "formal",     price: 4200 },
  { name: "Discounted Karandi",            subCategory: "unstitched", price: 4500 },
  { name: "Clearance Unstitched Khaddar",  subCategory: "unstitched", price: 3600 },
  { name: "Sale Casual Kurti",             subCategory: "casual",     price: 2000 },
  { name: "Discounted Embroidered Net",    subCategory: "formal",     price: 5800 },
  { name: "Markdown Formal Suit",          subCategory: "formal",     price: 4600 },
  { name: "Sale Printed Cotton",           subCategory: "casual",     price: 2500 },
  { name: "Clearance Party Wear",          subCategory: "formal",     price: 6500 },
  { name: "Discounted Casual Set",         subCategory: "casual",     price: 2200 },
  { name: "Sale Formal Pant Suit",         subCategory: "formal",     price: 5000 },
  { name: "Reduced Unstitched Lawn",       subCategory: "unstitched", price: 3200 },
  { name: "Clearance Casual Coord",        subCategory: "casual",     price: 2800 },
  { name: "Discounted Silk Blend",         subCategory: "formal",     price: 5500 },
  { name: "Sale Embroidered Formal",       subCategory: "formal",     price: 4900 },
  { name: "Markdown Cotton Casual",        subCategory: "casual",     price: 1900 },
  { name: "Clearance Unstitched Set",      subCategory: "unstitched", price: 3400 },
  { name: "Sale Last Call Collection",     subCategory: "casual",     price: 2100 },
].map((p, i) => ({ ...p, category: "sale",          subCategory: i % 2 === 0 ? "lawn" : "khaddar", rating: rt(3.7, 4.8), stock: r(3, 25), image: img(i) }));

// ── NOW HAPPENING — 30 products ──────────────────────────────
const nowHappening = [
  { name: "Flash Sale Collection",          subCategory: "new-arrival",     price: 6500 },
  { name: "Limited Edition Embroidered",    subCategory: "limited-edition", price: 12000 },
  { name: "Bestseller Lawn Suit",           subCategory: "bestseller",      price: 8000 },
  { name: "Seasonal Special Kurta",         subCategory: "new-arrival",     price: 5500 },
  { name: "New Arrival Premium Set",        subCategory: "new-arrival",     price: 9500 },
  { name: "Limited Run Party Wear",         subCategory: "limited-edition", price: 15000 },
  { name: "Bestselling Casual Kameez",      subCategory: "bestseller",      price: 4500 },
  { name: "Flash Deal Formal Suit",         subCategory: "new-arrival",     price: 7200 },
  { name: "New Launch Embroidered",         subCategory: "new-arrival",     price: 8800 },
  { name: "Limited Edition Eid Suit",       subCategory: "limited-edition", price: 18000 },
  { name: "Bestseller Formal Suit",         subCategory: "bestseller",      price: 10000 },
  { name: "Weekend Special Lawn",           subCategory: "new-arrival",     price: 5800 },
  { name: "New Collection Unveiled",        subCategory: "new-arrival",     price: 7500 },
  { name: "Limited Khaddar Edition",        subCategory: "limited-edition", price: 9000 },
  { name: "Top Selling Lawn Set",           subCategory: "bestseller",      price: 6200 },
  { name: "Exclusive Launch Offer",         subCategory: "new-arrival",     price: 8200 },
  { name: "New Season Arrivals",            subCategory: "new-arrival",     price: 6800 },
  { name: "Limited Organza Edition",        subCategory: "limited-edition", price: 14000 },
  { name: "Most Popular Formal",            subCategory: "bestseller",      price: 9200 },
  { name: "Flash Collection Kameez",        subCategory: "new-arrival",     price: 5200 },
  { name: "New In Store Today",             subCategory: "new-arrival",     price: 7000 },
  { name: "Limited Chiffon Suit",           subCategory: "limited-edition", price: 11000 },
  { name: "Bestseller Casual Top",          subCategory: "bestseller",      price: 3800 },
  { name: "Weekend Flash Deal Suit",        subCategory: "new-arrival",     price: 6500 },
  { name: "New Embroidered Launch",         subCategory: "new-arrival",     price: 9000 },
  { name: "Limited Edition Formal",         subCategory: "limited-edition", price: 16000 },
  { name: "Top Pick of the Week",           subCategory: "bestseller",      price: 7800 },
  { name: "New Season Catalog Suit",        subCategory: "new-arrival",     price: 8500 },
  { name: "Limited Stock Lawn",             subCategory: "limited-edition", price: 5500 },
  { name: "Today's Best Deal",             subCategory: "bestseller",      price: 4200 },
].map((p, i) => ({ ...p, category: "now-happening", rating: rt(3.9, 5.0), stock: r(3, 20), image: img(i) }));

// ── Seed ─────────────────────────────────────────────────────
const all = [...newIn, ...readyToWear, ...fabrics, ...sale];

mongoose.connect("mongodb://localhost:27017/khaadi")
  .then(async () => {
    await Product.deleteMany({});
    await Product.insertMany(all);
    const counts = {};
    all.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
    console.log(`Seeded ${all.length} products total:`);
    Object.entries(counts).forEach(([cat, n]) => console.log(`  ${cat}: ${n}`));
    mongoose.connection.close();
  })
  .catch(err => { console.error("Seed error:", err); process.exit(1); });
