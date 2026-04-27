const Invoice = require("../models/Invoice");

const createInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.create({
      userId: req.user.id,
      ...req.body,
    });

    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getInvoices = async (req, res) => {
  try {
    const { companyId, draft } = req.query;

    const filters = {
      userId: req.user.id,
      companyId,
    };

    if (draft === "true") {
      filters.isDraft = true;
    } else {
      filters.isDraft = { $ne: true };
    }

    const invoices = await Invoice.find(filters).sort({ createdAt: -1 });

    res.json(invoices);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    res.json({
      message: "Invoice deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  updateInvoice,
  getInvoiceById,
  deleteInvoice,
};
