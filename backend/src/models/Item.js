const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
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

    itemName: { type: String, required: true },
    brandName: String,
    hsnCode: String,
    unit: String,
    salePrice: { type: Number, default: 0 },
    purchasePrice: { type: Number, default: 0 },
    stockQty: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Item", itemSchema);
