const Invoice = require("../models/Invoice");
const Item = require("../models/Item");

const getSummary = async (req, res) => {
  try {
    const { companyId } = req.query;

    const invoices = await Invoice.find({
      userId: req.user.id,
      companyId,
      // error is here
    });

    const totalInvoices = invoices.length;

    const totalSales = invoices.reduce(
      (sum, inv) => sum + (inv.grandTotal || 0),
      0,
    );

    const totalQty = invoices.reduce((sum, inv) => {
      const qty = inv.items.reduce((a, b) => a + (b.qty || 0), 0);
      return sum + qty;
    }, 0);

    res.json({
      totalInvoices,
      totalSales,
      totalQty,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getInvoiceReport = async (req, res) => {
  try {
    const { companyId } = req.query;

    const invoices = await Invoice.find({
      userId: req.user.id,
      companyId,
    }).sort({ createdAt: -1 });

    res.json(invoices);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getItemReport = async (req, res) => {
  try {
    const { companyId } = req.query;

    const items = await Item.find({
      userId: req.user.id,
      companyId,
    }).sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getSummary,
  getInvoiceReport,
  getItemReport,
};
