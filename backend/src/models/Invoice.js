const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    billNo: String,
    customerName: String,
    address: String,
    mobile: String,
    billDate: String,

    items: [
      {
        itemId: String,
        itemName: String,
        qty: Number,
        rate: Number,
        amount: Number,
      },
    ],

    subtotal: Number,
    grandTotal: Number,

    isDraft: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Invoice", invoiceSchema);
