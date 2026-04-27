const router = require("express").Router();

const protect = require("../middlewares/authMiddleware");

const {
  createInvoice,
  getInvoices,
  updateInvoice,
  getInvoiceById,
  deleteInvoice,
} = require("../controllers/invoiceController");

router.post("/", protect, createInvoice);
router.get("/", protect, getInvoices);
router.put("/:id", protect, updateInvoice);
router.get("/:id", protect, getInvoiceById);
router.delete("/:id", protect, deleteInvoice);

module.exports = router;
