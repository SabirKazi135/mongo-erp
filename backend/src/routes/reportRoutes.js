const router = require("express").Router();

const protect = require("../middlewares/authMiddleware");

const {
  getSummary,
  getInvoiceReport,
  getItemReport,
} = require("../controllers/reportController");

router.get("/summary", protect, getSummary);
router.get("/invoices", protect, getInvoiceReport);
router.get("/items", protect, getItemReport);

module.exports = router;
